'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'

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
  source?: string
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
    
    // Pour le prix, la meilleure valeur est la plus basse
    if (property === 'price') {
      return accommodations.reduce((best, current) => {
        const currentValue = extractNumericValue(current[property])
        const bestValue = extractNumericValue(best[property])
        return currentValue > 0 && (bestValue === 0 || currentValue < bestValue) ? current : best
      }, accommodations[0])
    } 
    // Pour la surface et les pièces, la meilleure valeur est la plus haute
    else {
      return accommodations.reduce((best, current) => {
        const currentValue = extractNumericValue(current[property])
        const bestValue = extractNumericValue(best[property])
        return currentValue > bestValue ? current : best
      }, accommodations[0])
    }
  }

  // Obtenir la classe CSS pour mettre en évidence la meilleure valeur
  const getHighlightClass = (accommodation: Accommodation, property: 'price' | 'surface' | 'rooms') => {
    const bestValue = getBestValue(property)
    if (!bestValue) return ''
    
    return bestValue._id === accommodation._id 
      ? 'bg-green-100 font-semibold text-green-800 p-1 rounded' 
      : ''
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
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
              Pour comparer des logements, ajoutez-les à votre liste de comparaison depuis la page de détails d'un logement.
            </p>
            <Link 
              href="/accommodations" 
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
            >
              Voir les logements
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {accommodations.length} logement{accommodations.length > 1 ? 's' : ''} à comparer
              </h2>
              <button
                onClick={clearCompareList}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Vider la liste
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 border-b"></th>
                    {accommodations.map(accommodation => (
                      <th key={accommodation._id} className="p-4 border-b">
                        <div className="flex flex-col items-center">
                          {accommodation.images && accommodation.images.length > 0 ? (
                            <div className="relative w-32 h-24 mb-3">
                              <Image 
                                src={accommodation.images[0]} 
                                alt={accommodation.title}
                                fill
                                className="object-cover rounded-md"
                                sizes="128px"
                              />
                            </div>
                          ) : (
                            <div className="w-32 h-24 bg-gray-200 flex items-center justify-center mb-3 rounded-md">
                              <span className="text-gray-400">Pas d'image</span>
                            </div>
                          )}
                          <h3 className="font-medium text-center">{accommodation.title}</h3>
                          <button
                            onClick={() => removeFromCompare(accommodation._id)}
                            className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-300 transition-colors"
                          >
                            Retirer
                          </button>
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
                      <td key={`${accommodation._id}-price`} className="p-4 border-b text-center">
                        <span className={getHighlightClass(accommodation, 'price')}>
                          {typeof accommodation.price === 'number' 
                            ? `${accommodation.price} €` 
                            : accommodation.price || 'Non spécifié'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Surface */}
                  <tr>
                    <td className="p-4 border-b font-medium">Surface</td>
                    {accommodations.map(accommodation => (
                      <td key={`${accommodation._id}-surface`} className="p-4 border-b text-center">
                        <span className={getHighlightClass(accommodation, 'surface')}>
                          {typeof accommodation.surface === 'number' 
                            ? `${accommodation.surface} m²` 
                            : accommodation.surface || 'Non spécifié'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Pièces */}
                  <tr className="bg-gray-50">
                    <td className="p-4 border-b font-medium">Pièces</td>
                    {accommodations.map(accommodation => (
                      <td key={`${accommodation._id}-rooms`} className="p-4 border-b text-center">
                        <span className={getHighlightClass(accommodation, 'rooms')}>
                          {accommodation.rooms || 'Non spécifié'}
                        </span>
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
                  
                  {/* Localisation */}
                  <tr>
                    <td className="p-4 border-b font-medium">Localisation</td>
                    {accommodations.map(accommodation => (
                      <td key={`${accommodation._id}-location`} className="p-4 border-b">
                        <div className="h-48 rounded-lg overflow-hidden">
                          <Map 
                            accommodations={[accommodation as any]} 
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
      <Footer />
    </div>
  )
}
