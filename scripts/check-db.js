import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

// Modèle Annonce
const annonceSchema = new mongoose.Schema({
  title: String,
  price: Number,
  surface: Number,
  rooms: Number,
  address: String,
  description: String,
  url: String,
  source: String,
  latitude: Number,
  longitude: Number,
  rawData: Object,
  lastScraped: Date,
  updatedAt: Date
}, { timestamps: true });

const Annonce = mongoose.model('Annonce', annonceSchema);

async function checkDatabase() {
  try {
    // Se connecter à la base de données
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/immo-app');
    console.log('Connecté à la base de données');

    // Compter le nombre total d'annonces
    const count = await Annonce.countDocuments();
    console.log(`Nombre total d'annonces: ${count}`);

    // Afficher les 5 premières annonces
    const annonces = await Annonce.find({}, 'title price surface rooms address')
      .sort({ updatedAt: -1 })
      .limit(5);

    console.log('\n5 dernières annonces mises à jour :');
    console.log(JSON.stringify(annonces, null, 2));

  } catch (error) {
    console.error('Erreur lors de la vérification de la base de données:', error);
  } finally {
    // Fermer la connexion
    await mongoose.disconnect();
    console.log('Déconnecté de la base de données');
  }
}

checkDatabase();
