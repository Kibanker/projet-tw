'use client'

import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'

type Annonce = {
  _id: string
  title: string
  url: string
  latitude?: number
  longitude?: number
  address?: string
  price?: number
  surface?: number
  rooms?: number
  description?: string
  source?: string
  lastScraped?: string
  updatedAt?: string
}

interface MapProps {
  accommodations: Annonce[]
  className?: string
  zoom?: number
}

export default function Map({ accommodations, className, zoom = 12 }: MapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null)
  const [MarkerComponent, setMarkerComponent] = useState<React.ComponentType<any> | null>(null)
  const [PopupComponent, setPopupComponent] = useState<React.ComponentType<any> | null>(null)
  const [TileLayerComponent, setTileLayerComponent] = useState<React.ComponentType<any> | null>(null)
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null)
  
  useEffect(() => {
    // Importer leaflet et react-leaflet uniquement côté client
    const loadComponents = async () => {
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet')
      const L = await import('leaflet')
      
      setMapComponent(() => MapContainer)
      setMarkerComponent(() => Marker)
      setPopupComponent(() => Popup)
      setTileLayerComponent(() => TileLayer)
      setLeaflet(L)
      setIsMounted(true)
    }
    
    loadComponents()
  }, [])
  
  if (!isMounted || !MapComponent) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className || 'h-[600px] w-full'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Créer une icône personnalisée pour les marqueurs
  const defaultIcon = leaflet ? new leaflet.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }) : null
  
  // Filtrer les annonces sans coordonnées valides
  const validAccommodations = accommodations.filter(
    (acc) => acc.latitude !== undefined && acc.longitude !== undefined
  )
  
  // Déterminer le centre de la carte
  const center = validAccommodations.length > 0 && validAccommodations[0].latitude && validAccommodations[0].longitude
    ? [validAccommodations[0].latitude, validAccommodations[0].longitude] 
    : [48.8566, 2.3522]
  
  if (!MapComponent || !MarkerComponent || !PopupComponent || !TileLayerComponent || !defaultIcon) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className || 'h-[600px] w-full'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className={className}>
      <MapComponent
        center={center}
        zoom={zoom}
        style={className ? undefined : { height: '600px', width: '100%' }}
        className={className || 'h-full w-full'}
      >
        <TileLayerComponent
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {validAccommodations.map((accommodation) => (
          <MarkerComponent
            key={accommodation._id}
            position={[accommodation.latitude!, accommodation.longitude!]}
            icon={defaultIcon}
          >
            <PopupComponent>
              <strong>{accommodation.title}</strong>
              <br />
              <a
                href={accommodation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Voir l&apos;annonce
              </a>
            </PopupComponent>
          </MarkerComponent>
        ))}
      </MapComponent>
    </div>
  )
}
