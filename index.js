const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Simulation de données pour le moment
let elements = [
  { id: 1, name: 'Appartement T1', location: 'Paris' },
  { id: 2, name: 'Maison F4', location: 'Lyon' },
  { id: 3, name: 'Studio', location: 'Marseille' },
];

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Serveur Express opérationnel !' });
});

// GET /elements: Liste tous les éléments
app.get('/elements', (req, res) => {
  res.status(200).json(elements);
});

// GET /elements/:id : Renvoie un élément par son ID
app.get('/elements/:id', (req, res) => {
  const element = elements.find(el => el.id === parseInt(req.params.id));
  if (!element) {
      return res.status(404).json({ message: 'Élément non trouvé' });
  }
  res.status(200).json(element);
});

// POST /elements : Ajoute un nouvel élément
app.post('/elements', (req, res) => {
  const newElement = {
      id: elements.length + 1,
      name: req.body.name,
      location: req.body.location,
  };
  elements.push(newElement);
  res.status(201).json(newElement);
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`)
  })