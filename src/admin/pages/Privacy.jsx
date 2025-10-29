import { ShieldCheckIcon, PencilIcon } from '@heroicons/react/24/outline'

export default function AdminPrivacy() {
  return (
    <div className="seller-products-page">
      <div className="products-header">
        <h1>Kebijakan Privasi</h1>
        <button className="btn btn-primary">
          <PencilIcon style={{ width: '18px', height: '18px' }} />
          Edit
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '2rem', marginTop: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheckIcon style={{ width: '28px', height: '28px', color: '#ffffff' }} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>Kebijakan Privasi</h2>
            <p style={{ margin: '.25rem 0 0 0', color: '#6b7280', fontSize: '.95rem' }}>Terakhir diperbarui: 28 Oktober 2025</p>
          </div>
        </div>

        <div style={{ lineHeight: '1.8', color: '#374151' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>1. Pendahuluan</h3>
            <p style={{ marginBottom: '1rem' }}>
              TalentHub berkomitmen untuk melindungi privasi pengguna kami. Kebijakan Privasi ini menjelaskan 
              bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>2. Informasi yang Kami Kumpulkan</h3>
            <p style={{ marginBottom: '.75rem', fontWeight: 600 }}>a. Informasi Pribadi:</p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Nama lengkap</li>
              <li style={{ marginBottom: '.5rem' }}>Alamat email</li>
              <li style={{ marginBottom: '.5rem' }}>Nomor telepon</li>
              <li style={{ marginBottom: '.5rem' }}>Alamat pengiriman dan penagihan</li>
            </ul>

            <p style={{ marginBottom: '.75rem', fontWeight: 600 }}>b. Informasi Transaksi:</p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Riwayat pembelian</li>
              <li style={{ marginBottom: '.5rem' }}>Metode pembayaran</li>
              <li style={{ marginBottom: '.5rem' }}>Detail pengiriman</li>
            </ul>

            <p style={{ marginBottom: '.75rem', fontWeight: 600 }}>c. Informasi Teknis:</p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Alamat IP</li>
              <li style={{ marginBottom: '.5rem' }}>Jenis browser</li>
              <li style={{ marginBottom: '.5rem' }}>Cookie dan data pelacakan</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>3. Bagaimana Kami Menggunakan Informasi Anda</h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Memproses dan mengirimkan pesanan Anda</li>
              <li style={{ marginBottom: '.5rem' }}>Berkomunikasi tentang pesanan dan layanan</li>
              <li style={{ marginBottom: '.5rem' }}>Meningkatkan pengalaman pengguna</li>
              <li style={{ marginBottom: '.5rem' }}>Mengirimkan penawaran dan promosi (dengan izin)</li>
              <li style={{ marginBottom: '.5rem' }}>Mencegah penipuan dan kegiatan ilegal</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>4. Berbagi Informasi</h3>
            <p style={{ marginBottom: '1rem' }}>
              Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya berbagi 
              informasi dalam situasi berikut:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Dengan seller untuk memproses pesanan Anda</li>
              <li style={{ marginBottom: '.5rem' }}>Dengan penyedia layanan pengiriman</li>
              <li style={{ marginBottom: '.5rem' }}>Dengan penyedia layanan pembayaran</li>
              <li style={{ marginBottom: '.5rem' }}>Ketika diwajibkan oleh hukum</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>5. Keamanan Data</h3>
            <p style={{ marginBottom: '1rem' }}>
              Kami menggunakan langkah-langkah keamanan teknis dan organisasi untuk melindungi data Anda:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Enkripsi SSL untuk semua transaksi</li>
              <li style={{ marginBottom: '.5rem' }}>Sistem keamanan firewall</li>
              <li style={{ marginBottom: '.5rem' }}>Akses terbatas ke data pribadi</li>
              <li style={{ marginBottom: '.5rem' }}>Audit keamanan berkala</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>6. Cookie</h3>
            <p style={{ marginBottom: '1rem' }}>
              Kami menggunakan cookie untuk meningkatkan pengalaman browsing Anda. Cookie membantu kami:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Mengingat preferensi Anda</li>
              <li style={{ marginBottom: '.5rem' }}>Menganalisis traffic website</li>
              <li style={{ marginBottom: '.5rem' }}>Memberikan konten yang relevan</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>
              Anda dapat mengatur browser untuk menolak cookie, namun beberapa fitur mungkin tidak berfungsi dengan baik.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>7. Hak Anda</h3>
            <p style={{ marginBottom: '1rem' }}>Anda memiliki hak untuk:</p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '.5rem' }}>Mengakses data pribadi Anda</li>
              <li style={{ marginBottom: '.5rem' }}>Memperbarui informasi yang tidak akurat</li>
              <li style={{ marginBottom: '.5rem' }}>Menghapus akun dan data Anda</li>
              <li style={{ marginBottom: '.5rem' }}>Menolak penggunaan data untuk marketing</li>
              <li style={{ marginBottom: '.5rem' }}>Meminta salinan data Anda</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>8. Penyimpanan Data</h3>
            <p style={{ marginBottom: '1rem' }}>
              Kami menyimpan data pribadi Anda selama akun Anda aktif atau sepanjang diperlukan untuk memberikan 
              layanan. Setelah akun dihapus, data akan dihapus dalam waktu 90 hari, kecuali diwajibkan oleh hukum 
              untuk disimpan lebih lama.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>9. Perubahan Kebijakan</h3>
            <p style={{ marginBottom: '1rem' }}>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman 
              ini dengan tanggal "Terakhir diperbarui" yang baru. Kami mendorong Anda untuk meninjau kebijakan ini 
              secara berkala.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>10. Hubungi Kami</h3>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak Anda, 
              silakan hubungi kami:<br />
              Email: privacy@talenthub.com<br />
              Telepon: +62 21 1234 5678<br />
              Alamat: Solo Techno Park, Surakarta, Jawa Tengah
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
