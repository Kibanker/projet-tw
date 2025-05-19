'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  _id: string
  name: string
  lastName: string
  email: string
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

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
  }, [pathname])

  if (loading) {
    return null
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Mon App Immo
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/accommodations" 
            className={`px-3 py-2 rounded hover:bg-gray-700 ${pathname === '/accommodations' ? 'bg-gray-700' : ''}`}
          >
            Logements
          </Link>
          
          <Link 
            href="/compare" 
            className={`px-3 py-2 rounded hover:bg-gray-700 ${pathname === '/compare' ? 'bg-gray-700' : ''}`}
          >
            Comparateur
          </Link>
          
          <Link 
            href="/statistics" 
            className={`px-3 py-2 rounded hover:bg-gray-700 ${pathname === '/statistics' ? 'bg-gray-700' : ''}`}
          >
            Statistiques
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link 
                href="/user" 
                className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Mon Profil
              </Link>
              <form action="/api/user/logout" method="POST">
                <button 
                  type="submit" 
                  className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link 
                href="/login" 
                className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                className="px-3 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
