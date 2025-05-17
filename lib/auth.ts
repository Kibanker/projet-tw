import { cookies } from 'next/headers'
import dbConnect from './mongodb'
import User from '@/models/User'
import Accommodation from '@/lib/models/Accommodation'

export async function getCurrentUser() {
  const cookieStore = cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) return null

  await dbConnect()
  const user = await User.findById(userId).lean()

  if (!user) return null

  const likedAccommodations = await Accommodation.find({
    _id: { $in: user.likedAccommodations }
  }).lean()

  return {
    _id: user._id.toString(),
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    likedAccommodations: likedAccommodations.map((acc) => ({
      _id: acc._id.toString(),
      title: acc.title,
      location: acc.location,
      price: acc.price,
      url: acc.url
    }))
  }
}
