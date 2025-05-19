// lib/models/Annonce.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IAnnonce extends Document {
  title: string
  url: string
  latitude?: number
  longitude?: number
  address?: string
  price?: number
  surface?: number
  rooms?: number
  description?: string
  source: string
  lastScraped: Date
  updatedAt: Date
  rawData?: Record<string, unknown>
  equipments?: string[]
  images?: string[]
}

const AnnonceSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  address: { type: String },
  price: { type: Number },
  surface: { type: Number },
  rooms: { type: Number },
  description: { type: String },
  source: { type: String, required: true },
  lastScraped: { type: Date, default: Date.now },
  rawData: { type: Schema.Types.Mixed as unknown as Record<string, unknown> },
  equipments: { type: [String], default: [] },
  images: { type: [String], default: [] },
}, { timestamps: true })

// Créer un index sur l'URL pour des recherches plus rapides
AnnonceSchema.index({ url: 1 })

// Créer un index sur les coordonnées pour les recherches géospatiales
AnnonceSchema.index({ location: '2dsphere' })

// Exporte uniquement le modèle Annonce
export default mongoose.models.Annonce || 
  mongoose.model<IAnnonce>('Annonce', AnnonceSchema)
