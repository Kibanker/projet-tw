'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

type Accommodation = {
  _id: string
  title: string
  url: string
  latitude: number
  longitude: number
  address?: string
  price?: string
  surface?: string
  rooms?: number
  description?: string
  images?: string[]
}

// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import('../Map'), { ssr: false })

export default function AccommodationDetailPage() {
  const { id } = useParams()
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchAccommodation = async () => {
      try {
        const response = await fetch(`/api/accommodations/${id}`)
        if (!response.ok) {
          throw new Error('Logement non trouvé')
        }
        const data = await response.json()
        setAccommodation(data)
      } catch (err) {
        console.error('Erreur lors du chargement du logement:', err)
        setError('Impossible de charger les détails du logement')
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodation()
  }, [id])

  const handleLike = async () => {
    if (!accommodation) return
    
    try {
      const res = await fetch('/api/user/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accommodationId: accommodation._id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Échec du like')

      alert('Logement ajouté à vos favoris !')
    } catch (err) {
      console.error(err)
      alert('Connectez-vous pour ajouter ce logement à vos favoris.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !accommodation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error || 'Logement non trouvé'}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* En-tête avec image et titre */}
        <div className="relative">
          {accommodation.images && accommodation.images.length > 0 ? (
            <img 
              src={accommodation.images[0]} 
              alt={accommodation.title}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Aucune image disponible</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{accommodation.title}</h1>
            {accommodation.price && (
              <p className="text-2xl font-semibold text-white mt-2">{accommodation.price}</p>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Informations principales */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-xl font-semibold mb-4">Détails</h2>
              <div className="space-y-2">
                {accommodation.surface && (
                  <p><span className="font-medium">Surface :</span> {accommodation.surface}</p>
                )}
                {accommodation.rooms && (
                  <p><span className="font-medium">Pièces :</span> {accommodation.rooms}</p>
                )}
                {accommodation.address && (
                  <p><span className="font-medium">Adresse :</span> {accommodation.address}</p>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <h2 className="text-xl font-semibold mb-4">Localisation</h2>
              <div className="h-64 rounded-lg overflow-hidden">
                <Map 
                  accommodations={[accommodation]} 
                  zoom={15}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>

          {/*Description*/}
          {accommodation.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{accommodation.description}</p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href={accommodation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir l'annonce originale
            </a>
            <button
              onClick={handleLike}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              ❤️ Ajouter aux favoris
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
