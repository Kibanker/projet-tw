const mongoose = require('mongoose');

// Connexion à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/projet-tw');
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
        process.exit(1); // Arrêter l'application en cas d'erreur
    }
};

module.exports = connectDB;
