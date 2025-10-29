import { DocumentTextIcon, PencilIcon } from '@heroicons/react/24/outline'

export default function AdminTerms() {
  return (
    <div className="seller-products-page">
      <div className="products-header">
        <h1>Syarat & Ketentuan</h1>
        <button className="btn btn-primary">
          <PencilIcon style={{ width: '18px', height: '18px' }} />
          Edit
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '2rem', marginTop: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DocumentTextIcon style={{ width: '28px', height: '28px', color: '#ffffff' }} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>Syarat & Ketentuan</h2>
            <p style={{ margin: '.25rem 0 0 0', color: '#6b7280', fontSize: '.95rem' }}>Terakhir diperbarui: 28 Oktober 2025</p>
          </div>
        </div>

        <div style={{ lineHeight: '1.8', color: '#374151' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>1. Pendahuluan</h3>
            <p style={{ marginBottom: '1rem' }}>
              Selamat datang di TalentHub. Syarat dan ketentuan ini mengatur penggunaan platform e-commerce kami. 
              Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat dengan syarat dan ketentuan berikut.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>2. Akun Pengguna</h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Pengguna harus berusia minimal 18 tahun untuk membuat akun</li>
              <li style={{ marginBottom: '.5rem' }}>Informasi yang diberikan harus akurat dan terkini</li>
              <li style={{ marginBottom: '.5rem' }}>Pengguna bertanggung jawab atas keamanan akun mereka</li>
              <li style={{ marginBottom: '.5rem' }}>Dilarang berbagi akun dengan pihak lain</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>3. Transaksi & Pembayaran</h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Semua transaksi dilakukan dalam Rupiah (IDR)</li>
              <li style={{ marginBottom: '.5rem' }}>Pembayaran harus dilakukan dalam waktu yang ditentukan</li>
              <li style={{ marginBottom: '.5rem' }}>Harga produk dapat berubah sewaktu-waktu</li>
              <li style={{ marginBottom: '.5rem' }}>Biaya pengiriman ditanggung oleh pembeli</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>4. Pengembalian & Penukaran</h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Pengembalian dapat dilakukan dalam 7 hari setelah penerimaan</li>
              <li style={{ marginBottom: '.5rem' }}>Produk harus dalam kondisi asli dan belum digunakan</li>
              <li style={{ marginBottom: '.5rem' }}>Biaya pengembalian ditanggung oleh pembeli (kecuali produk cacat)</li>
              <li style={{ marginBottom: '.5rem' }}>Pengembalian dana diproses dalam 7-14 hari kerja</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>5. Kewajiban Seller</h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Menyediakan deskripsi produk yang akurat</li>
              <li style={{ marginBottom: '.5rem' }}>Memproses pesanan dalam waktu yang wajar</li>
              <li style={{ marginBottom: '.5rem' }}>Menjaga kualitas produk yang dijual</li>
              <li style={{ marginBottom: '.5rem' }}>Menanggapi pertanyaan pelanggan dengan cepat</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>6. Larangan</h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Menjual barang ilegal atau yang melanggar hukum</li>
              <li style={{ marginBottom: '.5rem' }}>Melakukan penipuan atau praktik tidak etis</li>
              <li style={{ marginBottom: '.5rem' }}>Menggunakan platform untuk spam atau phishing</li>
              <li style={{ marginBottom: '.5rem' }}>Melanggar hak kekayaan intelektual pihak lain</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>7. Penangguhan & Pemutusan Akun</h3>
            <p style={{ marginBottom: '1rem' }}>
              TalentHub berhak untuk menangguhkan atau menghentikan akun pengguna yang melanggar syarat dan ketentuan ini 
              tanpa pemberitahuan sebelumnya. Pengguna yang akunnya ditangguhkan tidak berhak atas kompensasi.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>8. Perubahan Syarat & Ketentuan</h3>
            <p style={{ marginBottom: '1rem' }}>
              TalentHub dapat mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui 
              platform dan pengguna dianggap telah menyetujui perubahan tersebut jika terus menggunakan layanan.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>9. Kontak</h3>
            <p>
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami di:<br />
              Email: support@talenthub.com<br />
              Telepon: +62 21 1234 5678
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
