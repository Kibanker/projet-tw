// app/api/comments/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Comment from '@/models/Comment'
import { cookies } from 'next/headers'

// Récupérer tous les commentaires pour un appartement spécifique
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const accommodationId = searchParams.get('accommodationId')
    
    if (!accommodationId) {
      return NextResponse.json(
        { error: 'Accommodation ID is required' },
        { status: 400 }
      )
    }
    
    await dbConnect()
    
    // Récupérer les commentaires triés par date (les plus récents d'abord)
    const comments = await Comment.find({ accommodationId })
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
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// Ajouter un nouveau commentaire
export async function POST(request: Request) {
  try {
    const { accommodationId, text, userName } = await request.json()
    
    // Vérification des champs requis
    if (!accommodationId || !text || !userName) {
      return NextResponse.json(
        { error: 'Accommodation ID, text, and userName are required' },
        { status: 400 }
      )
    }
    
    // Récupérer l'ID utilisateur depuis les cookies (si disponible)
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value || 'anonymous'
    
    await dbConnect()
    
    // Créer le commentaire
    const newComment = await Comment.create({
      accommodationId,
      userId,
      userName,
      text,
      createdAt: new Date()
    })
    
    return NextResponse.json(
      { 
        comment: {
          id: newComment._id.toString(),
          accommodationId: newComment.accommodationId,
          userId: newComment.userId,
          userName: newComment.userName,
          text: newComment.text,
          createdAt: newComment.createdAt
        } 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
