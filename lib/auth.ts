import { cookies } from 'next/headers'
import dbConnect from './mongodb'
import User from '@/models/User'
import Annonce from '@/lib/models/Annonce'

interface UserDocument {
  _id: { toString: () => string }
  name: string
  lastName: string
  email: string
  phone: string
  address: string
  likedAccommodations: string[]
  [key: string]: unknown
}

interface AnnonceDocument {
  _id: { toString: () => string }
  title: string
  address?: string
  price?: number
  url: string
  surface?: number
  rooms?: number
  description?: string
  [key: string]: unknown
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) return null

  try {
    await dbConnect()
    const user = await User.findById(userId).lean() as UserDocument | null

    if (!user) return null

    // First, ensure we have an array of valid ObjectIds
    const accommodationIds = (user.likedAccommodations || []).filter(id => 
      id && typeof id === 'string' && id.trim() !== ''
    )

    // Only try to find annonces if we have valid IDs
    let likedAccommodations: AnnonceDocument[] = []
    if (accommodationIds.length > 0) {
      const results = await Annonce.find({
        _id: { $in: accommodationIds }
      }).lean().exec()
      
      // Type assertion to handle the lean document
      likedAccommodations = results as unknown as AnnonceDocument[]
    }

    // Map the results, ensuring we have all required fields
    const mappedAccommodations = likedAccommodations
      .filter(acc => acc != null) // Filter out any null/undefined results
      .map((acc) => ({
        _id: acc._id?.toString() || '',
        title: acc.title || 'Sans titre',
        location: acc.address || 'Localisation inconnue',
        price: acc.price || 0,
        surface: acc.surface,
        url: acc.url || '#',
      }))

    return {
      _id: user._id?.toString() || '',
      name: user.name || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      likedAccommodations: mappedAccommodations
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}
