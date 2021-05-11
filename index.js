import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import buildRoutes from './routes/builds.js';
import partRoutes from './routes/parts.js';
const app = express();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/builds', buildRoutes);
app.use('/parts', partRoutes);

const CONNECTION_URL =
  'mongodb+srv://soyadmin:mongotest123@cluster0.exwt9.mongodb.net/GiantDB?retryWrites=true&w=majority';

const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    )
  )
  .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);
