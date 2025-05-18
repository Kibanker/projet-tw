import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de logement invalide' },
        { status: 400 }
      )
    }

    await dbConnect()
    const db = mongoose.connection.db
    const accommodation = await db
      .collection('accommodations')
      .findOne({ _id: new ObjectId(id) })

    if (!accommodation) {
      return NextResponse.json(
        { error: 'Logement non trouvé' },
        { status: 404 }
      )
    }

    // Convertir l'ObjectId en chaîne pour la sérialisation
    const serializedAccommodation = {
      ...accommodation,
      _id: accommodation._id.toString(),
    }

    return NextResponse.json(serializedAccommodation)
  } catch (error) {
    console.error('Erreur lors de la récupération du logement:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
