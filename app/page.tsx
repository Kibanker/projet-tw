'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-6 py-12 space-y-12 font-sans text-white">

      <h1 className="text-4xl font-bold text-white">Bienvenue sur notre app immobilier!</h1>

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

      <div className="text-center space-y-4">
        <p className="text-white text-lg">Vous voulez simplement jeter un oeil à nos logements?</p>
        <button
          onClick={() => router.push('/accommodations')}
          className=" cursor-pointer px-5 py-2 rounded-md border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition"
        >
          Voir les logements
        </button>
      </div>
    </div>
  )
}
