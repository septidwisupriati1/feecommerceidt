import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const ProfilSTPPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Solo Technopark',
    tagline: 'Pusat Inovasi dan Teknologi Surakarta',
    description: `Solo Technopark adalah kawasan teknologi dan inovasi yang bertujuan untuk mengembangkan ekosistem digital dan teknologi di wilayah Surakarta dan sekitarnya. Kami menyediakan berbagai fasilitas dan layanan untuk mendukung pertumbuhan startup, UMKM, dan pelaku industri kreatif.

Platform E-Commerce Solo Technopark hadir sebagai bagian dari upaya kami untuk memberdayakan pelaku usaha lokal dan memfasilitasi transaksi digital yang aman dan terpercaya.`,
    
    visi: 'Menjadi pusat inovasi dan teknologi terdepan di Indonesia yang mendorong pertumbuhan ekonomi digital dan memberdayakan masyarakat lokal.',
    
    misi: `1. Menyediakan infrastruktur dan ekosistem yang mendukung perkembangan teknologi dan inovasi
2. Memfasilitasi kolaborasi antara akademisi, industri, pemerintah, dan masyarakat
3. Mengembangkan platform digital untuk memberdayakan UMKM dan pelaku usaha lokal
4. Menyelenggarakan program pelatihan dan pendampingan untuk meningkatkan kompetensi digital
5. Mendorong riset dan pengembangan teknologi yang berdampak pada masyarakat`,
    
    address: 'Jl. Ki Hajar Dewantara, Jebres, Surakarta, Jawa Tengah 57126',
    phone: '(0271) 123-4567',
    email: 'info@solotechnopark.com',
    website: 'www.solotechnopark.com',
    
    facilities: [
      'Co-working Space',
      'Meeting Room',
      'Event Space',
      'Fabrication Lab',
      'Innovation Lab',
      'Training Center',
      'Business Incubator',
      'Product Development Center'
    ],
    
    services: [
      'Platform E-Commerce',
      'Business Development',
      'Digital Marketing Support',
      'Technology Consulting',
      'Startup Mentoring',
      'Product Development',
      'Networking Events',
      'Training & Workshop'
    ],
    
    achievements: [
      {
        year: '2020',
        title: 'Pendirian Solo Technopark',
        description: 'Diresmikan sebagai kawasan teknologi pertama di Surakarta'
      },
      {
        year: '2021',
        title: 'Platform E-Commerce Diluncurkan',
        description: 'Melayani lebih dari 100 UMKM lokal'
      },
      {
        year: '2022',
        title: 'Penghargaan Inovasi Daerah',
        description: 'Mendapat apresiasi dari Kementerian Komunikasi dan Informatika'
      },
      {
        year: '2023',
        title: 'Ekspansi Layanan',
        description: 'Menambah fasilitas lab inovasi dan pusat pelatihan'
      },
      {
        year: '2024',
        title: '500+ Mitra UMKM',
        description: 'Memberdayakan ratusan pelaku usaha lokal'
      },
      {
        year: '2025',
        title: 'Go Digital Program',
        description: 'Program pelatihan digital untuk 1000+ UMKM'
      }
    ],
    
    partners: [
      'Pemerintah Kota Surakarta',
      'Universitas Sebelas Maret',
      'Kementerian Komunikasi dan Informatika',
      'Bank Indonesia',
      'Telkom Indonesia',
      'Asosiasi E-Commerce Indonesia',
      'Kamar Dagang dan Industri Solo',
      'Komunitas Startup Solo'
    ]
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    alert('Profil Solo Technopark berhasil diperbarui!');
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...editedProfile[field]];
    newArray[index] = value;
    setEditedProfile({ ...editedProfile, [field]: newArray });
  };

  const handleAchievementChange = (index, field, value) => {
    const newAchievements = [...editedProfile.achievements];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    setEditedProfile({ ...editedProfile, achievements: newAchievements });
  };

  const currentData = isEditing ? editedProfile : profile;

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BuildingOfficeIcon className="h-12 w-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              Profil Solo Technopark
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
                Kelola Profil Organisasi
              </h2>
              <p className="text-sm text-gray-600">
                Informasi yang ditampilkan di halaman publik
              </p>
            </div>
            <div>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                  Edit Profil
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

        {/* Main Profile */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Umum</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Organisasi
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={currentData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{currentData.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tagline
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={currentData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-lg text-blue-600 font-semibold">{currentData.tagline}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              {isEditing ? (
                <textarea
                  value={currentData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{currentData.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Visi</h3>
            {isEditing ? (
              <textarea
                value={currentData.visi}
                onChange={(e) => handleChange('visi', e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{currentData.visi}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Misi</h3>
            {isEditing ? (
              <textarea
                value={currentData.misi}
                onChange={(e) => handleChange('misi', e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{currentData.misi}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Kontak</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-700">{currentData.address}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <PhoneIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telepon</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-700">{currentData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <EnvelopeIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={currentData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-700">{currentData.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GlobeAltIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-blue-600 hover:underline">
                    <a href={`https://${currentData.website}`} target="_blank" rel="noopener noreferrer">
                      {currentData.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Facilities & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Fasilitas</h3>
            <ul className="space-y-2">
              {currentData.facilities.map((facility, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={facility}
                      onChange={(e) => handleArrayChange('facilities', index, e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <span className="text-gray-700">{facility}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Layanan</h3>
            <ul className="space-y-2">
              {currentData.services.map((service, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => handleArrayChange('services', index, e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <span className="text-gray-700">{service}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Achievements Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Pencapaian & Milestone</h3>
          <div className="space-y-6">
            {currentData.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={achievement.year}
                        onChange={(e) => handleAchievementChange(index, 'year', e.target.value)}
                        className="w-12 text-center px-1 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="text-blue-600 font-bold">{achievement.year}</span>
                    )}
                  </div>
                  {index < currentData.achievements.length - 1 && (
                    <div className="w-0.5 h-full bg-blue-200 my-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={achievement.title}
                        onChange={(e) => handleAchievementChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                        placeholder="Judul pencapaian"
                      />
                      <input
                        type="text"
                        value={achievement.description}
                        onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Deskripsi"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="text-lg font-bold text-gray-800">{achievement.title}</h4>
                      <p className="text-gray-600">{achievement.description}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Mitra & Partner</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentData.partners.map((partner, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4 text-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={partner}
                    onChange={(e) => handleArrayChange('partners', index, e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-800">{partner}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </AdminSidebar>
  );
};

export default ProfilSTPPage;
