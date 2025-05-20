'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from '@/app/components/Footer'

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
              <h2 className="text-xl font-semibold mb-2">Créateurs</h2>
              <p className="text-gray-700">
                Noa Vincent<br />
                Julie Demont<br />
                Thibault Railla <br />
                Benoît Conne
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">Notre projet</h2>
              <p className="text-gray-700">
                Retrouvez notre projet sur GitHub :<br />
                <a 
                  href="https://github.com/Kibanker/projet-tw/tree/mapimo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://github.com/Kibanker/projet-tw/tree/mapimo
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
