import { BaseScraper } from './baseScraper';

export class LocalScraper extends BaseScraper {
  readonly baseUrl = 'http://localhost:3002';
  readonly source = 'local';

  async scrape(): Promise<void> {
    try {
      console.log('Début du scraping des données locales...');
      
      // Récupérer les données depuis l'API locale
      const response = await fetch(`${this.baseUrl}/api/logements`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }

      const annonces = await response.json();
      console.log(`Nombre d'annonces récupérées: ${annonces.length}`);

      // Traiter chaque annonce
      for (const annonce of annonces) {
        try {
          // Construire l'adresse complète
          const adresse = annonce.adresse ? 
            `${annonce.adresse.rue || ''}, ${annonce.adresse.codePostal || ''} ${annonce.adresse.ville || ''}` : 
            'Localisation non spécifiée';
          
          const annonceData = {
            _id: annonce._id, // Inclure l'ID pour la mise à jour
            title: annonce.titre || 'Sans titre',
            price: annonce.prix || 0,
            surface: annonce.surface || 0,
            address: adresse,
            description: annonce.description || 'Aucune description fournie',
            url: `${this.baseUrl}/annonces/${annonce._id || ''}`,
            source: this.source,
            rooms: annonce.nombrePieces || 1,
            ...(annonce.localisation?.coordinates && {
              latitude: annonce.localisation.coordinates[1],
              longitude: annonce.localisation.coordinates[0]
            }),
            rawData: annonce // Sauvegarder les données brutes
          };

          console.log('Données de l\'annonce:', JSON.stringify(annonceData, null, 2));
          
          await this.saveAnnonce(annonceData);
          console.log(`Annonce traitée: ${annonceData.title}`);
        } catch (error) {
          console.error(`Erreur lors du traitement d'une annonce:`, error);
          console.error('Annonce en erreur:', JSON.stringify(annonce, null, 2));
          // Continuer avec l'annonce suivante en cas d'erreur
          continue;
        }
      }

      console.log('Scraping terminé avec succès');
    } catch (error) {
      console.error('Erreur lors du scraping local:', error);
      throw error;
    }
  }
}
