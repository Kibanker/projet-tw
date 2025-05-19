import * as cheerio from 'cheerio';
import axios from 'axios';
import mongoose, { Schema, model, Model, Document } from 'mongoose';
import dbConnect from './mongodb';

// Définition du schéma pour les annonces
interface RawData {
  [key: string]: unknown;
}

interface IAnnonce extends Document {
  title: string;
  url: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  confidence?: number;
  hasCoords?: boolean;
  description: string;
  lastScraped: Date;
  price: number;
  rawData?: RawData;
  rooms?: number;
  surface: number;
  source: string;
  updatedAt: Date;
}

const annonceSchema = new Schema<IAnnonce>({
  title: { type: String, required: true },
  url: { type: String, required: true, default: '#' },
  latitude: { type: Number },
  longitude: { type: Number },
  address: { type: String },
  confidence: { type: Number },
  hasCoords: { type: Boolean, default: false },
  description: { type: String, required: true },
  lastScraped: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  rawData: { type: Schema.Types.Mixed },
  rooms: { type: Number },
  surface: { type: Number, required: true },
  source: { type: String, required: true, default: 'mapbox' },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Annonce: Model<IAnnonce> = model<IAnnonce>('Annonce', annonceSchema);

export abstract class BaseScraper {
  abstract readonly baseUrl: string;
  abstract readonly source: string;

  async fetchPage(url: string): Promise<cheerio.Root> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });
      return cheerio.load(response.data);
    } catch (error) {
      console.error(`Erreur lors du chargement de la page ${url}:`, error);
      throw error;
    }
  }

  abstract scrape(): Promise<void>;

  // Méthode pour vider la collection des annonces
  async clearAnnonces(): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        await dbConnect();
      }
      await Annonce.deleteMany({ source: this.source });
      console.log(`Toutes les annonces de la source ${this.source} ont été supprimées`);
    } catch (error) {
      console.error('Erreur lors de la suppression des annonces existantes:', error);
      throw error;
    }
  }

  async saveAnnonce(annonceData: Omit<IAnnonce, keyof Document | 'lastScraped' | 'updatedAt' | 'source'> & { _id?: string; rawData?: { _id?: string } }) {
    try {
      // Utiliser la connexion existante
      if (mongoose.connection.readyState !== 1) { // 1 = connected
        await dbConnect();
      }
      
      // Extraire l'ID de l'annonce depuis les données brutes si disponible
      const annonceId = annonceData.rawData?._id || annonceData.url.split('/').pop();
      
      if (!annonceId) {
        throw new Error('Impossible de déterminer l\'ID de l\'annonce');
      }
      
      // Préparer les données à sauvegarder
      const dataToSave = {
        ...annonceData,
        source: this.source,
        lastScraped: new Date(),
        updatedAt: new Date()
      };
      
      // Mise à jour ou création de l'annonce en utilisant l'ID
      const result = await Annonce.findOneAndUpdate(
        { _id: annonceId },
        dataToSave,
        { 
          upsert: true, 
          new: true, 
          setDefaultsOnInsert: true 
        }
      );
      
      if (!result) {
        console.error('Échec de la mise à jour de l\'annonce:', annonceData.title);
      } else {
        console.log(`Annonce mise à jour: ${annonceData.title}`);
      }
      
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la sauvegarde de l\'annonce:', errorMessage);
      console.error('Détails de l\'annonce en erreur:', JSON.stringify({
        title: annonceData.title,
        url: annonceData.url,
        error: errorMessage
      }, null, 2));
      throw error; // Propager l'erreur pour la gestion en amont
    }
  }
}
