export default function SellerSold() {
  const soldProducts = [
    { id: 1, name: 'Sepatu Sneakers Putih', price: 450000, qty: 2, total: 900000, date: '22 Okt 2025', buyer: 'Ahmad Fauzi', status: 'Selesai' },
    { id: 2, name: 'Tas Ransel Laptop', price: 280000, qty: 1, total: 280000, date: '21 Okt 2025', buyer: 'Siti Nurhaliza', status: 'Selesai' },
    { id: 3, name: 'Jaket Denim Pria', price: 350000, qty: 3, total: 1050000, date: '20 Okt 2025', buyer: 'Budi Santoso', status: 'Selesai' },
    { id: 4, name: 'Celana Jeans Slim Fit', price: 220000, qty: 2, total: 440000, date: '19 Okt 2025', buyer: 'Dewi Lestari', status: 'Selesai' },
    { id: 5, name: 'Kemeja Flanel Kotak', price: 180000, qty: 1, total: 180000, date: '18 Okt 2025', buyer: 'Eko Prasetyo', status: 'Selesai' },
  ]

  const totalRevenue = soldProducts.reduce((sum, p) => sum + p.total, 0)
  const totalItems = soldProducts.reduce((sum, p) => sum + p.qty, 0)

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Produk Terjual</h1>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '.5rem' }}>Total Produk Terjual</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{soldProducts.length}</div>
        </div>

        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '.5rem' }}>Total Item Terjual</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#16a34a' }}>{totalItems}</div>
        </div>

        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '.5rem' }}>Total Pendapatan</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0891b2' }}>
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Sold Products Table */}
      <div style={{
        background: 'var(--surface-strong)',
        border: '1px solid var(--border)',
        borderRadius: '.8rem',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        overflowX: 'auto'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Riwayat Penjualan</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '.75rem', textAlign: 'left', color: 'var(--muted)', fontWeight: 600 }}>Tanggal</th>
              <th style={{ padding: '.75rem', textAlign: 'left', color: 'var(--muted)', fontWeight: 600 }}>Produk</th>
              <th style={{ padding: '.75rem', textAlign: 'left', color: 'var(--muted)', fontWeight: 600 }}>Pembeli</th>
              <th style={{ padding: '.75rem', textAlign: 'center', color: 'var(--muted)', fontWeight: 600 }}>Qty</th>
              <th style={{ padding: '.75rem', textAlign: 'right', color: 'var(--muted)', fontWeight: 600 }}>Harga</th>
              <th style={{ padding: '.75rem', textAlign: 'right', color: 'var(--muted)', fontWeight: 600 }}>Total</th>
              <th style={{ padding: '.75rem', textAlign: 'center', color: 'var(--muted)', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {soldProducts.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '.75rem', fontSize: '.9rem' }}>{product.date}</td>
                <td style={{ padding: '.75rem', fontWeight: 600 }}>{product.name}</td>
                <td style={{ padding: '.75rem', fontSize: '.9rem' }}>{product.buyer}</td>
                <td style={{ padding: '.75rem', textAlign: 'center', fontSize: '.9rem' }}>{product.qty}</td>
                <td style={{ padding: '.75rem', textAlign: 'right', fontSize: '.9rem' }}>
                  Rp {product.price.toLocaleString('id-ID')}
                </td>
                <td style={{ padding: '.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>
                  Rp {product.total.toLocaleString('id-ID')}
                </td>
                <td style={{ padding: '.75rem', textAlign: 'center' }}>
                  <span style={{
                    padding: '.25rem .75rem',
                    borderRadius: '999px',
                    background: '#dcfce7',
                    color: '#16a34a',
                    fontSize: '.85rem',
                    fontWeight: 600
                  }}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
