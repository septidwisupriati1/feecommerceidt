import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container">
      <h2>404</h2>
      <p>Halaman tidak ditemukan.</p>
      <Link className="btn" to="/">Kembali ke beranda</Link>
    </section>
  )
}
