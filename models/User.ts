import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  name: String,
  lastName: String,
  address: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  likedAccommodations: [{ type: Schema.Types.ObjectId, ref: 'Accommodation' }] // Later link to accommodation models
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
