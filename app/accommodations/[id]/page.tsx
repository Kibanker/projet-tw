'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import Comments from '@/components/Comments';
import CompareButton from '@/components/CompareButton';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast'

type RawData = {
  images?: string[] | null;
  equipements?: string[] | null;
  [key: string]: unknown;
};

type Accommodation = {
  _id: string;
  title: string;
  url: string;
  latitude: number;
  longitude: number;
  address?: string;
  price?: number;
  surface?: number;
  rooms?: number;
  description?: string;
  images?: string[] | null;
  equipments?: string[] | null;
  source?: string;
  lastScraped?: string;
  rawData?: RawData;
};

// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import('../Map'), { ssr: false, loading: () => (
  <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)})

export default function AccommodationDetailPage() {
  const { id } = useParams()
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchAccommodation = async () => {
      try {
        const response = await fetch(`/api/accommodations/${id}`)
        if (!response.ok) {
          throw new Error('Logement non trouvé')
        }
        const data = await response.json()
        setAccommodation(data)
      } catch (err) {
        console.error('Erreur lors du chargement du logement:', err)
        setError('Impossible de charger les détails du logement')
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodation()
  }, [id])

  const handleLike = async () => {
    if (!accommodation) return

    try {
      const res = await fetch('/api/user/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accommodationId: accommodation._id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Échec du like')

      toast.success('Ajouté à vos favoris ! 💖', {
        icon: '🏡',
        duration: 1500,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
    } catch (err) {
      console.error(err)
      toast.error('Connectez-vous pour ajouter ce logement à vos favoris.', {
        icon: '🏡',
        duration: 1500,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur ! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <Link 
            href="/accommodations" 
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retour à la liste
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Logement non trouvé</h1>
          <Link 
            href="/accommodations" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retour à la liste
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // Extraire les données nécessaires
  const { title, price, surface, rooms, address, description, rawData } = accommodation;
  
  // Extraire les images et équipements de rawData s'ils existent, sinon utiliser les champs de premier niveau
  const images = Array.isArray(rawData?.images) 
    ? rawData.images.filter((img: unknown): img is string => typeof img === 'string' && img.trim() !== '')
    : Array.isArray(accommodation.images) 
      ? accommodation.images.filter((img: unknown): img is string => typeof img === 'string' && img.trim() !== '')
      : [];

  const equipments = Array.isArray(rawData?.equipements) 
    ? rawData.equipements
    : Array.isArray(accommodation.equipments)
      ? accommodation.equipments
      : [];

  // Fonction pour formater le prix
  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Prix non spécifié';
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(price) + ' / mois';  // Ajout de '/mois' pour plus de clarté
  };
  
  // Fonction pour formater la surface
  const formatSurface = (surface: number | undefined) => {
    if (!surface) return 'Surface non spécifiée';
    return `${surface} m²`;
  };
  
  // Fonction pour gérer le clic sur une miniature
  const handleThumbnailClick = (clickedImg: string, index: number) => {
    if (!images || !accommodation) return;
    
    const newImages = [...images];
    newImages[0] = clickedImg;
    newImages[index] = images[0];
    
    setAccommodation({
      ...accommodation,
      images: newImages
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* En-tête avec image et titre */}
          <div className="relative">
            {images && images.length > 0 ? (
              <div className="relative group">
                <div className="relative w-full h-96 overflow-hidden">
                  <Image 
                    src={images[0]} 
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
                {/* Galerie d'images miniatures en bas */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 px-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                      {images.map((img: string, index: number) => (
                        <div 
                          key={index}
                          className="relative flex-shrink-0 w-16 h-12 cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all"
                          onClick={() => handleThumbnailClick(img, index)}
                        >
                          <Image 
                            src={img}
                            alt={`${title} ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h1 className="text-3xl font-bold text-white">{title}</h1>
                  {price && (
                    <p className="text-2xl font-semibold text-white mt-2">{formatPrice(price)}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Aucune image disponible</span>
              </div>
            )}
          </div>

          {/* Section Détails */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Colonne de gauche - Détails */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Détails du logement</h2>
                <div className="space-y-4">
                  {surface && <p><span className="font-medium">Surface :</span> {formatSurface(surface)}</p>}
                  {rooms && <p><span className="font-medium">Pièces :</span> {rooms}</p>}
                  {address && <p><span className="font-medium">Adresse :</span> {address}</p>}
                </div>
                
                {/* Description */}
                {description && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{description}</p>
                  </div>
                )}
                
                {/* Équipements */}
                {equipments && equipments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">Équipements</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {equipments.map((equipment: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                          <span className="text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="capitalize">{equipment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Commentaires */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Commentaires</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <Comments accommodationId={id as string} />
                  </div>
                </div>
              </div>
              
              {/* Colonne de droite - Carte */}
              <div className="md:col-span-1">
                {accommodation.latitude && accommodation.longitude && (
                  <div className="sticky top-4">
                    <h3 className="text-xl font-semibold mb-3">Localisation</h3>
                    <div className="h-96 rounded-lg overflow-hidden">
                      <Map 
                        accommodations={[{
                          _id: accommodation._id,
                          title: accommodation.title,
                          url: accommodation.url,
                          latitude: accommodation.latitude,
                          longitude: accommodation.longitude,
                          price: accommodation.price,
                          surface: accommodation.surface,
                          rooms: accommodation.rooms,
                          description: accommodation.description,
                          source: accommodation.source
                        }]}
                        zoom={15}
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-end gap-4">
              <button
                onClick={handleLike}
                className="cursor-pointer group relative flex items-center px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg overflow-hidden transition-all duration-300 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg"
              >
                <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Ajouter aux favoris</span>
              </button>
              
              <CompareButton accommodationId={id as string} />
              
              <button 
                className="cursor-pointer flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => window.history.back()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Retour</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Espacement en bas de page */}
        <div className="mt-8"></div>
      </div>
      <Footer />
    </div>
  )
}
