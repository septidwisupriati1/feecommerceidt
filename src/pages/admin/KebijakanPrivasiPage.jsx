import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const KebijakanPrivasiPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({
    lastUpdated: '10 November 2025',
    sections: [
      {
        id: 1,
        title: '1. Pendahuluan',
        content: `Kebijakan Privasi ini menjelaskan bagaimana Solo Technopark E-Commerce ("kami", "kami", atau "platform kami") mengumpulkan, menggunakan, melindungi, dan membagikan informasi pribadi Anda.

Kami berkomitmen untuk melindungi privasi Anda dan memastikan keamanan data pribadi Anda. Dengan menggunakan platform kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.`
      },
      {
        id: 2,
        title: '2. Informasi yang Kami Kumpulkan',
        content: `Kami mengumpulkan berbagai jenis informasi untuk menyediakan dan meningkatkan layanan kami:

A. Informasi yang Anda Berikan:
• Nama lengkap
• Alamat email
• Nomor telepon
• Alamat pengiriman
• Informasi pembayaran
• Foto profil

B. Informasi yang Dikumpulkan Otomatis:
• Alamat IP
• Jenis browser dan perangkat
• Sistem operasi
• Halaman yang dikunjungi
• Waktu dan tanggal kunjungan
• Data lokasi (dengan izin)

C. Informasi dari Pihak Ketiga:
• Data dari platform media sosial
• Informasi verifikasi identitas
• Data dari partner pembayaran`
      },
      {
        id: 3,
        title: '3. Cara Kami Menggunakan Informasi',
        content: `Kami menggunakan informasi yang dikumpulkan untuk:

• Memproses dan menyelesaikan transaksi
• Mengirim konfirmasi pesanan dan update pengiriman
• Memberikan dukungan pelanggan
• Meningkatkan pengalaman pengguna
• Mencegah penipuan dan aktivitas ilegal
• Mengirim promosi dan penawaran khusus (dengan persetujuan)
• Analisis dan peningkatan layanan
• Memenuhi kewajiban hukum

Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga untuk tujuan pemasaran mereka.`
      },
      {
        id: 4,
        title: '4. Pembagian Informasi',
        content: `Kami dapat membagikan informasi Anda dalam situasi berikut:

A. Dengan Penjual:
Informasi yang diperlukan untuk memproses pesanan (nama, alamat, kontak)

B. Dengan Penyedia Layanan:
• Pemroses pembayaran
• Jasa pengiriman
• Penyedia hosting dan cloud
• Layanan analitik
• Penyedia keamanan

C. Kepatuhan Hukum:
Jika diwajibkan oleh hukum atau untuk melindungi hak kami

D. Merger atau Akuisisi:
Dalam hal penjualan atau transfer bisnis

E. Dengan Persetujuan Anda:
Untuk tujuan lain yang telah Anda setujui`
      },
      {
        id: 5,
        title: '5. Keamanan Data',
        content: `Kami menerapkan langkah-langkah keamanan untuk melindungi informasi Anda:

• Enkripsi SSL/TLS untuk transmisi data
• Penyimpanan data yang aman dan terenkripsi
• Kontrol akses terbatas pada data sensitif
• Pemantauan keamanan berkelanjutan
• Audit keamanan reguler
• Pelatihan keamanan untuk staf

Namun, tidak ada metode transmisi atau penyimpanan yang 100% aman. Kami tidak dapat menjamin keamanan absolut, tetapi kami berusaha keras melindungi data Anda.`
      },
      {
        id: 6,
        title: '6. Cookies dan Teknologi Pelacakan',
        content: `Kami menggunakan cookies dan teknologi serupa untuk:

• Mengingat preferensi dan pengaturan Anda
• Memahami cara Anda menggunakan platform
• Meningkatkan pengalaman pengguna
• Menyajikan iklan yang relevan
• Menganalisis kinerja platform

Jenis Cookies:
• Cookies Esensial: Diperlukan untuk fungsi dasar
• Cookies Fungsional: Menyimpan preferensi pengguna
• Cookies Analitik: Membantu memahami penggunaan
• Cookies Pemasaran: Menyajikan iklan yang relevan

Anda dapat mengatur browser untuk menolak cookies, tetapi ini mungkin mempengaruhi fungsi platform.`
      },
      {
        id: 7,
        title: '7. Hak Privasi Anda',
        content: `Anda memiliki hak untuk:

• Mengakses informasi pribadi yang kami miliki
• Meminta koreksi data yang tidak akurat
• Menghapus data pribadi Anda
• Membatasi pemrosesan data Anda
• Memindahkan data Anda (portabilitas data)
• Menolak pemrosesan tertentu
• Menarik persetujuan kapan saja

Untuk melaksanakan hak-hak ini, hubungi kami di privacy@solotechnopark.com`
      },
      {
        id: 8,
        title: '8. Penyimpanan Data',
        content: `Kami menyimpan informasi pribadi Anda selama:

• Akun Anda aktif
• Diperlukan untuk menyediakan layanan
• Diperlukan untuk memenuhi kewajiban hukum
• Diperlukan untuk menyelesaikan perselisihan
• Diperlukan untuk menegakkan perjanjian

Setelah periode penyimpanan, kami akan menghapus atau mengamankan data Anda dengan aman.`
      },
      {
        id: 9,
        title: '9. Privasi Anak-anak',
        content: `Platform kami tidak ditujukan untuk anak-anak di bawah 18 tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak.

Jika kami mengetahui bahwa kami telah mengumpulkan data dari anak di bawah 18 tahun tanpa izin orang tua, kami akan segera menghapus informasi tersebut.

Jika Anda percaya kami memiliki informasi tentang anak di bawah umur, silakan hubungi kami.`
      },
      {
        id: 10,
        title: '10. Transfer Data Internasional',
        content: `Data Anda mungkin ditransfer dan disimpan di server yang berlokasi di luar negara Anda. Kami memastikan bahwa transfer tersebut mematuhi undang-undang perlindungan data yang berlaku dan data Anda tetap terlindungi.`
      },
      {
        id: 11,
        title: '11. Perubahan Kebijakan',
        content: `Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal "Terakhir Diperbarui" yang baru.

Kami mendorong Anda untuk meninjau kebijakan ini secara berkala. Penggunaan platform setelah perubahan berarti Anda menerima kebijakan yang diperbarui.`
      },
      {
        id: 12,
        title: '12. Hubungi Kami',
        content: `Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin melaksanakan hak privasi Anda:

Email: privacy@solotechnopark.com
Telepon: (0271) 123-4567
Alamat: Solo Technopark, Surakarta, Jawa Tengah

Data Protection Officer (DPO):
Email: dpo@solotechnopark.com

Kami akan menanggapi permintaan Anda dalam waktu 30 hari.`
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
    alert('Kebijakan privasi berhasil diperbarui!');
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
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShieldCheckIcon className="h-12 w-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              Kebijakan Privasi
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Kebijakan Privasi Platform
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

        {/* Important Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Perlindungan Data Anda</h3>
              <p className="text-sm text-blue-800">
                Kami menggunakan enkripsi SSL/TLS dan standar keamanan industri untuk melindungi informasi pribadi Anda.
                Data Anda tidak akan dijual atau dibagikan kepada pihak ketiga tanpa persetujuan Anda.
              </p>
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
                      rows={12}
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
        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-green-900 mb-2">Komitmen Kami</h3>
              <p className="text-sm text-green-800">
                Kami berkomitmen penuh untuk melindungi privasi Anda. Jika Anda memiliki kekhawatiran tentang privasi data Anda,
                jangan ragu untuk menghubungi tim Data Protection Officer kami di dpo@solotechnopark.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AdminSidebar>
  );
};

export default KebijakanPrivasiPage;
