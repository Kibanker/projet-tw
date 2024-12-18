const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const Element = require('./models/element');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || 'votre_cle_secrete';

connectDB();

const app = express();

// Configuration du moteur de vue Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Désactive l'avertissement
  }
}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true })); // Pour parser les données des formulaires HTML
app.use(express.json());
app.use(cookieParser()); // Pour gérer les cookies

const authenticate = (req, res, next) => {
  const token = req.cookies.auth_token; // Vérifie si le cookie existe
  if (token) {
      try {
          const decoded = jwt.verify(token, SECRET_KEY); // Décode le jeton
          res.locals.username = decoded.username; // Injecte le nom d'utilisateur dans les variables locales
      } catch (error) {
          res.locals.username = null; // En cas de jeton invalide, utilisateur non connecté
      }
  } else {
      res.locals.username = null; // Pas de jeton, utilisateur non connecté
  }
  next(); // Continue l'exécution
};

app.use(authenticate);


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

// Page d'accueil
app.get('/', async (req, res) => {
  const elements = await Element.find({}, { "_id": 0, "__v": 0 });
  res.render('home', {
      message: 'Bienvenue sur le site !',
      username: res.locals.username,
  });
});

// Page de connexion
app.get('/login', (req, res) => {
  res.render('login');
});

// Soumission du formulaire de connexion
app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Vérifie si l'utilisateur existe
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(401).render('login', { error: 'Utilisateur non trouvé' });
      }

      // Vérifie le mot de passe

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).render('login', { error: 'Mot de passe incorrect' });
      }

      // Génère un jeton JWT
      const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

      // Envoie le jeton via un cookie
      res.cookie('auth_token', token, { httpOnly: true });
      res.redirect('/account');
  } catch (error) {
      res.status(500).render('login', { error: 'Erreur lors de la connexion' });
  }
});

// Page pour créer un utilisateur
app.get('/create-user', (req, res) => {
  res.render('create-user');
});

// formulaire pour créer un utilisateur
app.post('/create-user',async (req, res) => {
  try {
    const { username, password } = req.body;
    //on vérifie si l'utilisateur n'est pas déjà présent dans la base
    const leUser = await User.findOne({ username })
    if (leUser) {
      return res.status(401).render('create-user', { error: 'Utilisateur déjà existant' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username: username, password: hashedPassword });
      res.status(401).render('create-user', { reussite: 'Inscription confirmée' });
    } 
} catch (error) {
  res.status(500).render('create-user', { error: "Erreur lors de l'inscription" });
}
});

// Route temporaire pour afficher les utilisateurs
app.get('/users', async (req, res) => {
  try {
      const utilisateurs = await User.find({}); // Récupère tous les utilisateurs
      console.log(utilisateurs); // Pour vérifier les données récupérées
      res.render('users', { 
          users: utilisateurs // Passe les utilisateurs récupérés à la vue
      });
  } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Page de compte utilisateur
app.get('/account', authenticate, (req, res) => {
  res.render('account', { username: res.locals.username });
});

// Routes pour /elements
app.get('/elements', async (req, res) => {
  try {
      const elements = await Element.find({}, { "_id": 0, "__v": 0 });

      // Passer les éléments sous un objet avec un nom (par exemple 'elements')
      res.render('elements', {
          elements: elements // Ici, elements doit être un tableau d'objets simples
      });
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

// GET /elements/:id : Renvoie un élément par son ID
app.get('/elements/:id', async (req, res) => {
  const element = await Element.find({id: req.params.id}, {"_id": 0, "__v": 0});
  if (!element) {
      return res.status(404).json({ message: 'Élément non trouvé' });
  }
  res.render('elements', {
    elements: element // Ici, elements doit être un tableau d'objets simples
});
});


// PUT /element/:id qui modifie un enregistrement à partir de son id
app.put('/elements/:id', async (req, res) => {
  try {
    const { id } = req.params; // Récupère l'ID de l'élément à mettre à jour
    const { name, location } = req.body; // Récupère les nouvelles données pour l'élément
    // Recherche et mise à jour de l'élément
    const updatedElement = await Element.findOneAndUpdate(
      { id }, // Critère de recherche basé sur l'ID
      { name, location }, // Les nouvelles données
      { new: true } // Retourne le document mis à jour
    );
    if (!updatedElement) {
      return res.status(404).json({ message: 'Élément non trouvé' });
    }
    res.status(200).json(updatedElement); // Envoie l'élément mis à jour
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error });
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

// Route de déconnexion
app.get('/logout', (req, res) => {
  res.clearCookie('auth_token'); // Supprime le cookie contenant le JWT
  res.redirect('/'); // Redirige vers la page d'accueil
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
