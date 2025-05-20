import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import Annonce, { IAnnonce } from '@/lib/models/Annonce'

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
    const annonce = await Annonce.findById(id).lean() as (IAnnonce & { _id: { toString: () => string } }) | null

    if (!annonce) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      )
    }

    // Convertir l'ObjectId en chaîne pour la sérialisation
    const serializedAnnonce = {
      ...annonce,
      _id: annonce._id.toString(),
    }

    return NextResponse.json(serializedAnnonce)
  } catch (error) {
    console.error('Erreur lors de la récupération du logement:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
