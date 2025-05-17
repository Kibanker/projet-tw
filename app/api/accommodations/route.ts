// app/api/accommodations/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Accommodation from '@/lib/models/Accommodation'

export async function GET() {
  try {
    await dbConnect()
    const accommodations = await Accommodation.find({}).lean()

    const cleaned = accommodations.map(({ _id, ...rest }) => ({
      _id: _id.toString(),
      ...rest,
    }))

    return NextResponse.json(cleaned)
  } catch (error) {
    console.error('Error fetching accommodations:', error)
    return NextResponse.json({ error: 'Failed to fetch accommodations' }, { status: 500 })
  }
}
