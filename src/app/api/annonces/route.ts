import { NextResponse } from 'next/server';
import { Annonce } from '@/lib/baseScraper';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    
    // Récupérer toutes les annonces triées par date de scraping décroissante
    const annonces = await Annonce.find({}).sort({ dateScraping: -1 }).limit(50);
    
    return NextResponse.json(annonces);
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors de la récupération des annonces',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
