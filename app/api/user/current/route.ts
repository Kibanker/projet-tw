import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value
    
    if (!userId) {
      return NextResponse.json({ user: null })
    }
    
    await dbConnect()
    
    const user = await User.findById(userId).select('name lastName email').lean()
    
    if (!user) {
      return NextResponse.json({ user: null })
    }
    
    return NextResponse.json({ 
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json({ user: null })
  }
}
