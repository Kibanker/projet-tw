import { BaseScraper } from './baseScraper';

export class LocalScraper extends BaseScraper {
  readonly baseUrl = 'http://localhost:3002';
  readonly source = 'local';

  async scrape(): Promise<void> {
    try {
      console.log('Début du scraping des données locales...');
      
      // Récupérer les données depuis l'API locale
      console.log(`Tentative de connexion à: ${this.baseUrl}/api/logements`);
      const response = await fetch(`${this.baseUrl}/api/logements`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur de réponse:', errorText);
        throw new Error(`Erreur HTTP! Statut: ${response.status}, Détails: ${errorText}`);
      }

      let annonces = [];
      try {
        const responseText = await response.text();
        console.log('Réponse brute de l\'API (premiers 500 caractères):', responseText.substring(0, 500) + '...');
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Erreur lors du parsing JSON:', parseError);
          return;
        }
        
        // Extraire les annonces de la réponse
        if (responseData && responseData.success && Array.isArray(responseData.data)) {
          // Si la réponse a un format { success: true, data: [...] }
          annonces = responseData.data;
        } else if (Array.isArray(responseData)) {
          // Si la réponse est directement un tableau
          annonces = responseData;
        } else if (responseData && Array.isArray(responseData.annonces)) {
          // Si la réponse est un objet avec une propriété 'annonces'
          annonces = responseData.annonces;
        } else if (responseData && responseData.success !== false) {
          // Si la réponse est un objet unique, le traiter comme une seule annonce
          annonces = [responseData];
        }
        
        console.log(`Nombre d'annonces récupérées: ${annonces.length}`);

        // Vérifier si des annonces ont été trouvées
        if (annonces.length === 0) {
          console.log('Aucune annonce trouvée dans la réponse de l\'API');
          return;
        }
      } catch (error) {
        console.error('Erreur lors de l\'analyse de la réponse JSON:', error);
        return;
      }

      // Vider les anciennes annonces de cette source
      await this.clearAnnonces();

      // Traiter chaque annonce
      for (const annonce of annonces) {
        try {
          // Construire l'adresse complète
          const adresse = annonce.adresse ? 
            `${annonce.adresse.rue || ''}, ${annonce.adresse.codePostal || ''} ${annonce.adresse.ville || ''}`.trim().replace(/\s+/g, ' ').replace(/^\s*,\s*|\s*,\s*$/g, '') : 
            'Localisation non spécifiée';
          
          // Préparer les données de l'annonce
          const annonceData = {
            // Ne pas définir _id ici, il sera généré automatiquement
            title: annonce.titre || 'Sans titre',
            price: annonce.prix || 0,
            surface: annonce.surface || 0,
            address: adresse,
            description: annonce.description || 'Aucune description fournie',
            url: annonce._id ? `${this.baseUrl}/annonces/${annonce._id}` : undefined,
            source: this.source,
            rooms: annonce.nombrePieces || 1,
            rawData: {
              ...annonce,
              // S'assurer que l'ID dans rawData est une chaîne
              _id: annonce._id ? String(annonce._id) : undefined
            },
            // Ajouter les coordonnées si disponibles
            ...(annonce.localisation?.coordinates && annonce.localisation.coordinates.length >= 2 && {
              latitude: annonce.localisation.coordinates[1],
              longitude: annonce.localisation.coordinates[0],
              hasCoords: true
            })
          };

          // Sauvegarder l'annonce dans la base de données
          await this.saveAnnonce(annonceData);
          console.log(`✅ Annonce traitée: ${annonceData.title}`);
        } catch (error) {
          console.error('❌ Erreur lors du traitement d\'une annonce:', error);
        }
      }

      console.log('✅ Scraping des données locales terminé avec succès');
    } catch (error) {
      console.error('Erreur lors du scraping local:', error);
      throw error;
    }
  }
}
