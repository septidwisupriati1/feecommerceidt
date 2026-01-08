import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const [status, setStatus] = useState('idle')
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
    shipping: 'JNE Regular',
  })

  const next = () => setStep(s => Math.min(2, s + 1))
  const back = () => setStep(s => Math.max(0, s - 1))

  const submit = (e) => {
    e.preventDefault()
    setStatus('processing')
    setTimeout(() => {
      const customer = {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.province} ${form.postalCode}`,
        notes: form.notes,
        shipping: form.shipping,
      }
      const raw = localStorage.getItem('orders:v1')
      let list = []
      if (raw) { try { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) list = parsed } catch {} }
      const id = (list.at(-1)?.id || 0) + 1
      const order = { id, items, total, customer, createdAt: Date.now() }
      list.push(order)
      localStorage.setItem('orders:v1', JSON.stringify(list))

      setStatus('success')
      clear()
    }, 1000)
  }

  if (items.length === 0 && status !== 'success') {
    return (
      <section className="container">
        <h3>Keranjang kosong</h3>
        <p>Tambahkan produk terlebih dahulu sebelum checkout.</p>
      </section>
    )
  }

  if (status === 'success') {
    return (
      <section className="container">
        <h2>Terima kasih!</h2>
        <p>Pesanan kamu sedang diproses.</p>
      </section>
    )
  }

  return (
    <section className="container">
      <div className="wizard-overlay">
        <div className="wizard">
          <div className="wizard-header">
            <div className="wizard-title">Checkout</div>
            <ol className="stepper">
              <li className={`step ${step>=0?'active':''}`}><span>Data Diri</span></li>
              <li className={`step ${step>=1?'active':''}`}><span>Alamat Penerima</span></li>
              <li className={`step ${step>=2?'active':''}`}><span>Ringkasan</span></li>
            </ol>
          </div>
          <form onSubmit={submit}>
            <div className="wizard-body">
              {step === 0 && (
                <div className="fields">
                  <div className="field-col"><label>Nama Lengkap</label><input required value={form.fullName} onChange={e=>setForm(f=>({...f, fullName:e.target.value}))} /></div>
                  <div className="field-col"><label>Nomor Ponsel</label><input required value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} /></div>
                  <div className="field-col"><label>Email</label><input required type="email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} /></div>
                </div>
              )}
              {step === 1 && (
                <div className="fields">
                  <div className="field-col full"><label>Alamat</label><input required value={form.address} onChange={e=>setForm(f=>({...f, address:e.target.value}))} /></div>
                  <div className="field-col"><label>Kota/Kecamatan</label><input required value={form.city} onChange={e=>setForm(f=>({...f, city:e.target.value}))} /></div>
                  <div className="field-col"><label>Provinsi</label><input required value={form.province} onChange={e=>setForm(f=>({...f, province:e.target.value}))} /></div>
                  <div className="field-col"><label>Kode Pos</label><input required value={form.postalCode} onChange={e=>setForm(f=>({...f, postalCode:e.target.value}))} /></div>
                  <div className="field-col full"><label>Catatan</label><input value={form.notes} onChange={e=>setForm(f=>({...f, notes:e.target.value}))} /></div>
                </div>
              )}
              {step === 2 && (
                <div className="fields">
                  <div className="field-col full"><label>Metode Pengiriman</label>
                    <select value={form.shipping} onChange={e=>setForm(f=>({...f, shipping:e.target.value}))}>
                      <option>JNE Regular</option>
                      <option>SiCepat Reg</option>
                      <option>AnterAja</option>
                    </select>
                  </div>
                  <div className="summary">
                    <div className="summary-title">Ringkasan Pesanan</div>
                    <ul>
                      {items.map(i => (
                        <li key={i.id}>{i.title} x {i.quantity} — ${ (i.quantity * i.price).toFixed(2) }</li>
                      ))}
                    </ul>
                    <div className="summary-total">Total: <strong>${total.toFixed(2)}</strong></div>
                  </div>
                </div>
              )}
            </div>
            <div className="wizard-actions">
              {step>0 && <button type="button" className="btn btn-ghost cursor-pointer" onClick={back}>Kembali</button>}
              {step<2 && <button type="button" className="btn" onClick={next}>Lanjut</button>}
              {step===2 && (
                <button className="btn cursor-pointer" disabled={status==='processing'}>
                  {status==='processing' ? 'Memproses...' : 'Bayar Sekarang'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
