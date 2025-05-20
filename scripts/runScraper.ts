import { LocalScraper } from '../lib/localScraper';
import dotenv from 'dotenv';
import dbConnect from '../lib/mongodb';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

async function runScrapers() {
  try {
    console.log('Connexion à la base de données...');
    await dbConnect();
    
    console.log('Démarrage du scraping...');
    
    // Exécuter le scraper local
    console.log('Exécution du scraper local...');
    const localScraper = new LocalScraper();
    
    // Vider les annonces existantes avant d'en ajouter de nouvelles
    console.log('Suppression des annonces existantes...');
    await localScraper.clearAnnonces();
    
    // Lancer le scraping
    await localScraper.scrape();
    
    console.log('Scraping terminé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    process.exit(1);
  }
}

runScrapers();
