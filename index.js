const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const Element = require('./models/element');

dotenv.config();

// connexion à la bdd
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ajouter des données par défaut après la connexion
const initData = async () => {
      await Element.insertMany([
          { name: 'Appartement T1', location: 'Paris' },
          { name: 'Maison F4', location: 'Lyon' },
          { name: 'Studio', location: 'Marseille' }
      ]);
      console.log('Données initiales ajoutées');
};
//initData();

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Serveur Express opérationnel !' });
});

// GET /elements Liste tous les éléments
app.get('/elements', async (req, res) => {
  const elements = await Element.find({}, {"_id": 0, "__v": 0});
  res.status(200).json(elements);
});

// GET /elements/:id : Renvoie un élément par son ID
app.get('/elements/:id', async (req, res) => {
  const element = await Element.findById(req.params.id);
  if (!element) {
      return res.status(404).json({ message: 'Élément non trouvé' });
  }
  res.status(200).json(element);
});

// POST /elements : Ajoute un nouvel élément
app.post('/elements', async (req, res) => {
  try {
     const lastElement = await Element.find().sort({ id: -1 }).limit(1);

     const nextId = lastElement ? lastElement.id + 1 : 1;

    // Crée un nouvel élément avec l'ID incrémenté
    const newElement = new Element({
      name: req.body.name,
      location: req.body.location,
  });

      await newElement.save();
      res.status(201).json(newElement);
      //Element.insertOne(newElement);
  } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la création', error });
  }
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`)
  });