import mongoose, { Schema } from 'mongoose'

const CommentSchema = new Schema({
  accommodationId: { 
    type: String, 
    required: true,
    index: true // Pour optimiser les recherches par appartement
  },
  userId: { 
    type: String, 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
})

// Création d'un index composé pour optimiser les recherches
CommentSchema.index({ accommodationId: 1, createdAt: -1 })

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema)
