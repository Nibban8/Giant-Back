const express = require("express");
const cors = require("cors");
const firebase = require("firebase");
const bodyParser = require("body-parser");
const { response } = require("express");

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

var firebaseConfig = {
  apiKey: "AIzaSyCnDNExUxaOHJDkJCbU0x_KjxJCDbmPuuQ",
  authDomain: "giant-1d6c6.firebaseapp.com",
  projectId: "giant-1d6c6",
  storageBucket: "giant-1d6c6.appspot.com",
  messagingSenderId: "419535352577",
  appId: "1:419535352577:web:1a338cd78eb42e52ec2100",
};

// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
const db = fb.firestore();

const stripe = require("stripe")(
  "sk_test_51IujvAIqOpiH1XDDQYgrNyuA1gjsfgYvfEFnON1dr4CRphI5FwNRjVCyqvZTinPVgspbeDN3MuRhIcKW3dCNSYNq003Jt4LYy9"
);

const PORT = process.env.PORT || 5000;

app.post("/checkout", async (req, res) => {
  const { equipo } = req.body;

  let items = [];

  const querySnapshot = await db.collection("partes").get();
  const docs = [];
  querySnapshot.forEach((doc) => {
    docs.push({ ...doc.data(), id: doc.id, selected: false });
  });

  for (const parte of equipo) {
    const { nombre, precio } = docs.find((doc) => doc.id === parte);
    const item = {
      price_data: {
        currency: "mxn",
        product_data: {
          name: nombre,
        },
        unit_amount: parseFloat(precio) * 100,
      },
      quantity: 1,
    };
    items.push(item);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items,
    shipping_address_collection: {
      allowed_countries: ["MX"],
    },
    mode: "payment",
    success_url: "https://example.com/success",
    // success_url: 'http://localhost:3000/finalizada',
    cancel_url: "https://example.com/cancel",
  });

  res.json({ id: session.id });
});

// app.post(
//   '/stripeWebHook',
//   express.raw({ type: 'application/json' }),
//   async (req, res) => {
//     const event = req.body;

//     const dataObject = event.data.object;

//     await db.collection('ensambles').doc().set({
//       checkoutSessionId: dataObject.id,
//       paymentStatus: dataObject.payment_status,
//       shippingInfo: dataObject.shipping,
//       amountTotal: dataObject.amount_total,
//       customerDetails: dataObject.customer_details,
//     });

//     response.json({ received: true });
//   }
// );

app.post(
  "/stripeWebHook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const stripe = require("stripe")(
      "sk_test_51IujvAIqOpiH1XDDQYgrNyuA1gjsfgYvfEFnON1dr4CRphI5FwNRjVCyqvZTinPVgspbeDN3MuRhIcKW3dCNSYNq003Jt4LYy9"
    );
    let event;

    try {
      const whSec = "whsec_5VVRkDpQQv0DNxns8fDMGqulnkdVdMFT"; // secret key

      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        whSec
      );
    } catch (error) {
      console.error(error);
      return res.sendStatus(400);
    }

    const dataObject = event.data.object;

    await admin.firestore().collection("ensambles").doc().set({
      checkoutSessionId: dataObject.id,
      paymentStatus: dataObject.payment_status,
      shippingInfo: dataObject.shipping,
      amountTotal: dataObject.amount_total,
    });
  }
);

app.listen(PORT, () =>
  console.log(`Aplicacion corriendo en puerto ${PORT} \n`)
);
