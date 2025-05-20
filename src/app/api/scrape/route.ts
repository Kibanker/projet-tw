import { NextResponse } from 'next/server';
import { LocalScraper } from '@/lib/localScraper';

export async function GET() {
  try {
    const scraper = new LocalScraper();
    await scraper.scrape();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Scraping terminé avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors du scraping',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
