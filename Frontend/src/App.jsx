import { useEffect, useState } from 'react'
import './App.css'
import { Header } from './components/header'
import { Wall } from './components/wall'

const STORAGE_KEY = 'sticky-notes'

function getRandomTilt() {
  const tilts = ['tilt-left', 'tilt-right', 'tilt-normal']
  return tilts[Math.floor(Math.random() * tilts.length)]
}

function normalizeCards(rawCards) {
  if (!Array.isArray(rawCards)) return []

  return rawCards
    .filter((card) => card && typeof card.text === 'string' && card.text.trim())
    .map((card) => ({
      ...card,
      color: card.color || 'Cream',
      style: card.style || 'lined',
      timestamp: card.timestamp || Date.now(),
      tilt: card.tilt || getRandomTilt(),
    }))
}

function App() {
  const [cards, setCards] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []

      const parsed = JSON.parse(stored)
      return normalizeCards(parsed)
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
  }, [cards])

  const handleAddCard = (newCard) => {
    const cardToAdd = {
      ...newCard,
      id: newCard.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      timestamp: newCard.timestamp || Date.now(),
      tilt: newCard.tilt || getRandomTilt(),
    }

    setCards((prev) => [cardToAdd, ...prev])
  }

  const handleSort = (type) => {
    setCards((prev) => {
      const sorted = [...prev]

      if (type === 'random') {
        for (let i = sorted.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[sorted[i], sorted[j]] = [sorted[j], sorted[i]]
        }
        return sorted
      }

      if (type === 'newest') {
        sorted.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      }

      if (type === 'oldest') {
        sorted.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
      }

      return sorted
    })
  }

  return (
    <>
      <Header
        notesCount={cards.length}
        onRandom={() => handleSort('random')}
        onNewest={() => handleSort('newest')}
        onOldest={() => handleSort('oldest')}
      />
      <Wall cards={cards} onAddCard={handleAddCard} />
    </>
  )
}

export default App
