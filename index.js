const express = require("express");
const cors = require("cors");
const firebase = require("firebase");
const { v4: uuid } = require("uuid");
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

app.post("/payment", async (req, res) => {
  const { data, token } = req.body;
  //console.log("Producto", data);
  let partes = [];
  let items = [];
  let total = 0;

  const querySnapshot = await db.collection("partes").get();
  const docs = [];
  querySnapshot.forEach((doc) => {
    docs.push({ ...doc.data(), id: doc.id });
  });

  for (const parte of data.equipo) {
    const { nombre, precio, cantidad, id } = docs.find(
      (doc) => doc.id === parte
    );
    partes.push(nombre);
    total = total + parseFloat(precio);
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
    items.push({ id: id, cantidad: parseFloat(cantidad) - 1 });
  }

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: total * 100,
          currency: "mxn",
          customer: customer.id,
          receipt_email: token.email,
          description: `Pedido de ${token.card.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
              line1: token.card.address_line1,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then(async () => {
      await db.collection("ensambles").doc().set({
        cliente: token.card.name,
        email: token.email,
        direccion: token.card.address_line1,
        total: total,
        partes: partes,
        cp: token.card.address_zip,
        ciudad: token.card.address_city,
      });

      items.forEach(async (item) => {
        await db
          .collection("partes")
          .doc(item.id)
          .set({ cantidad: item.cantidad }, { merge: true });
      });
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () =>
  console.log(`Aplicacion corriendo en puerto ${PORT} \n`)
);
