import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart, FaExternalLinkAlt } from 'react-icons/fa'

export default async function UserPage() {
  const user = await getCurrentUser()

  if (!user) redirect('/register')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* En-tête de profil */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white mb-4 sm:mb-0 sm:mr-6">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Bienvenue, {user.name}!</h1>
                <p className="mt-2 text-blue-100">Gérez vos informations et vos favoris</p>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-8 sm:px-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FaUser className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">{user.name} {user.lastName}</dd>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FaEnvelope className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-500">Adresse email</dt>
                  <dd className="mt-1 text-lg text-gray-900 break-all">{user.email}</dd>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FaPhone className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                  <dd className="mt-1 text-lg text-gray-900">{user.phone || 'Non renseigné'}</dd>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FaMapMarkerAlt className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                  <dd className="mt-1 text-lg text-gray-900">{user.address || 'Non renseignée'}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des favoris */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Vos favoris</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {user.likedAccommodations.length > 0 
                    ? `${user.likedAccommodations.length} annonce${user.likedAccommodations.length > 1 ? 's' : ''} enregistrée${user.likedAccommodations.length > 1 ? 's' : ''}` 
                    : 'Aucune annonce enregistrée pour le moment'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <FaHeart className="h-8 w-8 text-pink-500" />
              </div>
            </div>
          </div>
          
          {user.likedAccommodations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {user.likedAccommodations.map((acc: any) => (
                <div key={acc._id} className="group hover:bg-gray-50 transition-colors duration-200">
                  <div className="px-6 py-5 sm:px-8 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/accommodations/${acc._id}`}
                          className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {acc.title}
                        </Link>
                        {acc.location && (
                          <p className="mt-1 flex items-center text-gray-500">
                            <FaMapMarkerAlt className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1.5" />
                            <span className="truncate">{acc.location}</span>
                          </p>
                        )}
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:items-end">
                        {acc.price && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(acc.price)}/mois
                          </span>
                        )}
                        {acc.surface && (
                          <span className="mt-2 text-sm text-gray-500">
                            {acc.surface} m²
                          </span>
                        )}
                      </div>
                    </div>
                    {acc.url && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a 
                          href={acc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FaExternalLinkAlt className="h-3.5 w-3.5 mr-1.5" />
                          Voir l&apos;annonce originale
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 sm:px-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50">
                <FaHeart className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun favori pour le moment</h3>
              <p className="mt-1 text-sm text-gray-500">Commencez par ajouter des annonces à vos favoris !</p>
              <div className="mt-6">
                <Link 
                  href="/accommodations" 
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Parcourir les annonces
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
