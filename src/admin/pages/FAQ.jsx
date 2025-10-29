import { useState } from 'react'
import { QuestionMarkCircleIcon, PencilIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export default function AdminFAQ() {
  const [expandedId, setExpandedId] = useState(null)
  const [faqs] = useState([
    {
      id: 1,
      category: 'Akun',
      question: 'Bagaimana cara membuat akun di TalentHub?',
      answer: 'Klik tombol "Daftar" di pojok kanan atas, isi formulir pendaftaran dengan informasi yang diminta (nama, email, password), lalu klik "Daftar". Anda akan menerima email verifikasi untuk mengaktifkan akun Anda.'
    },
    {
      id: 2,
      category: 'Akun',
      question: 'Bagaimana cara mereset password?',
      answer: 'Klik "Lupa Password" di halaman login, masukkan email Anda, dan kami akan mengirimkan link untuk mereset password ke email Anda.'
    },
    {
      id: 3,
      category: 'Pembayaran',
      question: 'Metode pembayaran apa saja yang diterima?',
      answer: 'Kami menerima berbagai metode pembayaran termasuk transfer bank, kartu kredit/debit, e-wallet (GoPay, OVO, Dana), dan cicilan 0% dengan kartu kredit tertentu.'
    },
    {
      id: 4,
      category: 'Pembayaran',
      question: 'Apakah pembayaran di TalentHub aman?',
      answer: 'Ya, semua transaksi pembayaran menggunakan enkripsi SSL dan diproses melalui payment gateway yang tersertifikasi PCI-DSS untuk keamanan maksimal.'
    },
    {
      id: 5,
      category: 'Pengiriman',
      question: 'Berapa lama waktu pengiriman?',
      answer: 'Waktu pengiriman bervariasi tergantung lokasi dan jasa pengiriman yang dipilih. Umumnya 2-5 hari kerja untuk area Jawa, dan 3-7 hari kerja untuk luar Jawa.'
    },
    {
      id: 6,
      category: 'Pengiriman',
      question: 'Bagaimana cara melacak pesanan saya?',
      answer: 'Setelah pesanan dikirim, Anda akan menerima nomor resi. Anda dapat melacak pesanan melalui halaman "Pesanan Saya" atau langsung di website kurir yang bersangkutan.'
    },
    {
      id: 7,
      category: 'Pengembalian',
      question: 'Bagaimana kebijakan pengembalian barang?',
      answer: 'Anda dapat mengembalikan produk dalam 7 hari setelah penerimaan jika produk tidak sesuai, rusak, atau cacat. Produk harus dalam kondisi asli dan belum digunakan.'
    },
    {
      id: 8,
      category: 'Pengembalian',
      question: 'Berapa lama proses refund?',
      answer: 'Setelah barang diterima dan diverifikasi oleh seller, proses refund akan memakan waktu 7-14 hari kerja tergantung metode pembayaran yang digunakan.'
    },
    {
      id: 9,
      category: 'Seller',
      question: 'Bagaimana cara menjadi seller di TalentHub?',
      answer: 'Daftar akun terlebih dahulu, lalu pilih "Daftar Sebagai Seller" di menu akun. Lengkapi informasi toko dan dokumen yang diperlukan. Tim kami akan melakukan verifikasi dalam 1-3 hari kerja.'
    },
    {
      id: 10,
      category: 'Seller',
      question: 'Berapa biaya menjadi seller?',
      answer: 'Mendaftar sebagai seller gratis. Kami hanya mengambil komisi 5% dari setiap transaksi yang berhasil dilakukan.'
    }
  ])

  const categories = [...new Set(faqs.map(faq => faq.category))]

  return (
    <div className="seller-products-page">
      <div className="products-header">
        <h1>FAQ (Frequently Asked Questions)</h1>
        <button className="btn btn-primary">
          <PlusIcon style={{ width: '18px', height: '18px' }} />
          Tambah FAQ
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '2rem', marginTop: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QuestionMarkCircleIcon style={{ width: '28px', height: '28px', color: '#ffffff' }} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>Pertanyaan yang Sering Diajukan</h2>
            <p style={{ margin: '.25rem 0 0 0', color: '#6b7280', fontSize: '.95rem' }}>Total {faqs.length} pertanyaan dalam {categories.length} kategori</p>
          </div>
        </div>

        {categories.map(category => (
          <div key={category} style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '4px solid #3b82f6' }}>
              {category}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {faqs.filter(faq => faq.category === category).map(faq => (
                <div 
                  key={faq.id} 
                  style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '.5rem', 
                    overflow: 'hidden',
                    background: expandedId === faq.id ? '#f9fafb' : '#ffffff'
                  }}
                >
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '1rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '.95rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                        {faq.question}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <button 
                        className="btn-icon-action"
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        <PencilIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button 
                        className="btn-icon-action delete"
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        <TrashIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                      {expandedId === faq.id ? (
                        <ChevronUpIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                      ) : (
                        <ChevronDownIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                      )}
                    </div>
                  </div>
                  
                  {expandedId === faq.id && (
                    <div style={{ 
                      padding: '0 1rem 1rem 1rem', 
                      color: '#6b7280', 
                      fontSize: '.9rem', 
                      lineHeight: '1.6',
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '1rem'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
