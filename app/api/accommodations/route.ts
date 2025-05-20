// app/api/accommodations/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Annonce from '@/lib/models/Annonce'

export async function GET() {
  try {
    await dbConnect()
    
    // Récupérer les annonces et les convertir en objets JavaScript simples
    const annonces = await Annonce.find({}).lean()
    
    // Convertir _id en string pour la sérialisation et formater les données
    const cleaned = annonces.map((annonce) => {
      const annonceWithId = annonce as { _id: { toString: () => string }; [key: string]: unknown };
      return {
        ...annonceWithId,
        _id: annonceWithId._id.toString(),
        // S'assurer que les champs requis sont présents
        title: annonceWithId.title || 'Sans titre',
        price: annonceWithId.price || 0,
        surface: annonceWithId.surface || 0,
        rooms: annonceWithId.rooms || 1,
        description: annonceWithId.description || 'Aucune description fournie',
        address: annonceWithId.address || 'Adresse non spécifiée',
        // Extraire l'image de rawData si disponible
        image: Array.isArray(annonceWithId.images) && annonceWithId.images.length > 0 
          ? annonceWithId.images[0] 
          : '/placeholder.jpg'
      };
    });

    return NextResponse.json(cleaned)
  } catch (error) {
    console.error('Error fetching accommodations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accommodations' },
      { status: 500 }
    )
  }
}
