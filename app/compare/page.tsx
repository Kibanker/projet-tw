'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Types
type Accommodation = {
  _id: string
  title: string
  url: string
  latitude: number
  longitude: number
  address?: string
  price?: string | number
  surface?: string | number
  rooms?: number
  description?: string
  images?: string[]
}

// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import('../accommodations/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
})

export default function ComparePage() {
  const router = useRouter()
  const [compareList, setCompareList] = useState<string[]>([])
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/user/current')
        const data = await response.json()
        setIsLoggedIn(!!data.user)
      } catch (error) {
        console.error('Erreur lors de la vérification du statut de connexion:', error)
        setIsLoggedIn(false)
      }
    }
    
    checkLoginStatus()
  }, [])

  // Charger la liste des logements à comparer depuis localStorage
  useEffect(() => {
    const storedList = localStorage.getItem('compareList')
    if (storedList) {
      try {
        const parsedList = JSON.parse(storedList)
        setCompareList(Array.isArray(parsedList) ? parsedList : [])
      } catch (err) {
        console.error('Erreur lors du parsing de la liste de comparaison:', err)
        setCompareList([])
      }
    }
  }, [])

  // Charger les détails des logements à comparer
  useEffect(() => {
    const fetchAccommodations = async () => {
      if (compareList.length === 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const accommodationsData: Accommodation[] = []

        // Récupérer les détails de chaque logement
        for (const id of compareList) {
          const response = await fetch(`/api/accommodations/${id}`)
          if (response.ok) {
            const data = await response.json()
            accommodationsData.push(data)
          } else {
            console.error(`Erreur lors du chargement du logement ${id}`)
          }
        }

        setAccommodations(accommodationsData)
      } catch (err) {
        console.error('Erreur lors du chargement des logements:', err)
        setError('Impossible de charger les logements à comparer.')
      } finally {
        setLoading(false)
      }
    }

    if (compareList.length > 0) {
      fetchAccommodations()
    } else {
      // S'assurer que loading est mis à false même si la liste est vide
      setLoading(false)
    }
  }, [compareList])

  // Supprimer un logement de la comparaison
  const removeFromCompare = (id: string) => {
    const newList = compareList.filter(itemId => itemId !== id)
    localStorage.setItem('compareList', JSON.stringify(newList))
    setCompareList(newList)
    setAccommodations(accommodations.filter(acc => acc._id !== id))
  }

  // Vider la liste de comparaison
  const clearCompareList = () => {
    localStorage.setItem('compareList', JSON.stringify([]))
    setCompareList([])
    setAccommodations([])
  }

  // Extraire la valeur numérique du prix ou de la surface
  const extractNumericValue = (value: string | number | undefined): number => {
    if (value === undefined) return 0
    if (typeof value === 'number') return value
    
    // Extraire les chiffres de la chaîne (ex: "850€" -> 850)
    const match = value.match(/\d+(\.\d+)?/)
    return match ? parseFloat(match[0]) : 0
  }

  // Déterminer la meilleure valeur pour une propriété donnée
  const getBestValue = (property: 'price' | 'surface' | 'rooms') => {
    if (accommodations.length === 0) return null
    
    const values = accommodations.map(acc => {
      const value = extractNumericValue(acc[property])
      return { id: acc._id, value }
    })
    
    if (property === 'price') {
      // Pour le prix, la valeur la plus basse est la meilleure
      return values.reduce((min, item) => 
        item.value > 0 && (min === null || item.value < min.value) ? item : min, 
        null as { id: string, value: number } | null
      )
    } else {
      // Pour la surface et le nombre de pièces, la valeur la plus haute est la meilleure
      return values.reduce((max, item) => 
        item.value > (max?.value || 0) ? item : max, 
        null as { id: string, value: number } | null
      )
    }
  }

  // Obtenir la classe CSS pour mettre en évidence la meilleure valeur
  const getHighlightClass = (accommodation: Accommodation, property: 'price' | 'surface' | 'rooms') => {
    const bestValue = getBestValue(property)
    if (!bestValue) return ''
    
    if (accommodation._id === bestValue.id) {
      return 'bg-green-100 text-green-800' // Toutes les meilleures valeurs en vert
    }
    return ''
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Comparateur de logements</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {compareList.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Aucun logement à comparer</h2>
          <p className="text-gray-600 mb-6">
            Ajoutez des logements à comparer en cliquant sur "Ajouter à la comparaison" sur les fiches des logements.
          </p>
          <Link 
            href="/accommodations" 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Voir les logements
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              {accommodations.length} logement{accommodations.length > 1 ? 's' : ''} en comparaison
            </p>
            <button
              onClick={clearCompareList}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Vider la comparaison
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              {/* En-tête avec photos et titres */}
              <thead>
                <tr>
                  <th className="p-4 border-b text-left w-1/5">Caractéristiques</th>
                  {accommodations.map(accommodation => (
                    <th key={accommodation._id} className="p-4 border-b">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(accommodation._id)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                          title="Retirer de la comparaison"
                        >
                          &times;
                        </button>
                        
                        <div className="h-40 relative mb-3 rounded-lg overflow-hidden">
                          {accommodation.images && accommodation.images.length > 0 ? (
                            <img 
                              src={accommodation.images[0]} 
                              alt={accommodation.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">Pas d'image</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-medium text-lg mb-2 line-clamp-2">
                          <Link 
                            href={`/accommodations/${accommodation._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {accommodation.title}
                          </Link>
                        </h3>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {/* Prix */}
                <tr className="bg-gray-50">
                  <td className="p-4 border-b font-medium">Prix</td>
                  {accommodations.map(accommodation => (
                    <td 
                      key={`${accommodation._id}-price`} 
                      className={`p-4 border-b text-center ${getHighlightClass(accommodation, 'price')}`}
                    >
                      {accommodation.price || 'Non spécifié'}
                    </td>
                  ))}
                </tr>
                
                {/* Surface */}
                <tr>
                  <td className="p-4 border-b font-medium">Surface</td>
                  {accommodations.map(accommodation => (
                    <td 
                      key={`${accommodation._id}-surface`} 
                      className={`p-4 border-b text-center ${getHighlightClass(accommodation, 'surface')}`}
                    >
                      {accommodation.surface || 'Non spécifié'}
                    </td>
                  ))}
                </tr>
                
                {/* Nombre de pièces */}
                <tr className="bg-gray-50">
                  <td className="p-4 border-b font-medium">Nombre de pièces</td>
                  {accommodations.map(accommodation => (
                    <td 
                      key={`${accommodation._id}-rooms`} 
                      className={`p-4 border-b text-center ${getHighlightClass(accommodation, 'rooms')}`}
                    >
                      {accommodation.rooms || 'Non spécifié'}
                    </td>
                  ))}
                </tr>
                
                {/* Adresse */}
                <tr>
                  <td className="p-4 border-b font-medium">Adresse</td>
                  {accommodations.map(accommodation => (
                    <td key={`${accommodation._id}-address`} className="p-4 border-b text-center">
                      {accommodation.address || 'Non spécifiée'}
                    </td>
                  ))}
                </tr>
                
                {/* Prix au m² */}
                <tr className="bg-gray-50">
                  <td className="p-4 border-b font-medium">Prix au m²</td>
                  {accommodations.map(accommodation => {
                    const price = extractNumericValue(accommodation.price)
                    const surface = extractNumericValue(accommodation.surface)
                    const pricePerSqm = surface > 0 && price > 0 
                      ? Math.round(price / surface) 
                      : null
                    
                    return (
                      <td key={`${accommodation._id}-price-per-sqm`} className="p-4 border-b text-center">
                        {pricePerSqm ? `${pricePerSqm}€/m²` : 'Non calculable'}
                      </td>
                    )
                  })}
                </tr>
                
                {/* Localisation */}
                <tr>
                  <td className="p-4 border-b font-medium">Localisation</td>
                  {accommodations.map(accommodation => (
                    <td key={`${accommodation._id}-location`} className="p-4 border-b">
                      <div className="h-48 rounded-lg overflow-hidden">
                        <Map 
                          accommodations={[accommodation]} 
                          className="h-full w-full"
                          zoom={14}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Description */}
                <tr className="bg-gray-50">
                  <td className="p-4 border-b font-medium">Description</td>
                  {accommodations.map(accommodation => (
                    <td key={`${accommodation._id}-description`} className="p-4 border-b">
                      <div className="max-h-40 overflow-y-auto text-sm">
                        {accommodation.description || 'Pas de description disponible'}
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Lien vers l'annonce */}
                <tr>
                  <td className="p-4 border-b font-medium">Actions</td>
                  {accommodations.map(accommodation => (
                    <td key={`${accommodation._id}-actions`} className="p-4 border-b text-center">
                      <div className="flex flex-col space-y-2">
                        <Link 
                          href={`/accommodations/${accommodation._id}`}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Voir le détail
                        </Link>
                        <a 
                          href={accommodation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                        >
                          Voir l'annonce originale
                        </a>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {/* Barre de navigation */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-center space-x-4">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Accueil
          </Link>
          
          <Link href="/accommodations" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
            Logements
          </Link>
          
          <Link href="/statistics" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
            Statistiques
          </Link>
          
          <Link href="/compare" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
            Comparateur
          </Link>
          
          {isLoggedIn ? (
            <form action="/api/user/logout" method="POST" className="inline">
              <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                Déconnexion
              </button>
            </form>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
