'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from '@/app/components/Footer'

interface User {
  _id: string
  name: string
  lastName: string
  email: string
  phone: string
  address: string
  likedAccommodations: unknown[]
}

export default function Home() {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/user/current')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut de connexion:', error)
      } finally {
        setLoading(false)
      }
    }

    checkLoginStatus()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 font-sans text-white">
      <div className="flex-grow flex flex-col items-center px-6 py-20 space-y-12">
        <div className="text-center space-y-6 max-w-4xl">
           <h1 className="text-8xl font-bold text-white">
            MAPIMO
          </h1>
          <br />
          <br />
          <h1 className="text-5xl font-bold text-white">
            {!loading && user ? `Bonjour ${user.name} !` : "Bienvenue sur notre application immobilière"}
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez notre sélection de logements, consultez les statistiques du marché
            et comparez les biens pour faire le meilleur choix immobilier.
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link
              href="/accommodations"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Voir les logements
            </Link>
            <Link
              href="/statistics"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Voir les statistiques
            </Link>
            <Link
              href="/compare"
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Comparer des biens
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
