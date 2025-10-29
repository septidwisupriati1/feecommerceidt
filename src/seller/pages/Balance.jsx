export default function SellerBalance() {
  const balanceData = {
    available: 2850000,
    pending: 1180000,
    withdrawn: 5420000,
    total: 9450000
  }

  const transactions = [
    { id: 1, type: 'income', desc: 'Penjualan Sepatu Sneakers Putih', amount: 900000, date: '22 Okt 2025', status: 'Tersedia' },
    { id: 2, type: 'income', desc: 'Penjualan Tas Ransel Laptop', amount: 280000, date: '21 Okt 2025', status: 'Tersedia' },
    { id: 3, type: 'withdraw', desc: 'Penarikan ke Bank BCA', amount: -500000, date: '20 Okt 2025', status: 'Berhasil' },
    { id: 4, type: 'income', desc: 'Penjualan Jaket Denim Pria', amount: 1050000, date: '20 Okt 2025', status: 'Pending' },
    { id: 5, type: 'income', desc: 'Penjualan Celana Jeans Slim Fit', amount: 440000, date: '19 Okt 2025', status: 'Tersedia' },
    { id: 6, type: 'withdraw', desc: 'Penarikan ke Bank Mandiri', amount: -750000, date: '18 Okt 2025', status: 'Berhasil' },
    { id: 7, type: 'income', desc: 'Penjualan Kemeja Flanel Kotak', amount: 180000, date: '18 Okt 2025', status: 'Tersedia' },
  ]

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Saldo Penjualan</h1>
        <button className="btn" style={{ gap: '.5rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
          Tarik Saldo
        </button>
      </div>

      {/* Balance Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: '0 8px 20px rgba(59, 130, 246, .25)',
          color: '#fff'
        }}>
          <div style={{ fontSize: '.9rem', marginBottom: '.5rem', opacity: .9 }}>Saldo Tersedia</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>
            Rp {balanceData.available.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '.85rem', marginTop: '.5rem', opacity: .8 }}>Dapat ditarik</div>
        </div>

        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '.5rem' }}>Saldo Pending</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
            Rp {balanceData.pending.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '.85rem', marginTop: '.5rem', color: 'var(--muted)' }}>Menunggu verifikasi</div>
        </div>

        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '.5rem' }}>Total Ditarik</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#16a34a' }}>
            Rp {balanceData.withdrawn.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '.85rem', marginTop: '.5rem', color: 'var(--muted)' }}>Riwayat penarikan</div>
        </div>

        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '.5rem' }}>Total Pendapatan</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
            Rp {balanceData.total.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '.85rem', marginTop: '.5rem', color: 'var(--muted)' }}>Akumulasi penjualan</div>
        </div>
      </div>

      {/* Transactions */}
      <div style={{
        background: 'var(--surface-strong)',
        border: '1px solid var(--border)',
        borderRadius: '.8rem',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Riwayat Transaksi</h2>
        
        <div style={{ display: 'grid', gap: '.75rem' }}>
          {transactions.map(tx => (
            <div key={tx.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: tx.type === 'income' ? '#dcfce7' : '#fee2e2',
                  color: tx.type === 'income' ? '#16a34a' : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {tx.type === 'income' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0 6.75-6.75M12 19.5l-6.75-6.75" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0-6.75 6.75M12 4.5l6.75 6.75" />
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{tx.desc}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.25rem' }}>{tx.date}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 700,
                  color: tx.type === 'income' ? '#16a34a' : '#ef4444'
                }}>
                  {tx.amount >= 0 ? '+' : ''}Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                </div>
                <div style={{
                  fontSize: '.85rem',
                  color: tx.status === 'Tersedia' ? '#16a34a' : tx.status === 'Pending' ? '#f59e0b' : 'var(--muted)',
                  marginTop: '.25rem'
                }}>
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
