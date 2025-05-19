'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function ContactPage() {
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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Contact</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Adresse</h2>
              <p className="text-gray-700">
                Institut National Universitaire Champollion<br />
                Pl. de Verdun<br />
                81000 Albi
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">Notre projet</h2>
              <p className="text-gray-700">
                Retrouvez notre projet sur GitHub :<br />
                <a 
                  href="https://github.com/Kibanker/projet-tw/tree/immo-app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://github.com/Kibanker/projet-tw/tree/immo-app
                </a>
              </p>
            </section>
          </div>
        </div>
        
        {/* Barre de navigation */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
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
      </main>
      
      <Footer />
    </div>
  )
}
