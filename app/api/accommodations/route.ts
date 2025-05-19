// app/api/accommodations/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Annonce from '@/lib/models/Annonce'

export async function GET() {
  try {
    await dbConnect()
    
    // Récupérer les annonces et les convertir en objets JavaScript simples
    const annonces = await Annonce.find({}).lean()
    
    // Convertir _id en string pour la sérialisation
    const cleaned = annonces.map((annonce) => {
      const annonceWithId = annonce as { _id: { toString: () => string }; [key: string]: unknown };
      return {
        ...annonceWithId,
        _id: annonceWithId._id.toString(),
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
