export default function SellerTerms() {
  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Syarat dan Ketentuan Seller</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Terakhir diperbarui: 24 Oktober 2025
      </p>

      <div style={{
        background: 'var(--surface-strong)',
        border: '1px solid var(--border)',
        borderRadius: '.8rem',
        padding: '2rem',
        boxShadow: 'var(--shadow)'
      }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>1. Persyaratan Menjadi Seller</h2>
          <ul style={{ lineHeight: 1.8, color: 'var(--text)' }}>
            <li>Berusia minimal 18 tahun atau memiliki izin dari orang tua/wali</li>
            <li>Memiliki KTP/identitas yang valid</li>
            <li>Memiliki rekening bank atas nama sendiri</li>
            <li>Menyetujui seluruh syarat dan ketentuan yang berlaku</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>2. Kewajiban Seller</h2>
          <ul style={{ lineHeight: 1.8, color: 'var(--text)' }}>
            <li>Memberikan informasi produk yang akurat dan jujur</li>
            <li>Memastikan kualitas produk sesuai dengan deskripsi</li>
            <li>Melakukan pengiriman tepat waktu (maksimal 2 hari kerja setelah pembayaran)</li>
            <li>Merespons pertanyaan pembeli dengan cepat dan profesional</li>
            <li>Tidak menjual barang ilegal, berbahaya, atau melanggar hukum</li>
            <li>Menjaga reputasi toko dengan memberikan pelayanan terbaik</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>3. Biaya dan Komisi</h2>
          <div style={{
            background: '#f0f7ff',
            border: '1px solid #d1e3ff',
            borderRadius: '.6rem',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '.75rem', fontSize: '1rem' }}>Struktur Biaya:</h3>
            <ul style={{ margin: 0, lineHeight: 1.8 }}>
              <li>Komisi platform: <strong>5%</strong> dari setiap transaksi</li>
              <li>Biaya payment gateway: <strong>2%</strong> + Rp 1.000</li>
              <li>Gratis biaya listing produk</li>
              <li>Minimum penarikan saldo: <strong>Rp 50.000</strong></li>
            </ul>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
            * Biaya dapat berubah sewaktu-waktu dengan pemberitahuan terlebih dahulu
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>4. Pencairan Dana</h2>
          <ul style={{ lineHeight: 1.8, color: 'var(--text)' }}>
            <li>Dana akan masuk ke saldo seller setelah pembeli menerima barang (7 hari otomatis)</li>
            <li>Penarikan saldo dapat dilakukan setiap hari</li>
            <li>Proses pencairan ke rekening bank maksimal 1x24 jam (hari kerja)</li>
            <li>Minimum penarikan: Rp 50.000</li>
            <li>Maksimum penarikan per hari: Rp 50.000.000</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>5. Pengembalian dan Komplain</h2>
          <ul style={{ lineHeight: 1.8, color: 'var(--text)' }}>
            <li>Seller wajib menerima pengembalian jika produk cacat/tidak sesuai</li>
            <li>Biaya pengembalian ditanggung seller jika kesalahan dari pihak seller</li>
            <li>Refund akan diproses maksimal 3 hari kerja setelah barang diterima kembali</li>
            <li>Komplain harus ditanggapi maksimal 1x24 jam</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>6. Larangan</h2>
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '.6rem',
            padding: '1.5rem'
          }}>
            <p style={{ margin: 0, marginBottom: '.75rem', fontWeight: 600 }}>Seller dilarang untuk:</p>
            <ul style={{ margin: 0, lineHeight: 1.8 }}>
              <li>Melakukan transaksi di luar platform</li>
              <li>Meminta pembeli memberikan rating/review positif palsu</li>
              <li>Menjual produk replika/KW/palsu</li>
              <li>Melakukan diskriminasi terhadap pembeli</li>
              <li>Memberikan informasi kontak untuk transaksi langsung</li>
              <li>Menggunakan akun lebih dari satu untuk produk yang sama</li>
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>7. Sanksi Pelanggaran</h2>
          <ul style={{ lineHeight: 1.8, color: 'var(--text)' }}>
            <li><strong>Peringatan:</strong> Untuk pelanggaran ringan pertama kali</li>
            <li><strong>Suspend 7-30 hari:</strong> Untuk pelanggaran berulang atau sedang</li>
            <li><strong>Banned permanen:</strong> Untuk pelanggaran berat atau kriminal</li>
            <li><strong>Saldo ditahan:</strong> Jika terbukti melakukan kecurangan</li>
          </ul>
        </section>

        <section>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>8. Perubahan Ketentuan</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
            TalentHub berhak mengubah syarat dan ketentuan ini sewaktu-waktu. 
            Perubahan akan diberitahukan melalui email dan notifikasi di dashboard seller.
            Dengan tetap menggunakan layanan setelah perubahan, seller dianggap menyetujui 
            syarat dan ketentuan yang baru.
          </p>
        </section>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '.6rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            Jika ada pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi:
          </p>
          <p style={{ margin: '.5rem 0 0', fontWeight: 600, color: 'var(--primary)' }}>
            support@talenthub.com
          </p>
        </div>
      </div>
    </div>
  )
}
