//ça dit a Node que la carte doit être rendue côté client
'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes personnalisées pour Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Types
export interface Logement {
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

interface MapComponentProps {
  logements: Logement[];
  center: {
    lat: number;
    lng: number;
  };
  selectedLogement: string | null;
  onMarkerClick: (logementId: string) => void;
}

// Définition des méthodes accessibles via la ref
export interface MapComponentRef {
  flyTo: (latlng: [number, number], zoom: number, options?: L.ZoomPanOptions) => void;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(({ 
  logements, 
  center, 
  selectedLogement,
  onMarkerClick 
}, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{[key: string]: L.Marker}>({});

  // Exposer des méthodes via la ref
  useImperativeHandle(ref, () => ({
    flyTo: (latlng: [number, number], zoom: number, options?: L.ZoomPanOptions) => {
      if (mapRef.current) {
        mapRef.current.flyTo(latlng, zoom, options);
      }
    }
  }));

  useEffect(() => {
    // Ne s'exécute que côté client
    if (typeof window === 'undefined') return;

    // Initialiser la carte
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([center.lat, center.lng], 6);
      
      // Ajouter la couche de tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Nettoyer les marqueurs existants
    Object.values(markersRef.current).forEach(marker => {
      if (marker && mapRef.current) {
        marker.removeFrom(mapRef.current);
      }
    });
    markersRef.current = {};

    // Ajouter les marqueurs pour chaque logement
    logements.forEach(logement => {
      if (!mapRef.current) return;
      
      const marker = L.marker(
        [logement.coordinates.lat, logement.coordinates.lng],
        {
          icon: logement.id === selectedLogement ? selectedIcon : defaultIcon,
          title: logement.title
        }
      );

      // Ajouter un popup avec les informations du logement
      const popupContent = `
        <div class="p-2">
          <img src="${logement.image}" alt="${logement.title}" class="w-full h-24 object-cover mb-2 rounded">
          <h3 class="font-bold">${logement.title}</h3>
          <p>${logement.location}</p>
          <p class="text-blue-600 font-semibold">${logement.price.toLocaleString()} €</p>
          <p>${logement.surface} m² • ${logement.rooms} pièce${logement.rooms > 1 ? 's' : ''}</p>
        </div>
      `;

      // Utiliser le popupContent déjà défini plus haut
      marker.bindPopup(popupContent);
      marker.addTo(mapRef.current);

      // Ajouter un événement de clic pour le marqueur
      marker.on('click', () => {
        onMarkerClick(logement.id);
      }); 

      // Stocker la référence du marqueur
      markersRef.current[logement.id] = marker;
    });

    // Ajuster la vue pour afficher tous les marqueurs si nécessaire
    if (logements.length > 0 && !selectedLogement && mapRef.current) {
      const markers = Object.values(markersRef.current).filter(Boolean) as L.Marker[];
      if (markers.length > 0) {
        // Créer un tableau de coordonnées des marqueurs
        const latLngs = markers.map(marker => marker.getLatLng());
        if (latLngs.length > 0) {
          // Créer un bounds à partir des coordonnées avec une syntaxe compatible TypeScript
          const bounds = latLngs.reduce(
            (bounds, latlng) => bounds.extend(latlng),
            L.latLngBounds([latLngs[0], latLngs[0]])
          );
          // Ajuster la vue pour afficher tous les marqueurs avec un peu de marge
          mapRef.current.fitBounds(bounds.pad(0.1));
        }
      }
    }

    // Nettoyage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [logements, selectedLogement, center.lat, center.lng, onMarkerClick]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;
