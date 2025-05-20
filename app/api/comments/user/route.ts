// app/api/comments/user/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Comment from '@/models/Comment'
import { cookies } from 'next/headers'

// Récupérer tous les commentaires de l'utilisateur connecté
export async function GET() {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value
    
    if (!userId) {
      return NextResponse.json(
        { error: 'You must be logged in to view your comments' },
        { status: 401 }
      )
    }
    
    await dbConnect()
    
    // Récupérer les commentaires de l'utilisateur triés par date (les plus récents d'abord)
    const comments = await Comment.find({ userId })
      .sort({ createdAt: -1 })
      .lean()
    
    // Convertir les _id en strings pour éviter les problèmes de sérialisation
    const cleanedComments = comments.map((comment) => ({
      id: comment._id.toString(),
      accommodationId: comment.accommodationId,
      userId: comment.userId,
      userName: comment.userName,
      text: comment.text,
      createdAt: comment.createdAt
    }))
    
    return NextResponse.json(cleanedComments)
  } catch (error) {
    console.error('Error fetching user comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user comments' },
      { status: 500 }
    )
  }
}
