import { useEffect, useState } from 'react'

export default function SellerOrders(){
  const [orders, setOrders] = useState([])
  useEffect(()=>{
    const raw = localStorage.getItem('orders:v1')
    if (raw) { try { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) setOrders(parsed) } catch {} }
  }, [])
  return (
    <div>
      <h2>Pesanan Masuk</h2>
      {orders.length === 0 ? <p>Belum ada pesanan.</p> : (
        <ul>
          {orders.map(o => (
            <li key={o.id}>Order #{o.id} - {new Date(o.createdAt).toLocaleString()} - Total: ${o.total.toFixed(2)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
