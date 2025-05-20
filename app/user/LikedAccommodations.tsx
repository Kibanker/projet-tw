'use client';

import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';

interface Accommodation {
  _id: string;
  title: string;
  location: string;
  price: number;
  surface?: number;
  url: string;
}

interface LikedAccommodationsProps {
  accommodations: Accommodation[];
}

export default function LikedAccommodations({ accommodations }: LikedAccommodationsProps) {
  async function removeLikedAccommodation(accommodationId: string) {
    try {
      const response = await fetch('/api/user/like', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accommodationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove accommodation');
      }

      // Refresh the page to show the updated list
      window.location.reload();
    } catch (error) {
      console.error('Error removing accommodation:', error);
    }
  }

  if (accommodations.length === 0) {
    return (
      <div className="px-6 py-12 sm:px-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50">
          <FaTimes className="h-8 w-8 text-pink-400" />
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
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {accommodations.map((acc) => (
        <div key={acc._id} className="group hover:bg-gray-50 transition-colors duration-200">
          <div className="px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0 pr-4">
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
              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <button
                  onClick={() => removeLikedAccommodation(acc._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors -mt-1 -mr-2"
                  title="Retirer des favoris"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
                <div className="flex flex-col items-end">
                  {acc.price && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(acc.price)}/mois
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
