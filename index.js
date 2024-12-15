const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const Element = require('./models/element');

dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();
app.use(express.json());

// Ajouter des données par défaut après la connexion
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

// Exécution de l’ajout des données une fois la connexion établie
connectDB().then(initData);

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Serveur Express opérationnel !' });
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

module.exports = app;
