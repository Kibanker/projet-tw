import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    await dbConnect()

    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const cookieStore = cookies()
    cookieStore.set('user_id', user._id.toString(), { httpOnly: true, path: '/' })
    cookieStore.set('user_name', user.name, { httpOnly: true, path: '/' })

    return NextResponse.json({ message: 'Logged in', user })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
