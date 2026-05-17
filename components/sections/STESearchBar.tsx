'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function STESearchBar() {
  const [q, setQ] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) router.push(`/ste?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <form onSubmit={handleSearch} className="ste-home-search">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="STE Yayınlarında Ara..."
        aria-label="STE Yayınlarında Ara"
      />
      <button type="submit" aria-label="Ara">🔍</button>
    </form>
  )
}
