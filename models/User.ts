import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  name: String,
  lastName: String,
  address: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  likedAccommodations: [String] // Later link to accommodation models
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
