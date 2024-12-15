const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const Element = require('./models/element');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const path = require('path');
const { engine } = require('express-handlebars');



dotenv.config();

connectDB();

const app = express();

// Configuration du moteur de vue Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true })); // Pour parser les données des formulaires HTML
app.use(express.json());

// Ajouter des données par défaut pour les éléments
const initData = async () => {
    try {
        await Element.deleteMany({});
        await Element.insertMany([
            { id: 1, name: 'Appartement T1', location: 'Paris' },
            { id: 2, name: 'Maison F4', location: 'Lyon' },
            { id: 3, name: 'Studio', location: 'Marseille' }
        ]);
        console.log('Données initiales ajoutées');
    } catch (error) {
        console.error('Erreur lors de l’ajout des données initiales :', error);
    }
};

connectDB().then(initData);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).render('home', { message: 'Serveur Express opérationnel !' }); // Affiche la page d'accueil
});

// Route pour afficher le formulaire de création d'utilisateur
app.get('/create-user', (req, res) => {
  res.render('create-user'); // Affiche la vue pour créer un utilisateur
});

// Route pour gérer l'envoi du formulaire de création d'utilisateur
app.post('/users', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris' });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer le nouvel utilisateur
      const newUser = new User({
          username,
          password: hashedPassword
      });

      await newUser.save();
      res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
      // Rediriger vers la page d'accueil après la création
      res.redirect('/');
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
  }
});


// Routes pour /elements
app.get('/elements', async (req, res) => {
    try {
        const elements = await Element.find({}, { "_id": 0, "__v": 0 });
        res.status(200).json(elements);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des éléments', error });
    }
});

app.post('/elements', async (req, res) => {
    try {
        const nouvelElement = new Element({
            id: req.body.id,
            name: req.body.name,
            location: req.body.location,
        });
        await nouvelElement.save();
        res.status(201).json(nouvelElement);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création', error });
    }
});

const PORT = process.env.PORT || 3000;

// Gérer les routes non trouvées
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});


module.exports = app;

