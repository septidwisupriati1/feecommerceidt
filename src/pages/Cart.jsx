import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, total, updateQuantity, removeItem, clear } = useCart()

  if (items.length === 0) {
    return (
      <section className="container">
        <p>Keranjang belanja kosong.</p>
        <Link className="btn" to="/products">Mulai Belanja</Link>
      </section>
    )
  }

  return (
    <section className="container cart">
      <ul className="cart-list">
        {items.map(item => (
          <li key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} />
            <div className="cart-info">
              <h3>{item.title}</h3>
              <p>${item.price.toFixed(2)}</p>
              <div className="qty">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="btn btn-ghost" onClick={() => removeItem(item.id)}>Hapus</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <p style={{ fontSize: '1.1rem', margin: 0 }}>Jumlah: <strong>Rp {total.toLocaleString('id-ID')}</strong></p>
        <div className="actions">
          <button className="btn btn-ghost" onClick={clear}>Kosongkan</button>
          <Link className="btn" to="/checkout">Check-out</Link>
        </div>
      </div>
    </section>
  )
}
