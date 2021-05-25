const express = require('express');
const cors = require('cors');
const firebase = require('firebase');

const app = express();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

var firebaseConfig = {
  apiKey: 'AIzaSyCnDNExUxaOHJDkJCbU0x_KjxJCDbmPuuQ',
  authDomain: 'giant-1d6c6.firebaseapp.com',
  projectId: 'giant-1d6c6',
  storageBucket: 'giant-1d6c6.appspot.com',
  messagingSenderId: '419535352577',
  appId: '1:419535352577:web:1a338cd78eb42e52ec2100',
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
const db = fb.firestore();

const stripe = require('stripe')(
  'sk_test_51IujvAIqOpiH1XDDQYgrNyuA1gjsfgYvfEFnON1dr4CRphI5FwNRjVCyqvZTinPVgspbeDN3MuRhIcKW3dCNSYNq003Jt4LYy9'
);

const PORT = process.env.PORT || 5000;

app.post('/checkout', async (req, res) => {
  const { equipo } = req.body;

  console.log(req.body);

  let items = [];

  for (const parte of equipo) {
    const partRef = db.collection('partes').doc(parte);
    const doc = await partRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      const { nombre, precio } = doc.data();
      const item = {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: nombre,
          },
          unit_amount: parseFloat(precio) * 100,
        },
        quantity: 1,
      };
      items.push(item);
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.json({ id: session.id });
});

app.listen(5000, () =>
  console.log(`Aplicacion corriendo en puerto ${PORT} \n`)
);
