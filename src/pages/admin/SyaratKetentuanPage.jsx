import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { 
  MagnifyingGlassIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const SyaratKetentuanPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({
    lastUpdated: '10 November 2025',
    sections: [
      {
        id: 1,
        title: '1. Ketentuan Umum',
        content: `Dengan mengakses dan menggunakan platform E-Commerce Solo Technopark, Anda setuju untuk terikat dengan syarat dan ketentuan yang berlaku. Platform ini menyediakan layanan marketplace untuk memfasilitasi transaksi jual beli antara penjual dan pembeli.

Pengguna wajib berusia minimal 18 tahun atau memiliki izin dari orang tua/wali untuk menggunakan layanan ini. Setiap pengguna bertanggung jawab penuh atas keamanan akun dan password mereka.`
      },
      {
        id: 2,
        title: '2. Pendaftaran Akun',
        content: `Untuk menggunakan fitur tertentu, pengguna harus mendaftar dan membuat akun. Informasi yang diberikan harus akurat, lengkap, dan terkini.

Pengguna dilarang:
• Membuat akun palsu atau menyesatkan
• Menggunakan identitas orang lain
• Membuat lebih dari satu akun tanpa izin
• Berbagi akun dengan pihak lain

Kami berhak menangguhkan atau menghapus akun yang melanggar ketentuan ini.`
      },
      {
        id: 3,
        title: '3. Transaksi dan Pembayaran',
        content: `Semua transaksi dilakukan melalui sistem pembayaran yang aman. Pembeli wajib membayar sesuai harga yang tercantum ditambah biaya pengiriman dan biaya lainnya jika ada.

Pembayaran dapat dilakukan melalui:
• Transfer Bank
• E-Wallet
• Kartu Kredit/Debit
• Metode pembayaran lain yang tersedia

Dana akan diteruskan ke penjual setelah pembeli mengkonfirmasi penerimaan barang atau setelah batas waktu konfirmasi otomatis.`
      },
      {
        id: 4,
        title: '4. Kewajiban Penjual',
        content: `Penjual wajib:
• Menyediakan deskripsi produk yang akurat
• Memastikan ketersediaan stok
• Mengirim barang sesuai waktu yang dijanjikan
• Menjaga kualitas produk sesuai deskripsi
• Merespon pertanyaan pembeli dengan cepat

Penjual dilarang menjual barang ilegal, palsu, atau yang melanggar hak kekayaan intelektual.`
      },
      {
        id: 5,
        title: '5. Kewajiban Pembeli',
        content: `Pembeli wajib:
• Melakukan pembayaran tepat waktu
• Memberikan alamat pengiriman yang benar
• Mengkonfirmasi penerimaan barang
• Memberikan ulasan yang jujur dan konstruktif

Pembeli tidak boleh menyalahgunakan sistem refund atau membuat klaim palsu.`
      },
      {
        id: 6,
        title: '6. Pengembalian dan Penukaran',
        content: `Pembeli dapat mengajukan pengembalian jika:
• Barang tidak sesuai deskripsi
• Barang rusak atau cacat
• Barang tidak diterima dalam waktu yang ditentukan

Pengajuan pengembalian harus dilakukan maksimal 3 hari setelah penerimaan barang dengan menyertakan bukti foto dan video unboxing.`
      },
      {
        id: 7,
        title: '7. Hak Kekayaan Intelektual',
        content: `Semua konten di platform ini, termasuk logo, desain, teks, dan gambar adalah milik Solo Technopark atau pemberi lisensi. Pengguna dilarang menggunakan konten tanpa izin tertulis.`
      },
      {
        id: 8,
        title: '8. Pembatasan Tanggung Jawab',
        content: `Platform tidak bertanggung jawab atas:
• Kualitas, keamanan, atau legalitas produk yang dijual
• Keakuratan listing produk
• Kemampuan penjual untuk menyelesaikan transaksi
• Kerugian akibat penggunaan platform

Kami menyediakan platform sebagai "sebagaimana adanya" tanpa jaminan apapun.`
      },
      {
        id: 9,
        title: '9. Penghentian Layanan',
        content: `Kami berhak menghentikan atau membatasi akses pengguna yang:
• Melanggar syarat dan ketentuan
• Terlibat dalam aktivitas penipuan
• Menyalahgunakan sistem
• Mendapat laporan negatif berulang kali

Penghentian dapat dilakukan tanpa pemberitahuan sebelumnya.`
      },
      {
        id: 10,
        title: '10. Perubahan Syarat dan Ketentuan',
        content: `Kami berhak mengubah syarat dan ketentuan sewaktu-waktu. Perubahan akan diumumkan melalui platform dan berlaku setelah dipublikasikan. Penggunaan berkelanjutan setelah perubahan menandakan persetujuan atas ketentuan baru.`
      },
      {
        id: 11,
        title: '11. Hukum yang Berlaku',
        content: `Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap perselisihan akan diselesaikan melalui musyawarah atau melalui pengadilan yang berwenang di Indonesia.`
      },
      {
        id: 12,
        title: '12. Kontak',
        content: `Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi kami:

Email: support@solotechnopark.com
Telepon: (0271) 123-4567
Alamat: Solo Technopark, Surakarta, Jawa Tengah`
      }
    ]
  });

  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent({ ...content });
  };

  const handleSave = () => {
    setContent(editedContent);
    setIsEditing(false);
    alert('Syarat dan ketentuan berhasil diperbarui!');
  };

  const handleCancel = () => {
    setEditedContent({ ...content });
    setIsEditing(false);
  };

  const handleSectionChange = (sectionId, field, value) => {
    setEditedContent({
      ...editedContent,
      sections: editedContent.sections.map(section =>
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      )
    });
  };

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Syarat dan Ketentuan
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola syarat dan ketentuan penggunaan platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Syarat dan Ketentuan Penggunaan Platform
              </h2>
              <p className="text-sm text-gray-600">
                Terakhir diperbarui: {isEditing ? (
                  <input
                    type="text"
                    value={editedContent.lastUpdated}
                    onChange={(e) => setEditedContent({ ...editedContent, lastUpdated: e.target.value })}
                    className="inline-block px-2 py-1 border border-gray-300 rounded"
                  />
                ) : content.lastUpdated}
              </p>
            </div>
            <div>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <CheckIcon className="h-5 w-5" />
                    Simpan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {(isEditing ? editedContent.sections : content.sections).map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Judul Bagian
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Konten
                    </label>
                    <textarea
                      value={section.content}
                      onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                      rows={10}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {section.title}
                  </h3>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <p className="text-sm text-blue-800 text-center">
            <strong>Catatan:</strong> Dengan menggunakan platform ini, Anda menyetujui syarat dan ketentuan yang berlaku.
            Pastikan untuk membaca dengan seksama sebelum melakukan transaksi.
          </p>
        </div>
      </div>
      <Footer />
    </AdminSidebar>
  );
};

export default SyaratKetentuanPage;
