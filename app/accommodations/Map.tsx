'use client'

import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'

type Accommodation = {
  _id: string
  title: string
  url: string
  latitude: number
  longitude: number
}

interface MapProps {
  accommodations: Accommodation[]
  className?: string
  zoom?: number
}

export default function Map({ accommodations, className, zoom = 12 }: MapProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    // Importer leaflet et react-leaflet uniquement côté client
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className || 'h-[600px] w-full'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Import dynamique des composants react-leaflet
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet')
  const L = require('leaflet')
  
  // Créer une icône personnalisée pour les marqueurs
  const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
  
  // Déterminer le centre de la carte
  const center = accommodations.length > 0 
    ? [accommodations[0].latitude, accommodations[0].longitude] 
    : [48.8566, 2.3522]
  
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={className ? undefined : { height: '600px', width: '100%' }}
        className={className || 'h-full w-full'}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {accommodations.map((accommodation) => (
          <Marker
            key={accommodation._id}
            position={[accommodation.latitude, accommodation.longitude]}
            icon={defaultIcon}
          >
            <Popup>
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
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
