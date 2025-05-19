'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'

interface User {
  _id: string
  name: string
  lastName: string
  email: string
  phone: string
  address: string
  likedAccommodations: any[]
}

export default function Home() {
  const router = useRouter()
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
    <div className="min-h-screen flex flex-col bg-gray-900 font-sans text-white">
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-12 space-y-12">
        <h1 className="text-4xl font-bold text-white">
          {!loading && user ? `Bonjour ${user.name}!` : "Bienvenue sur notre app immobilier!"}
        </h1>

        {!loading && !user ? (
          <div className="flex gap-6">
            <button
              onClick={() => router.push('/register')}
              className="cursor-pointer px-6 py-3 rounded-md bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition"
            >
              S&apos;inscrire
            </button>
            <button
              onClick={() => router.push('/login')}
              className="cursor-pointer px-6 py-3 rounded-md bg-gray-200 text-gray-900 text-lg font-semibold hover:bg-gray-300 transition"
            >
              Se connecter
            </button>
          </div>
        ) : !loading && user ? (
          <form action="/api/user/logout" method="POST">
            <button 
              type="submit" 
              className="cursor-pointer px-6 py-3 rounded-md bg-red-600 text-white text-lg font-semibold hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </form>
        ) : null}

        <div className="text-center space-y-4">
          <p className="text-white text-lg">Accéder à nos fonctionnalités:</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/accommodations')}
              className="cursor-pointer px-5 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
              Voir les logements
            </button>
            <button
              onClick={() => router.push('/statistics')}
              className="cursor-pointer px-5 py-2 rounded-md bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition"
            >
              Statistiques
            </button>
            <button
              onClick={() => router.push('/compare')}
              className="cursor-pointer px-5 py-2 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
            >
              Comparateur
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
