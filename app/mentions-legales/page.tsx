'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function MentionsLegalesPage() {
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
          <h1 className="text-3xl font-bold mb-6">Mentions Légales</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Présentation du site</h2>
              <p>
                En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, 
                il est précisé aux utilisateurs du site l'identité des différents intervenants dans le cadre de sa réalisation 
                et de son suivi.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">2. Conditions générales d'utilisation</h2>
              <p>
                L'utilisation du site implique l'acceptation pleine et entière des conditions générales d'utilisation 
                décrites ci-après. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">3. Description des services fournis</h2>
              <p>
                Le site a pour objet de fournir une information concernant l'ensemble des activités de la société.
                Tous les informations indiquées sur le site sont données à titre indicatif, et sont susceptibles d'évoluer.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">4. Limitations contractuelles sur les données techniques</h2>
              <p>
                Le site utilise la technologie JavaScript. Le site Internet ne pourra être tenu responsable de dommages 
                matériels liés à l'utilisation du site.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">5. Propriété intellectuelle et contrefaçons</h2>
              <p>
                Tout le contenu du présent site, incluant, de façon non limitative, les graphismes, images, textes, vidéos, 
                animations, sons, logos, gifs et icônes ainsi que leur mise en forme sont la propriété exclusive de la société.
                Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, 
                de ces différents éléments est strictement interdite sans l'accord exprès par écrit.
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
