import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// Handle adding a liked accommodation
export async function POST(req: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { accommodationId } = await req.json()

  if (!accommodationId) {
    return NextResponse.json({ error: 'Missing accommodationId' }, { status: 400 })
  }

  try {
    await dbConnect()

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Avoid adding duplicate accommodation ID
    if (!user.likedAccommodations.includes(accommodationId)) {
      user.likedAccommodations.push(accommodationId)
      await user.save()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[LIKE_ERROR]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Handle removing a liked accommodation
export async function DELETE(req: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { accommodationId } = await req.json()

  if (!accommodationId) {
    return NextResponse.json({ error: 'Missing accommodationId' }, { status: 400 })
  }

  try {
    await dbConnect()

    // Remove the accommodation ID from the user's likedAccommodations array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { likedAccommodations: accommodationId } },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[UNLIKE_ERROR]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
