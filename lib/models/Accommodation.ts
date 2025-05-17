// lib/models/Accommodation.ts
import mongoose from 'mongoose'

const AccommodationSchema = new mongoose.Schema({
  title: String,
  url: String,
  latitude: Number,
  longitude: Number,
})

export default mongoose.models.Accommodation || mongoose.model('Accommodation', AccommodationSchema)
