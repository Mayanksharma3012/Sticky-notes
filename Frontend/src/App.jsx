import { useEffect, useState } from 'react'
import './App.css'
import { Header } from './components/header'
import { Wall } from './components/wall'
import axios from 'axios'

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
      id: card.id || card._id?.toString() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      color: card.color || 'Cream',
      style: card.style || 'lined',
      timestamp:
        card.timestamp ||
        (card.createdAt ? new Date(card.createdAt).getTime() : Date.now()),
      tilt: card.tilt || card.tilts || getRandomTilt(),
    }))
}

function App() {
  const [cards, setCards] = useState([])

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/notes')
        const notes = normalizeCards(response.data || [])
        notes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        setCards(notes)
      } catch (error) {
        console.error('Failed to load notes:', error)
      }
    }

    loadNotes()
  }, [])

  const handleAddCard = async (newCard) => {
    const tiltValue = newCard.tilt || getRandomTilt()
    const cardToAdd = {
      ...newCard,
      tilt: tiltValue,
      tilts: tiltValue,
    }

    try {
      const response = await axios.post('http://localhost:3000/api/notes', cardToAdd)
      const savedNote = response.data
      const normalized = normalizeCards([savedNote])[0]
      setCards((prev) => [normalized, ...prev])
    } catch (error) {
      console.error('Failed to save note:', error)
      setCards((prev) => [cardToAdd, ...prev])
    }
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
        return sorted.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      }

      if (type === 'oldest') {
        return sorted.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
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
