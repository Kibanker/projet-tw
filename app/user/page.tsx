import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function UserPage() {
  const user = await getCurrentUser()

  if (!user) redirect('/register')

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-xl font-bold mb-4">Bienvenue, {user.name}!</h2>
      <div><strong>Prénom:</strong> {user.name}</div>
      <div><strong>Nom:</strong> {user.lastName}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Téléphone:</strong> {user.phone}</div>
      <div><strong>Adresse:</strong> {user.address}</div>

      <div>
        <h3 className="font-semibold mt-6 text-lg">Vos Annonces Favorites</h3>
        {user.likedAccommodations.length > 0 ? (
          <ul className="space-y-4 mt-2">
            {user.likedAccommodations.map((acc: any) => (
              <li key={acc._id} className="border p-4 rounded shadow-sm">
                <div className="font-semibold text-md">{acc.title}</div>
                <div className="text-sm text-gray-600">{acc.location}</div>
                <div className="text-sm text-gray-800">Prix: {acc.price}</div>
                <a
                  href={acc.url}
                  target="_blank"
                  className="text-blue-500 underline text-sm mt-1 inline-block"
                >
                  Voir l&apos;annonce
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Vous n&apos;avez pas encore d&apos;annonces favorites.</p>
        )}
      </div>

      <div className="flex space-x-4 mt-6">
        <a href="/accommodations" className="bg-blue-500 text-white p-2 rounded inline-block text-center">
          Voir les logements
        </a>
        <form action="/api/user/logout" method="POST">
          <button type="submit" className="bg-red-500 text-white p-2 rounded">Logout</button>
        </form>
      </div>
    </div>
  )
}
