import { useState } from 'react'

export default function SellerFAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: 'Umum',
      questions: [
        {
          q: 'Bagaimana cara menjadi seller di TalentHub?',
          a: 'Anda dapat mendaftar sebagai seller melalui halaman registrasi seller. Isi formulir pendaftaran, upload dokumen yang diperlukan (KTP, NPWP jika ada), dan tunggu verifikasi dari tim kami (maksimal 2x24 jam).'
        },
        {
          q: 'Apakah ada biaya untuk membuka toko?',
          a: 'Tidak ada biaya pendaftaran. TalentHub hanya mengenakan komisi 5% dari setiap transaksi yang berhasil dan biaya payment gateway 2% + Rp 1.000.'
        },
        {
          q: 'Berapa lama proses verifikasi seller?',
          a: 'Proses verifikasi akun seller biasanya memakan waktu 1-2 hari kerja. Anda akan mendapat notifikasi melalui email setelah akun diverifikasi.'
        }
      ]
    },
    {
      category: 'Produk',
      questions: [
        {
          q: 'Berapa maksimal produk yang bisa saya upload?',
          a: 'Tidak ada batasan jumlah produk yang dapat diupload. Namun, pastikan setiap produk memiliki foto berkualitas baik dan deskripsi yang lengkap.'
        },
        {
          q: 'Bagaimana cara mengedit atau menghapus produk?',
          a: 'Masuk ke halaman "Produk Saya", klik produk yang ingin diedit/hapus, lalu pilih opsi Edit atau Hapus. Perubahan akan langsung diterapkan.'
        },
        {
          q: 'Apakah saya bisa menjual produk pre-order?',
          a: 'Ya, Anda dapat menjual produk pre-order. Pastikan untuk mencantumkan estimasi waktu pengiriman dengan jelas di deskripsi produk.'
        }
      ]
    },
    {
      category: 'Pembayaran & Saldo',
      questions: [
        {
          q: 'Kapan dana dari penjualan masuk ke saldo saya?',
          a: 'Dana akan masuk ke saldo seller setelah pembeli menerima barang atau setelah 7 hari otomatis jika tidak ada komplain.'
        },
        {
          q: 'Bagaimana cara menarik saldo?',
          a: 'Klik menu "Saldo Penjualan", lalu pilih "Tarik Saldo". Masukkan nominal yang ingin ditarik (min. Rp 50.000). Dana akan masuk ke rekening dalam 1x24 jam.'
        },
        {
          q: 'Berapa komisi yang dikenakan?',
          a: 'TalentHub mengenakan komisi 5% dari total transaksi + biaya payment gateway 2% + Rp 1.000 per transaksi.'
        },
        {
          q: 'Apakah ada biaya penarikan saldo?',
          a: 'Tidak ada biaya tambahan untuk penarikan saldo. Namun, pastikan saldo minimum Rp 50.000 untuk dapat melakukan penarikan.'
        }
      ]
    },
    {
      category: 'Pesanan & Pengiriman',
      questions: [
        {
          q: 'Berapa lama waktu maksimal untuk memproses pesanan?',
          a: 'Pesanan harus diproses dan dikirim maksimal 2 hari kerja setelah pembayaran dikonfirmasi. Keterlambatan dapat mempengaruhi rating toko.'
        },
        {
          q: 'Bagaimana jika pembeli komplain barang rusak/tidak sesuai?',
          a: 'Hubungi pembeli melalui fitur chat untuk klarifikasi. Jika memang kesalahan dari pihak seller, Anda wajib menerima retur dan melakukan refund atau pengiriman ulang.'
        },
        {
          q: 'Apakah saya bisa menggunakan jasa ekspedisi sendiri?',
          a: 'Saat ini TalentHub berintegrasi dengan beberapa ekspedisi resmi. Anda dapat memilih ekspedisi yang tersedia di sistem untuk memudahkan tracking.'
        }
      ]
    },
    {
      category: 'Performa & Rating',
      questions: [
        {
          q: 'Bagaimana cara meningkatkan rating toko?',
          a: 'Berikan pelayanan terbaik: respon cepat, produk berkualitas, packing rapi, dan kirim tepat waktu. Rating tinggi akan meningkatkan kepercayaan pembeli.'
        },
        {
          q: 'Apa yang terjadi jika rating toko saya rendah?',
          a: 'Rating rendah dapat mempengaruhi visibilitas toko di pencarian. Jika rating terus menurun, kami akan memberikan peringatan dan saran perbaikan.'
        },
        {
          q: 'Bisakah saya membalas ulasan pembeli?',
          a: 'Ya, Anda dapat membalas setiap ulasan di halaman "Ulasan". Gunakan fitur ini untuk memberikan klarifikasi atau ucapan terima kasih.'
        }
      ]
    },
    {
      category: 'Teknis',
      questions: [
        {
          q: 'Ukuran foto produk yang direkomendasikan?',
          a: 'Ukuran minimal 800x800 pixel dengan rasio 1:1. Format JPG atau PNG dengan ukuran maksimal 2MB per foto. Gunakan foto yang jelas dan terang.'
        },
        {
          q: 'Bagaimana jika lupa password?',
          a: 'Klik "Lupa Password" di halaman login, masukkan email yang terdaftar, dan ikuti instruksi reset password yang dikirim ke email Anda.'
        },
        {
          q: 'Apakah ada aplikasi mobile untuk seller?',
          a: 'Saat ini belum tersedia aplikasi mobile khusus seller, namun dashboard seller dapat diakses melalui browser mobile dengan tampilan responsif.'
        }
      ]
    }
  ]

  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '.5rem' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
          Temukan jawaban untuk pertanyaan yang sering diajukan
        </p>
      </div>

      {faqs.map((category, catIdx) => (
        <div key={catIdx} style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            color: 'var(--primary)', 
            marginBottom: '1rem',
            paddingBottom: '.5rem',
            borderBottom: '2px solid var(--primary)'
          }}>
            {category.category}
          </h2>

          <div style={{ display: 'grid', gap: '.75rem' }}>
            {category.questions.map((faq, faqIdx) => {
              const index = `${catIdx}-${faqIdx}`
              const isOpen = openIndex === index

              return (
                <div key={faqIdx} style={{
                  background: 'var(--surface-strong)',
                  border: '1px solid var(--border)',
                  borderRadius: '.6rem',
                  overflow: 'hidden',
                  boxShadow: isOpen ? 'var(--shadow)' : 'none',
                  transition: 'all .2s ease'
                }}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      background: isOpen ? 'var(--bg)' : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'background .2s ease'
                    }}
                  >
                    <span style={{ 
                      fontWeight: 600, 
                      fontSize: '1rem',
                      color: 'var(--text)',
                      flex: 1
                    }}>
                      {faq.q}
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="2" 
                      stroke="currentColor" 
                      width="20" 
                      height="20"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform .2s ease',
                        color: 'var(--primary)',
                        flexShrink: 0
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 1.25rem 1.25rem 1.25rem',
                      color: 'var(--text)',
                      lineHeight: 1.7,
                      background: 'var(--bg)',
                      animation: 'slideDown .2s ease'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        borderRadius: '.8rem',
        textAlign: 'center',
        color: '#fff'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '.75rem' }}>Masih ada pertanyaan?</h3>
        <p style={{ marginBottom: '1.5rem', opacity: .9 }}>
          Tim support kami siap membantu Anda
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn" style={{ 
            background: '#fff', 
            color: 'var(--primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,.15)'
          }}>
            Hubungi Support
          </button>
          <button className="btn" style={{ 
            background: 'transparent', 
            border: '2px solid #fff',
            boxShadow: 'none'
          }}>
            Email Kami
          </button>
        </div>
      </div>
    </div>
  )
}
