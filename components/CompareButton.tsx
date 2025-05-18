'use client'

import { useEffect, useState } from 'react'

type CompareButtonProps = {
  accommodationId: string
}

export default function CompareButton({ accommodationId }: CompareButtonProps) {
  const [isInCompare, setIsInCompare] = useState(false)
  
  // Vérifier si ce logement est déjà dans la liste de comparaison
  useEffect(() => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]')
    setIsInCompare(compareList.includes(accommodationId))
  }, [accommodationId])
  
  const toggleCompare = () => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]')
    
    if (isInCompare) {
      // Retirer de la liste
      const newList = compareList.filter((id: string) => id !== accommodationId)
      localStorage.setItem('compareList', JSON.stringify(newList))
      setIsInCompare(false)
    } else {
      // Ajouter à la liste (max 4)
      if (compareList.length < 4) {
        compareList.push(accommodationId)
        localStorage.setItem('compareList', JSON.stringify(compareList))
        setIsInCompare(true)
      } else {
        alert('Vous ne pouvez comparer que 4 logements maximum')
      }
    }
  }
  
  return (
    <button
      onClick={toggleCompare}
      className={`px-4 py-2 rounded-lg ${isInCompare ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-500 hover:bg-gray-600'} text-white transition-colors`}
    >
      {isInCompare ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
    </button>
  )
}
