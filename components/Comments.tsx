'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Comment = {
  id: string
  userId: string
  userName: string
  text: string
  createdAt: string
}

type CommentsProps = {
  accommodationId: string
}

export default function Comments({ accommodationId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Charger les commentaires
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/comments?accommodationId=${accommodationId}`)
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des commentaires')
        }
        const data = await response.json()
        setComments(data)
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les commentaires. Veuillez réessayer plus tard.')
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [accommodationId])

  // Vérifier si l'utilisateur est connecté
  const [userInfo, setUserInfo] = useState<{ name?: string, lastName?: string } | null>(null)
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/user/current')
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUserInfo(data.user)
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error)
      }
    }
    
    checkUser()
  }, [])
  
  // Ajouter un commentaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return
    
    try {
      setIsSubmitting(true)
      
      // Utiliser le nom de l'utilisateur connecté ou proposer de se connecter/commenter anonymement
      let userName
      
      if (userInfo?.name && userInfo?.lastName) {
        // Utiliser le nom complet de l'utilisateur connecté
        userName = `${userInfo.name} ${userInfo.lastName}`
      } else {
        // Proposer à l'utilisateur de se connecter ou de commenter anonymement
        const choice = confirm('Vous n\'êtes pas connecté. Souhaitez-vous vous connecter pour commenter avec votre nom ? Cliquez sur OK pour vous connecter ou sur Annuler pour commenter anonymement.')
        
        if (choice) {
          // Rediriger vers la page de connexion
          router.push('/login')
          setIsSubmitting(false)
          return
        } else {
          // Utiliser "Anonyme" comme nom d'utilisateur
          userName = 'Anonyme'
        }
      }
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accommodationId,
          text: newComment,
          userName
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de l\'ajout du commentaire')
      }
      
      const data = await response.json()
      
      // Ajouter le nouveau commentaire à la liste
      setComments([data.comment, ...comments])
      setNewComment('')
    } catch (err) {
      console.error('Erreur:', err)
      setError('Impossible d\'ajouter le commentaire. Veuillez réessayer plus tard.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Commentaires</h2>
      
      {/* Formulaire pour ajouter un commentaire */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Laissez un commentaire..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className={`cursor-pointer self-end px-4 py-2 rounded-md text-white ${
              isSubmitting || !newComment.trim()
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Publier'}
          </button>
        </div>
      </form>
      
      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Liste des commentaires */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div className="font-semibold">{comment.userName}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
              <div className="mt-2 text-gray-700">{comment.text}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </div>
      )}
    </div>
  )
}
