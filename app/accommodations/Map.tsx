'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

type Accommodation = {
  _id: string
  title: string
  url: string
  latitude: number
  longitude: number
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

L.Marker.prototype.options.icon = defaultIcon

export default function Map({ accommodations }: { accommodations: Accommodation[] }) {
  return (
    <MapContainer
      center={[48.8566, 2.3522]}
      zoom={12}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {accommodations.map((accommodation) => (
        <Marker
          key={accommodation._id}
          position={[accommodation.latitude, accommodation.longitude]}
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
  )
}
