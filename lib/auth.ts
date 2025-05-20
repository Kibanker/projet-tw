import { cookies } from 'next/headers'
import dbConnect from './mongodb'
import User from '@/models/User'

interface UserDocument {
  _id: { toString: () => string }
  name: string
  lastName: string
  email: string
  phone: string
  address: string
  likedAccommodations: Array<{
    _id: { toString: () => string }
    title?: string
    address?: string
    price?: number
    surface?: number
    url?: string
    images?: string[]
  }>
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) return null

  try {
    await dbConnect()
    
    // Find user and populate the likedAccommodations
    const user = await User.findById(userId)
      .populate({
        path: 'likedAccommodations',
        model: 'Annonce',
        select: 'title address price url surface images'
      })
      .lean()

    if (!user) return null

    // Map the populated accommodations to the expected format
    const userDoc = user as unknown as UserDocument
    const likedAccommodations = (userDoc.likedAccommodations || []).map((acc) => ({
      _id: acc._id?.toString(),
      title: acc.title || 'Sans titre',
      location: acc.address || 'Localisation inconnue',
      price: acc.price || 0,
      surface: acc.surface,
      url: acc.url || '#',
      images: acc.images || []
    }))

    return {
      _id: userDoc._id?.toString() || '',
      name: userDoc.name || '',
      lastName: userDoc.lastName || '',
      email: userDoc.email || '',
      phone: userDoc.phone || '',
      address: userDoc.address || '',
      likedAccommodations
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}
