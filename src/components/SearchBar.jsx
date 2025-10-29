import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')

  useEffect(() => {
    setQ(params.get('q') || '')
    setCat(params.get('cat') || '')
  }, [params])

  const submit = (e) => {
    e.preventDefault()
    const search = new URLSearchParams()
    if (q) search.set('q', q)
    if (cat) search.set('cat', cat)
    navigate(`/products?${search.toString()}`)
  }

  return (
    <form className="searchbar" onSubmit={submit} style={compact ? {gridTemplateColumns:'1fr auto'} : undefined}>
      <input placeholder="Cari produk..." value={q} onChange={e=>setQ(e.target.value)} />
      {!compact && (
        <select value={cat} onChange={e=>setCat(e.target.value)}>
          <option value="">Semua Kategori</option>
          <option value="Fashion">Fashion</option>
          <option value="Aksesoris">Aksesoris</option>
          <option value="Elektronik">Elektronik</option>
        </select>
      )}
      <button className="btn" type="submit">Cari</button>
    </form>
  )
}
