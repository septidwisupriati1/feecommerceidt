import React, { useState } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import Footer from '../../components/Footer';
import { 
  QuestionMarkCircleIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const FAQPage = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'akun', label: 'Akun & Pendaftaran' },
    { id: 'produk', label: 'Produk & Stok' },
    { id: 'pesanan', label: 'Pesanan & Pengiriman' },
    { id: 'pembayaran', label: 'Pembayaran & Penarikan' },
    { id: 'promosi', label: 'Promosi & Marketing' },
    { id: 'teknis', label: 'Teknis & Troubleshooting' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'akun',
      question: "Bagaimana cara mendaftar sebagai penjual?",
      answer: "Untuk mendaftar sebagai penjual, klik tombol 'Daftar Sebagai Penjual' di halaman utama. Isi formulir pendaftaran dengan informasi yang diperlukan seperti nama toko, email, nomor telepon, dan informasi rekening bank. Setelah mendaftar, Anda akan menerima email verifikasi. Verifikasi akun Anda dalam waktu 24 jam untuk mulai berjualan."
    },
    {
      id: 2,
      category: 'akun',
      question: "Apakah ada biaya untuk menjadi penjual?",
      answer: "Pendaftaran sebagai penjual GRATIS. Kami hanya mengenakan komisi 5% dari setiap transaksi yang berhasil. Tidak ada biaya bulanan atau biaya tersembunyi lainnya. Anda hanya membayar ketika Anda berhasil menjual produk."
    },
    {
      id: 3,
      category: 'akun',
      question: "Bagaimana cara mengubah informasi toko saya?",
      answer: "Anda dapat mengubah informasi toko melalui menu 'Pengaturan' > 'Toko'. Di sana Anda dapat mengubah nama toko, deskripsi, logo, informasi kontak, dan alamat toko. Pastikan semua informasi akurat dan terkini untuk meningkatkan kepercayaan pembeli."
    },
    {
      id: 4,
      category: 'produk',
      question: "Bagaimana cara menambahkan produk?",
      answer: "Untuk menambahkan produk, masuk ke menu 'Produk Saya' dan klik tombol 'Tambah Produk'. Isi informasi produk seperti nama, kategori, harga, stok, deskripsi, dan unggah foto produk (minimal 3 foto). Pastikan foto berkualitas baik dan deskripsi jelas. Setelah selesai, klik 'Simpan' untuk mempublikasikan produk."
    },
    {
      id: 5,
      category: 'produk',
      question: "Berapa maksimal foto yang bisa diunggah per produk?",
      answer: "Anda dapat mengunggah maksimal 8 foto per produk. Foto pertama akan menjadi foto utama. Gunakan foto berkualitas tinggi dengan resolusi minimal 800x800 piksel. Format yang didukung: JPG, PNG, dan WebP dengan ukuran maksimal 2MB per foto."
    },
    {
      id: 6,
      category: 'produk',
      question: "Bagaimana cara mengatur stok produk?",
      answer: "Stok produk dapat diatur saat menambahkan produk atau melalui menu edit produk. Sistem akan otomatis mengurangi stok setiap kali ada pembelian. Anda akan menerima notifikasi jika stok tinggal 5 atau kurang. Anda juga dapat mengatur 'Pre-order' jika stok habis tetapi masih menerima pesanan."
    },
    {
      id: 7,
      category: 'pesanan',
      question: "Berapa lama waktu pemrosesan pesanan?",
      answer: "Penjual diharapkan memproses pesanan dalam waktu maksimal 2x24 jam setelah pembayaran dikonfirmasi. Segera update status pesanan menjadi 'Diproses' dan kemudian 'Dikirim' setelah barang diserahkan ke kurir. Keterlambatan pemrosesan dapat mempengaruhi rating toko Anda."
    },
    {
      id: 8,
      category: 'pesanan',
      question: "Bagaimana cara membatalkan pesanan?",
      answer: "Pesanan hanya dapat dibatalkan sebelum status berubah menjadi 'Dikirim'. Untuk membatalkan, buka detail pesanan dan klik 'Batalkan Pesanan'. Pilih alasan pembatalan dan konfirmasi. Dana akan dikembalikan ke pembeli dalam 1-3 hari kerja. Terlalu banyak pembatalan dapat mempengaruhi reputasi toko."
    },
    {
      id: 9,
      category: 'pesanan',
      question: "Apa yang harus dilakukan jika pembeli komplain?",
      answer: "Jika ada komplain, segera tanggapi dengan baik melalui chat. Dengarkan masalahnya dan tawarkan solusi (refund, retur, atau ganti barang). Jika tidak mencapai kesepakatan, platform akan memediasi. Selalu jaga komunikasi yang profesional dan cepat untuk menjaga rating toko."
    },
    {
      id: 10,
      category: 'pembayaran',
      question: "Kapan saya menerima pembayaran?",
      answer: "Pembayaran akan ditransfer ke rekening Anda setelah pembeli mengkonfirmasi penerimaan barang atau otomatis setelah 3 hari sejak status 'Diterima' oleh kurir. Dana akan masuk dalam 1-3 hari kerja setelah dikurangi komisi platform 5% dan biaya admin bank Rp 5.000."
    },
    {
      id: 11,
      category: 'pembayaran',
      question: "Bagaimana cara menarik saldo?",
      answer: "Saldo dapat ditarik melalui menu 'Saldo Penjualan' > 'Tarik Saldo'. Minimal penarikan adalah Rp 50.000. Pastikan rekening bank Anda sudah terverifikasi. Proses penarikan membutuhkan waktu 1-3 hari kerja. Anda akan menerima notifikasi email setelah transfer berhasil."
    },
    {
      id: 12,
      category: 'pembayaran',
      question: "Apakah ada biaya penarikan saldo?",
      answer: "Ya, setiap penarikan saldo dikenakan biaya admin sebesar Rp 5.000 untuk bank lokal dan Rp 10.000 untuk bank luar negeri. Biaya ini untuk menutupi biaya transfer antarbank. Disarankan untuk menarik dalam jumlah besar agar lebih efisien."
    },
    {
      id: 13,
      category: 'promosi',
      question: "Bagaimana cara mempromosikan produk saya?",
      answer: "Anda dapat menggunakan fitur 'Promosi' untuk meningkatkan visibilitas produk. Tersedia beberapa opsi: Flash Sale, Diskon Toko, Voucher, dan Iklan Berbayar. Atur budget dan durasi promosi sesuai kebutuhan. Produk yang dipromosikan akan muncul di halaman utama dan hasil pencarian teratas."
    },
    {
      id: 14,
      category: 'promosi',
      question: "Apa itu program affiliate dan bagaimana cara kerjanya?",
      answer: "Program affiliate memungkinkan influencer atau marketer mempromosikan produk Anda dengan mendapat komisi dari setiap penjualan. Anda mengatur persentase komisi (5-20%), mereka membagikan link khusus, dan jika ada pembelian melalui link tersebut, mereka mendapat komisi. Ini cara efektif meningkatkan penjualan."
    },
    {
      id: 15,
      category: 'teknis',
      question: "Mengapa produk saya tidak muncul di hasil pencarian?",
      answer: "Produk mungkin tidak muncul karena beberapa alasan: 1) Produk masih dalam review admin (max 24 jam), 2) Judul dan deskripsi tidak optimal (gunakan kata kunci yang tepat), 3) Stok habis, 4) Kategori salah, atau 5) Foto tidak memenuhi standar. Periksa dan perbaiki sesuai panduan."
    },
    {
      id: 16,
      category: 'teknis',
      question: "Bagaimana cara menggunakan fitur chat dengan pembeli?",
      answer: "Fitur chat dapat diakses melalui menu 'Pesan' atau notifikasi chat. Balas pertanyaan pembeli dengan cepat dan ramah. Anda dapat mengirim foto, file, dan info produk langsung dari chat. Tingkat respon cepat (<1 jam) akan meningkatkan badge 'Fast Response' yang dapat meningkatkan kepercayaan."
    },
    {
      id: 17,
      category: 'teknis',
      question: "Apa yang harus dilakukan jika lupa password?",
      answer: "Klik 'Lupa Password' di halaman login. Masukkan email terdaftar, Anda akan menerima link reset password. Klik link tersebut (berlaku 1 jam) dan buat password baru. Gunakan password yang kuat (min 8 karakter, kombinasi huruf, angka, dan simbol). Jika tidak menerima email, cek folder spam."
    },
    {
      id: 18,
      category: 'teknis',
      question: "Bagaimana cara menghubungi customer support?",
      answer: "Customer support dapat dihubungi melalui: 1) Live Chat di dashboard (jam kerja 08:00-22:00), 2) Email: support@example.com (respons 1x24 jam), 3) Telepon: +62 812-3456-7890 (jam kerja), atau 4) Formulir kontak di menu 'Bantuan'. Untuk masalah urgent, gunakan live chat atau telepon."
    }
  ];

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SellerSidebar>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <QuestionMarkCircleIcon className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">FAQ - Pertanyaan Umum</h1>
          </div>
          <p className="text-gray-600">
            Temukan jawaban untuk pertanyaan yang sering diajukan oleh penjual
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Menampilkan {filteredFaqs.length} dari {faqs.length} pertanyaan
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full flex items-start justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 text-left">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                  </div>
                  {expandedQuestion === faq.id ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  )}
                </button>
                {expandedQuestion === faq.id && (
                  <div className="px-5 pb-5 pl-14">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <QuestionMarkCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Tidak ada hasil ditemukan</p>
              <p className="text-gray-400 text-sm">Coba gunakan kata kunci lain atau pilih kategori berbeda</p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-sm p-6 border border-red-100">
          <div className="flex items-start gap-4">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Masih Butuh Bantuan?</h3>
              <p className="text-gray-600 mb-4">
                Tidak menemukan jawaban yang Anda cari? Tim dukungan kami siap membantu Anda!
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Hubungi Support
                </button>
                <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Kirim Feedback
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/seller/syarat" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-red-300 transition-colors">
            <h4 className="font-semibold text-gray-800 mb-1">Syarat & Ketentuan</h4>
            <p className="text-sm text-gray-600">Pelajari aturan dan kebijakan platform</p>
          </a>
          <a href="/seller/privasi" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-red-300 transition-colors">
            <h4 className="font-semibold text-gray-800 mb-1">Privasi & Kebijakan</h4>
            <p className="text-sm text-gray-600">Ketahui bagaimana kami melindungi data Anda</p>
          </a>
          <a href="/seller/panduan" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-red-300 transition-colors">
            <h4 className="font-semibold text-gray-800 mb-1">Panduan Penjual</h4>
            <p className="text-sm text-gray-600">Tutorial lengkap untuk penjual pemula</p>
          </a>
        </div>
      </div>
      <Footer />
    </SellerSidebar>
  );
};

export default FAQPage;
