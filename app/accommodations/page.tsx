'use client'

//useMemo est un hook qui sert à mémoriser une valeur calculée pour éviter de recalculer une valeur complexe à chaque rendu, à moins que ses dépendances aient changé.
import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Footer from '@/app/components/Footer'


export type Annonce = {
  _id: string
  title: string
  url?: string
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
  image?: string
  rawData?: {
    _id?: string
    [key: string]: unknown
  }
  images?: string[]
}

type SortField = 'title' | 'price' | 'surface' | 'rooms'
type SortDirection = 'asc' | 'desc'


// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import('./Map'), { ssr: false })

export default function AccommodationsPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  // Charger les logements
  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/accommodations')
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des annonces')
        }
        const data = await response.json()
        setAnnonces(data)
        setError(null)
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les logements. Veuillez réessayer plus tard.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnnonces()
  }, [])

  // Filtrer et trier les annonces
  const filteredSortedAnnonces = useMemo(() => {
    //Filtrage
    const filtered = annonces.filter(annonce => 
      annonce.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (annonce.address && annonce.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (annonce.description && annonce.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    //Tri
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField] ?? ''
      const bValue = b[sortField] ?? ''
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [annonces, searchTerm, sortField, sortDirection])

  // Gérer le sens du tri en l'inversant quand l'utilisateur rappuie dessus
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Rendu de l'icône de tri
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  // Like functionality has been removed as it's not being used in the current implementation
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Logements</h1>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Titre
                      <span className="ml-1">{renderSortIcon('title')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Prix
                      <span className="ml-1">{renderSortIcon('price')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 hidden md:table-cell"
                    onClick={() => handleSort('surface')}
                  >
                    <div className="flex items-center">
                      Surface
                      <span className="ml-1">{renderSortIcon('surface')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 hidden md:table-cell"
                    onClick={() => handleSort('rooms')}
                  >
                    <div className="flex items-center">
                      Pièces
                      <span className="ml-1">{renderSortIcon('rooms')}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSortedAnnonces.map((accommodation) => (
                  <tr 
                    key={accommodation._id} 
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <a
                            href={`/accommodations/${accommodation._id}`}
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            {accommodation.title}
                          </a>
                          <div className="text-sm text-gray-500">{accommodation.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {accommodation.price ? `${accommodation.price} €` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {accommodation.surface ? `${accommodation.surface} m²` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {accommodation.rooms || '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredSortedAnnonces.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Aucun logement ne correspond à votre recherche.
              </div>
            )}
          </div>
        </div>

        <div className="sticky top-4 h-[calc(100vh-2rem)]">
          <Map accommodations={filteredSortedAnnonces} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
