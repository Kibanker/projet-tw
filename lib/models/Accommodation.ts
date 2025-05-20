// lib/models/Accommodation.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IAccommodation extends Document {
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
}

const AccommodationSchema: Schema = new Schema({
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
  rawData: { type: Schema.Types.Mixed },
}, { timestamps: true })

// Créer un index sur l'URL pour des recherches plus rapides
AccommodationSchema.index({ url: 1 })

// Créer un index sur les coordonnées pour les recherches géospatiales
AccommodationSchema.index({ location: '2dsphere' })

export default mongoose.models.Accommodation || 
  mongoose.model<IAccommodation>('Accommodation', AccommodationSchema)
