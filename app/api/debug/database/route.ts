import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import mongoose from 'mongoose'
import Accommodation from '@/lib/models/Accommodation'
import User from '@/models/User'

export async function GET() {
  try {
    await dbConnect()
    
    // Vérifier la connexion à la base de données
    const db = mongoose.connection.db
    const collections = await db.listCollections().toArray()
    
    // Vérifier les collections existantes
    const collectionsInfo = await Promise.all(collections.map(async (collection) => {
      const count = await db.collection(collection.name).countDocuments()
      return {
        name: collection.name,
        count
      }
    }))
    
    // Vérifier quelques documents de la collection accommodations
    const sampleAccommodations = await Accommodation.find().limit(3).lean()
    
    // Vérifier un utilisateur avec des favoris
    const userWithFavorites = await User.findOne({ 
      likedAccommodations: { $exists: true, $not: { $size: 0 } } 
    }).lean()
    
    // Vérifier si les IDs des favoris existent dans la collection accommodations
    let favoritesAnalysis = null
    if (userWithFavorites?.likedAccommodations?.length > 0) {
      const favoriteIds = userWithFavorites.likedAccommodations.slice(0, 5)
      const existingFavorites = await Accommodation.find({
        _id: { $in: favoriteIds }
      }).select('_id title').lean()
      
      favoritesAnalysis = {
        userFavoritesCount: userWithFavorites.likedAccommodations.length,
        sampleFavoriteIds: favoriteIds,
        existingFavorites: existingFavorites.map(doc => ({
          _id: doc._id.toString(),
          title: doc.title
        }))
      }
    }
    
    return NextResponse.json({
      status: 'success',
      dbStats: {
        collections: collectionsInfo,
        sampleAccommodations: sampleAccommodations.map(doc => ({
          _id: doc._id.toString(),
          title: doc.title,
          price: doc.price,
          source: doc.source
        })),
        userWithFavorites: userWithFavorites ? {
          _id: userWithFavorites._id.toString(),
          name: userWithFavorites.name,
          favoritesCount: userWithFavorites.likedAccommodations?.length || 0
        } : null,
        favoritesAnalysis
      }
    })
    
  } catch (error) {
    console.error('Database debug error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Database debug error', error: error.message },
      { status: 500 }
    )
  }
}
