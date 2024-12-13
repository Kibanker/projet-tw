const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Serveur Express opérationnel !' });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`)
  })