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

// Create the model with explicit collection name
export const Annonce: Model<IAnnonce> = mongoose.models.Annonce || 
  model<IAnnonce>('Annonce', annonceSchema, 'annonces');

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

  async saveAnnonce(annonceData: Omit<IAnnonce, keyof Document | 'lastScraped' | 'updatedAt' | 'source' | '_id' | 'rawData'> & { 
    _id?: string | mongoose.Types.ObjectId;
    rawData?: Record<string, unknown> | null;
  }) {
    try {
      // Utiliser la connexion existante
      if (mongoose.connection.readyState !== 1) { // 1 = connected
        await dbConnect();
      }
      
      // Fonction pour valider et formater un ID
      const formatId = (id: unknown): string | null => {
        if (!id) return null;
        const idStr = String(id).trim();
        // Si l'ID est vide ou 'undefined', on retourne null
        if (!idStr || idStr === 'undefined' || idStr === 'null') return null;
        // Si l'ID est déjà un ObjectId valide, on le retourne tel quel
        if (mongoose.Types.ObjectId.isValid(idStr)) return idStr;
        // Sinon, on crée un nouvel ObjectId
        return new mongoose.Types.ObjectId().toString();
      };
      
      // Essayer de récupérer un ID valide depuis différentes sources
      const possibleIds = [
        annonceData._id,
        annonceData.rawData?._id,
        (typeof annonceData.url === 'string' ? annonceData.url.split('/').pop() : null),
        (annonceData.rawData?.id ? String(annonceData.rawData.id) : null)
      ];
      
      // Trouver le premier ID valide ou en générer un nouveau
      let annonceIdStr = null;
      for (const id of possibleIds) {
        const formattedId = formatId(id);
        if (formattedId) {
          annonceIdStr = formattedId;
          break;
        }
      }
      
      // Si aucun ID valide n'a été trouvé, en générer un nouveau
      if (!annonceIdStr) {
        annonceIdStr = new mongoose.Types.ObjectId().toString();
      }
      
      // Préparer les données à sauvegarder
      const dataToSave = {
        ...annonceData,
        _id: annonceIdStr, // S'assurer que l'ID est défini
        source: this.source,
        lastScraped: new Date(),
        updatedAt: new Date(),
        // S'assurer que les champs requis sont définis
        title: annonceData.title || 'Sans titre',
        description: annonceData.description || 'Aucune description fournie',
        price: annonceData.price || 0,
        surface: annonceData.surface || 0,
        url: annonceData.url || `${this.baseUrl}/annonces/${annonceIdStr}`
      };
      
      console.log('Tentative de sauvegarde de l\'annonce:', {
        id: annonceIdStr,
        title: dataToSave.title,
        source: this.source
      });
      
      // Mise à jour ou création de l'annonce en utilisant l'ID
      const result = await Annonce.findOneAndUpdate(
        { _id: annonceIdStr },
        { $set: dataToSave },
        { 
          upsert: true, 
          new: true, 
          setDefaultsOnInsert: true,
          runValidators: true
        }
      );
      
      if (!result) {
        console.error('❌ Échec de la mise à jour de l\'annonce:', dataToSave.title);
      } else {
        console.log(`✅ Annonce sauvegardée: ${dataToSave.title} (ID: ${result._id})`);
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
