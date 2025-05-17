'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

type Accommodation = {
  _id: string
  title: string
  url: string
  latitude: number
  longitude: number
  address?: string
}

// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import('./Map'), { ssr: false })

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])

  useEffect(() => {
    fetch('/api/accommodations')
      .then((res) => res.json())
      .then((data) => setAccommodations(data))
      .catch((err) => console.error('Failed to fetch accommodations:', err))
  }, [])

  const handleLike = async (id: string) => {
    try {
      const res = await fetch('/api/user/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accommodationId: id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to like')

      alert('Logement liké !')
    } catch (err) {
      console.error(err)
      alert('Connectez-vous pour liker un logement.')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Logements</h1>
        <ul className="space-y-4">
          {accommodations.map((accommodation) => (
            <li key={accommodation._id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">
                <a
                  href={accommodation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {accommodation.title}
                </a>
              </h2>
              <p>{accommodation.address}</p>
              <button
                onClick={() => handleLike(accommodation._id)}
                className="cursor-pointer mt-2 px-3 py-1 bg-pink-500 text-white rounded"
              >
                ❤️ J'aime
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Map accommodations={accommodations} />
      </div>
    </div>
  )
}
