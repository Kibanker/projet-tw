"use client";

import { useState, useEffect, useRef } from 'react';
import { FaHeart, FaRegHeart, FaSort, FaSortUp, FaSortDown, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Import dynamique pour éviter les problèmes de rendu côté serveur
const MapWithNoSSR = dynamic<React.ComponentProps<typeof import('../components/MapComponent').default>>(
  () => import('../components/MapComponent').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">Chargement de la carte...</div>
  }
);

interface Logement {
  id: string;
  title: string;
  location: string;
  price: number;
  surface: number;
  rooms: number;
  image: string;
  isFavorite: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

type SortField = 'title' | 'location' | 'price' | 'surface' | 'rooms';
type SortDirection = 'asc' | 'desc';

export default function LogementsList() {
  // État pour les logements
  const [logements, setLogements] = useState<Logement[]>([]);
  const [filteredLogements, setFilteredLogements] = useState<Logement[]>([]);
  
  // États pour le tri et la recherche
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogement, setSelectedLogement] = useState<string | null>(null);
  const [mapView, setMapView] = useState(false);
  const mapRef = useRef<any>(null);

  // Charger les données des logements (à remplacer par un appel API réel)
  useEffect(() => {
    // Données de démonstration
    const demoLogements: Logement[] = [
      {
        id: '1',
        title: 'Appartement moderne',
        location: 'Paris',
        price: 250000,
        surface: 75,
        rooms: 3,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        isFavorite: false,
        coordinates: { lat: 48.8566, lng: 2.3522 }
      },
      {
        id: '2',
        title: 'Maison de campagne',
        location: 'Bordeaux',
        price: 350000,
        surface: 120,
        rooms: 4,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        isFavorite: false,
        coordinates: { lat: 44.8378, lng: -0.5792 }
      },
      {
        id: '3',
        title: 'Studio étudiant',
        location: 'Lyon',
        price: 150000,
        surface: 25,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1484154216785-4e0b5f8b9b5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        isFavorite: false,
        coordinates: { lat: 45.7640, lng: 4.8357 }
      },
    ];

    setLogements(demoLogements);
    setFilteredLogements(demoLogements);
  }, []);

  // Gérer le tri des logements
  useEffect(() => {
    const sorted = [...logements].sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    const filtered = sorted.filter(logement => 
      logement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logement.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredLogements(filtered);
  }, [sortField, sortDirection, searchTerm, logements]);

  // Gérer le changement de champ de tri
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Gérer l'ajout/retrait des favoris
  const toggleFavorite = (id: string) => {
    const updatedLogements = logements.map(logement => 
      logement.id === id 
        ? { ...logement, isFavorite: !logement.isFavorite } 
        : logement
    );
    setLogements(updatedLogements);
    
    // Ici, vous pourriez aussi appeler une API pour mettre à jour les favoris en base de données
  };

  // Rendu de l'icône de tri
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="ml-1" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="ml-1" /> 
      : <FaSortDown className="ml-1" />;
  };

  // Centrer la carte sur un logement spécifique
  const handleLogementClick = (logementId: string) => {
    setSelectedLogement(logementId);
    const logement = logements.find(l => l.id === logementId);
    if (logement && mapRef.current) {
      mapRef.current.flyTo(
        [logement.coordinates.lat, logement.coordinates.lng],
        13, // Niveau de zoom
        {
          duration: 1.5,
          animate: true
        }
      );
    }
  };

  // Calculer le centre de la carte en fonction des logements visibles
  const getMapCenter = () => {
    if (selectedLogement) {
      const logement = logements.find(l => l.id === selectedLogement);
      if (logement) return logement.coordinates;
    }
    
    // Si pas de logement sélectionné, calculer le centre des logements visibles
    if (filteredLogements.length > 0) {
      const lats = filteredLogements.map(l => l.coordinates.lat);
      const lngs = filteredLogements.map(l => l.coordinates.lng);
      return {
        lat: (Math.max(...lats) + Math.min(...lats)) / 2,
        lng: (Math.max(...lngs) + Math.min(...lngs)) / 2
      };
    }
    
    // Par défaut, centrer sur la France
    return { lat: 46.603354, lng: 1.888334 };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Nos logements</h1>
        <button
          onClick={() => setMapView(!mapView)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaMapMarkerAlt className="mr-2" />
          {mapView ? 'Vue liste' : 'Vue carte'}
        </button>
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-6 relative">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un logement ou une ville..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Carte interactive */}
      {mapView && (
        <div className="mb-8 h-[500px] rounded-lg overflow-hidden shadow-lg">
          <MapWithNoSSR
            logements={filteredLogements}
            center={getMapCenter()}
            selectedLogement={selectedLogement}
            onMarkerClick={handleLogementClick}
            ref={mapRef}
          />
        </div>
      )}
      
      {/* En-tête de tableau avec options de tri */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex items-center bg-gray-100 p-4 rounded-t-lg">
          <div 
            className="w-3/12 font-medium flex items-center cursor-pointer"
            onClick={() => handleSort('title')}
          >
            Titre {renderSortIcon('title')}
          </div>
          <div 
            className="w-2/12 font-medium flex items-center cursor-pointer"
            onClick={() => handleSort('location')}
          >
            Localisation {renderSortIcon('location')}
          </div>
          <div 
            className="w-2/12 font-medium flex items-center cursor-pointer"
            onClick={() => handleSort('price')}
          >
            Prix {renderSortIcon('price')}
          </div>
          <div 
            className="w-2/12 font-medium flex items-center cursor-pointer"
            onClick={() => handleSort('surface')}
          >
            Surface {renderSortIcon('surface')}
          </div>
          <div 
            className="w-2/12 font-medium flex items-center cursor-pointer"
            onClick={() => handleSort('rooms')}
          >
            Pièces {renderSortIcon('rooms')}
          </div>
          <div className="w-1/12 font-medium">Actions</div>
        </div>
        
        {/* Liste des logements */}
        <div className="bg-white rounded-b-lg overflow-hidden">
          {filteredLogements.length > 0 ? (
            filteredLogements.map((logement) => (
              <div 
                key={logement.id} 
                className={`flex items-center p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer ${selectedLogement === logement.id ? 'bg-blue-50' : ''}`}
                onClick={() => handleLogementClick(logement.id)}
              >
                <div className="w-3/12">
                  <div className="flex items-center">
                    <img 
                      src={logement.image} 
                      alt={logement.title} 
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <span className="font-medium">{logement.title}</span>
                  </div>
                </div>
                <div className="w-2/12">{logement.location}</div>
                <div className="w-2/12">{logement.price.toLocaleString()} €</div>
                <div className="w-2/12">{logement.surface} m²</div>
                <div className="w-2/12">{logement.rooms} pièce{logement.rooms > 1 ? 's' : ''}</div>
                <div className="w-1/12">
                  <button 
                    onClick={() => toggleFavorite(logement.id)}
                    className="text-2xl focus:outline-none"
                    aria-label={logement.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    {logement.isFavorite ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Aucun logement ne correspond à votre recherche.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  