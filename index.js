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
      await Element.deleteMany({}); 
      await Element.insertMany([
          { id: 1, name: 'Appartement T1', location: 'Paris' },
          { id: 2, name: 'Maison F4', location: 'Lyon' },
          { id: 3, name: 'Studio', location: 'Marseille' }
      ]);
      console.log('Données initiales ajoutées');
};
//initData();

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Serveur Express opérationnel !' });
});

app.post('/', (req, res) => {
  res.status(201).send({ message: 'POST opérationnel !' });
});

// GET /elements Liste tous les éléments
app.get('/elements', async (req, res) => {
  const elements = await Element.find({}, {"_id": 0, "__v": 0});
  res.status(200).json(elements);
});

// GET /elements/:id : Renvoie un élément par son ID
app.get('/elements/:id', async (req, res) => {
  const element = await Element.find({id: req.params.id}, {"_id": 0, "__v": 0});
  if (element.length === 0) {
      return res.status(404).json({ message: 'Élément non trouvé' });
  }
  res.status(200).json(element);
});

// POST /elements : Ajoute un nouvel élément
app.post('/elements', async (req, res) => {
  try {

    // Crée un nouvel élément
    const newElement = new Element({
      id: req.body.id,
      name: req.body.name,
      location: req.body.location,
  });

      await newElement.save();
      res.status(201).json(newElement);
      Element.insertOne({newElement});

  } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la création', error });
  }
});

// DELETE /elements/id : Supprime un élément
app.delete('/elements/:id', async (req, res) => {
  try {
    const result = await Element.deleteOne({ id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Élément non trouvé' });
    }

    res.status(200).json({ message: 'Élément supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error });
  }
});

// Gérer les routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`)
  });