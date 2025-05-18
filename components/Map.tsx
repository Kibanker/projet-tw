'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type Props = {
  accommodations: {
    _id: string
    title: string
    coordinates: { lat: number; lng: number }
    url: string
  }[]
}

export default function Map({ accommodations }: Props) {
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={12} scrollWheelZoom={true} className="h-96 w-full z-0">
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {accommodations.map(a => (
        <Marker key={a._id} position={[a.coordinates.lat, a.coordinates.lng]}>
          <Popup>
            <a href={a.url} target="_blank">{a.title}</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
