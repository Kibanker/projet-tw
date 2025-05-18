'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Types
type Accommodation = {
  _id: string
  title: string
  price?: string | number
  surface?: string | number
  rooms?: number
}

type Comment = {
  id: string
  accommodationId: string
  text: string
  userName: string
  createdAt: string
}

type AccommodationStats = {
  totalCount: number
  averagePrice: number
  averageSurface: number
  averageRooms: number
  cityDistribution: Record<string, number>
}

type UserStats = {
  totalComments: number
  comments: Comment[]
  favoriteCount: number
  mostCommentedAccommodation?: {
    id: string
    title: string
    count: number
  }
  commentsByMonth: Record<string, number>
  averageCommentLength: number
  firstCommentDate?: string
  lastCommentDate?: string
}

export default function StatisticsPage() {
  const [accommodationStats, setAccommodationStats] = useState<AccommodationStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [accommodations, setAccommodations] = useState<Record<string, Accommodation>>({})
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

  // Charger les statistiques des appartements
  useEffect(() => {
    const fetchAccommodationStats = async () => {
      try {
        setLoading(true)
        
        // Récupérer tous les appartements
        const response = await fetch('/api/accommodations')
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des logements')
        }
        
        const data = await response.json()
        
        // Créer un dictionnaire d'appartements pour référence rapide
        const accommodationsMap: Record<string, Accommodation> = {}
        data.forEach((acc: Accommodation) => {
          accommodationsMap[acc._id] = acc
        })
        setAccommodations(accommodationsMap)
        
        // Calculer les statistiques
        const priceValues = data
          .filter((acc: Accommodation) => acc.price)
          .map((acc: Accommodation) => {
            // Convertir le prix en nombre si c'est une chaîne (ex: "850€" -> 850)
            const price = typeof acc.price === 'string' 
              ? parseFloat(acc.price.replace(/[^\d.-]/g, '')) 
              : acc.price
            return price
          })
        
        const surfaceValues = data
          .filter((acc: Accommodation) => acc.surface)
          .map((acc: Accommodation) => {
            // Convertir la surface en nombre si c'est une chaîne (ex: "28m²" -> 28)
            const surface = typeof acc.surface === 'string' 
              ? parseFloat(acc.surface.replace(/[^\d.-]/g, '')) 
              : acc.surface
            return surface
          })
        
        const roomsValues = data
          .filter((acc: Accommodation) => acc.rooms)
          .map((acc: Accommodation) => acc.rooms)
        
        // Calculer la distribution par ville (basée sur le titre ou une autre propriété disponible)
        const cityDistribution: Record<string, number> = {}
        data.forEach((acc: Accommodation) => {
          // Essayer d'extraire une ville du titre de l'appartement
          // Par exemple, si le titre contient "Appartement à Paris" ou "Studio - Lyon"
          if (acc.title) {
            const cityMatch = acc.title.match(/(?:à|à |en |- )([A-Za-z\s-]+)$/i)
            if (cityMatch && cityMatch[1]) {
              const city = cityMatch[1].trim()
              cityDistribution[city] = (cityDistribution[city] || 0) + 1
            } else {
              // Si aucune ville n'est trouvée, regrouper sous "Autre"
              cityDistribution['Autre'] = (cityDistribution['Autre'] || 0) + 1
            }
          }
        })
        
        setAccommodationStats({
          totalCount: data.length,
          averagePrice: priceValues.length 
            ? priceValues.reduce((sum: number, price: number) => sum + price, 0) / priceValues.length 
            : 0,
          averageSurface: surfaceValues.length 
            ? surfaceValues.reduce((sum: number, surface: number) => sum + surface, 0) / surfaceValues.length 
            : 0,
          averageRooms: roomsValues.length 
            ? roomsValues.reduce((sum: number, rooms: number) => sum + rooms, 0) / roomsValues.length 
            : 0,
          cityDistribution
        })
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les statistiques des logements.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchAccommodationStats()
  }, [])
  
  // Charger les statistiques de l'utilisateur (commentaires)
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!isLoggedIn) return
      
      try {
        // Récupérer les commentaires de l'utilisateur
        const response = await fetch('/api/comments/user')
        if (!response.ok) {
          if (response.status === 401) {
            // L'utilisateur n'est pas connecté
            return
          }
          throw new Error('Erreur lors du chargement des commentaires')
        }
        
        const data = await response.json()
        
        // Calculer des statistiques supplémentaires sur les commentaires
        const commentsByMonth: Record<string, number> = {}
        let totalCommentLength = 0
        let firstCommentDate = data.length > 0 ? new Date(data[data.length - 1].createdAt) : undefined
        let lastCommentDate = data.length > 0 ? new Date(data[0].createdAt) : undefined
        
        // Compter les commentaires par logement
        const commentsByAccommodation: Record<string, {count: number, title: string}> = {}
        
        data.forEach((comment: Comment) => {
          // Calculer la longueur totale des commentaires
          totalCommentLength += comment.text.length
          
          // Compter les commentaires par mois
          const date = new Date(comment.createdAt)
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
          commentsByMonth[monthYear] = (commentsByMonth[monthYear] || 0) + 1
          
          // Compter les commentaires par logement
          const accId = comment.accommodationId
          if (!commentsByAccommodation[accId]) {
            commentsByAccommodation[accId] = {
              count: 0,
              title: accommodations[accId]?.title || 'Logement inconnu'
            }
          }
          commentsByAccommodation[accId].count++
        })
        
        // Trouver le logement le plus commenté
        let mostCommentedAccommodation = undefined
        let maxComments = 0
        
        Object.entries(commentsByAccommodation).forEach(([id, info]) => {
          if (info.count > maxComments) {
            maxComments = info.count
            mostCommentedAccommodation = {
              id,
              title: info.title,
              count: info.count
            }
          }
        })
        
        // Récupérer le nombre de favoris
        let favoriteCount = 0
        try {
          const userResponse = await fetch('/api/user/current')
          if (userResponse.ok) {
            const userData = await userResponse.json()
            favoriteCount = userData.user?.likedAccommodations?.length || 0
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des favoris:', error)
        }
        
        setUserStats({
          totalComments: data.length,
          comments: data,
          favoriteCount,
          mostCommentedAccommodation,
          commentsByMonth,
          averageCommentLength: data.length > 0 ? totalCommentLength / data.length : 0,
          firstCommentDate: firstCommentDate?.toISOString(),
          lastCommentDate: lastCommentDate?.toISOString()
        })
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger vos commentaires.')
      }
    }
    
    if (isLoggedIn) {
      fetchUserStats()
    }
  }, [isLoggedIn])
  
  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
      <h1 className="text-3xl font-bold mb-8 text-center">Statistiques</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Statistiques des appartements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Statistiques des logements</h2>
          
          {accommodationStats && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Nombre total de logements:</span>
                <span className="text-lg font-bold">{accommodationStats.totalCount}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Prix moyen:</span>
                <span className="text-lg font-bold">{accommodationStats.averagePrice.toFixed(2)}€</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Surface moyenne:</span>
                <span className="text-lg font-bold">{accommodationStats.averageSurface.toFixed(2)}m²</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Nombre moyen de pièces:</span>
                <span className="text-lg font-bold">{accommodationStats.averageRooms.toFixed(1)}</span>
              </div>
              
              {Object.keys(accommodationStats.cityDistribution).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Distribution par ville</h3>
                  <div className="space-y-2">
                    {Object.entries(accommodationStats.cityDistribution)
                      .sort(([, countA], [, countB]) => countB - countA)
                      .map(([city, count]) => (
                        <div key={city} className="flex justify-between items-center">
                          <span>{city}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            {count} logement{count > 1 ? 's' : ''}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Statistiques de l'utilisateur */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-green-600">Vos statistiques</h2>
          
          {!isLoggedIn ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Connectez-vous pour voir vos statistiques personnelles</p>
              <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Se connecter
              </Link>
            </div>
          ) : userStats ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Nombre de commentaires:</span>
                <span className="text-lg font-bold">{userStats.totalComments}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Nombre de favoris:</span>
                <span className="text-lg font-bold">{userStats.favoriteCount}</span>
              </div>
              

              
              {userStats.firstCommentDate && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Premier commentaire:</span>
                  <span className="text-lg font-bold">{formatDate(userStats.firstCommentDate)}</span>
                </div>
              )}
              
              {userStats.mostCommentedAccommodation && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Logement le plus commenté:</span>
                  <Link 
                    href={`/accommodations/${userStats.mostCommentedAccommodation.id}`}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    {userStats.mostCommentedAccommodation.title} ({userStats.mostCommentedAccommodation.count})
                  </Link>
                </div>
              )}
              
              {Object.keys(userStats.commentsByMonth).length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-3">Activité par mois</h3>
                  <div className="space-y-2">
                    {Object.entries(userStats.commentsByMonth)
                      .sort(([monthA], [monthB]) => {
                        const [monthA_num, yearA] = monthA.split('/')
                        const [monthB_num, yearB] = monthB.split('/')
                        if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA)
                        return parseInt(monthB_num) - parseInt(monthA_num)
                      })
                      .slice(0, 6) // Limiter aux 6 derniers mois
                      .map(([month, count]) => (
                        <div key={month} className="flex justify-between items-center">
                          <span>{month}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                            {count} commentaire{count > 1 ? 's' : ''}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
              
              {userStats.comments.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Vos commentaires</h3>
                  <div className="space-y-4">
                    {userStats.comments.map(comment => (
                      <div key={comment.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <Link 
                            href={`/accommodations/${comment.accommodationId}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {accommodations[comment.accommodationId]?.title || 'Logement inconnu'}
                          </Link>
                          <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Vous n'avez pas encore laissé de commentaires
                </p>
              )}
              
              {/* Bouton ancré en bas de la section */}
              <div className="mt-6 pt-4 border-t">
                <Link 
                  href="/user" 
                  className="block w-full py-3 bg-gray-700 text-white font-medium rounded hover:bg-gray-800 transition-colors text-center"
                >
                  Vos données personnelles et favoris
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Barre de navigation */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-center space-x-4">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Accueil
          </Link>
          
          <Link href="/accommodations" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
            Logements
          </Link>
          

          
          {isLoggedIn ? (
            <form action="/api/user/logout" method="POST" className="inline">
              <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                Déconnexion
              </button>
            </form>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
              Connexion
            </Link>
          )}
        </div>
      </div>
      

    </div>
  )
}
