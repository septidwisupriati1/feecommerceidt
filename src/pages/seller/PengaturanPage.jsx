import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from '../../components/Footer';
import { 
  BuildingStorefrontIcon,
  UserCircleIcon,
  LockClosedIcon,
  PhotoIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import CartSuccessToast from '../../components/CartSuccessToast';

export default function PengaturanPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('toko');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Data - Toko
  const [tokoData, setTokoData] = useState({
    storeName: "John's Store",
    storeDescription: "Toko online terpercaya menjual berbagai produk elektronik, fashion, dan aksesoris berkualitas dengan harga terbaik.",
    storeAddress: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220",
    storePhone: "+62 812-3456-7890",
    storeEmail: "johns.store@gmail.com",
    storeLogo: null
  });

  // Form Data - Profile
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john@seller.com",
    phone: "+62 812-3456-7890",
    birthDate: "1990-05-15",
    gender: "male",
    address: "Jl. Gatot Subroto No. 45, Jakarta Selatan",
    city: "Jakarta",
    province: "DKI Jakarta",
    postalCode: "12950",
    profilePhoto: null
  });

  // Form Data - Password
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleTokoSubmit = (e) => {
    e.preventDefault();
    setToast({ show: true, message: `Pengaturan toko berhasil disimpan!\nNama: ${tokoData.storeName}\nEmail: ${tokoData.storeEmail}` });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setToast({ show: true, message: `Profil berhasil diperbarui!\nNama: ${profileData.fullName}\nEmail: ${profileData.email}` });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ show: true, message: 'Password baru dan konfirmasi password tidak cocok!' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setToast({ show: true, message: 'Password minimal 8 karakter!' });
      return;
    }

    setToast({ show: true, message: 'Password berhasil diubah! Silakan login kembali dengan password baru.' });
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setToast({ show: true, message: `Logo toko akan diupload: ${file.name}` });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setToast({ show: true, message: `Foto profil akan diupload: ${file.name}` });
    }
  };

  const [toast, setToast] = useState({ show: false, message: '' });

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Pengaturan
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola informasi toko, profil, dan keamanan akun Anda
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            onClick={() => setActiveTab('toko')}
            variant={activeTab === 'toko' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${activeTab === 'toko' ? 'bg-blue-600 hover:bg-blue-700' : ''} cursor-pointer`}
          >
            <BuildingStorefrontIcon className="h-5 w-5" />
            Pengaturan Toko
          </Button>
          <Button
            onClick={() => setActiveTab('profile')}
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${activeTab === 'profile' ? 'bg-blue-600 hover:bg-blue-700' : ''} cursor-pointer`}
          >
            <UserCircleIcon className="h-5 w-5" />
            Profil Saya
          </Button>
          <Button
            onClick={() => setActiveTab('password')}
            variant={activeTab === 'password' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${activeTab === 'password' ? 'bg-blue-600 hover:bg-blue-700' : ''} cursor-pointer`}
          >
            <LockClosedIcon className="h-5 w-5" />
            Ubah Password
          </Button>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {/* Pengaturan Toko */}
          {activeTab === 'toko' && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Pengaturan Toko</h2>
                    <p className="text-sm text-gray-600">Kelola informasi dan identitas toko Anda</p>
                  </div>
                </div>

                <form onSubmit={handleTokoSubmit} className="space-y-6">
                  {/* Logo Toko */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Logo Toko
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                        JD
                      </div>
                      <div>
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <label htmlFor="logo-upload">
                          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('logo-upload').click()} className="cursor-pointer">
                            <PhotoIcon className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG. Max 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Nama Toko */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Toko <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={tokoData.storeName}
                      onChange={(e) => setTokoData({...tokoData, storeName: e.target.value})}
                      placeholder="Masukkan nama toko"
                      required
                    />
                  </div>

                  {/* Deskripsi Toko */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi Toko
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      value={tokoData.storeDescription}
                      onChange={(e) => setTokoData({...tokoData, storeDescription: e.target.value})}
                      placeholder="Ceritakan tentang toko Anda..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Toko */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Toko <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={tokoData.storeEmail}
                        onChange={(e) => setTokoData({...tokoData, storeEmail: e.target.value})}
                        placeholder="email@toko.com"
                        required
                      />
                    </div>

                    {/* Telepon Toko */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telepon Toko <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={tokoData.storePhone}
                        onChange={(e) => setTokoData({...tokoData, storePhone: e.target.value})}
                        placeholder="+62 812-xxxx-xxxx"
                        required
                      />
                    </div>
                  </div>

                  {/* Alamat Toko */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Toko <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      value={tokoData.storeAddress}
                      onChange={(e) => setTokoData({...tokoData, storeAddress: e.target.value})}
                      placeholder="Alamat lengkap toko"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/seller/dashboard')}
                      className="flex-1 cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Profil Saya */}
          {activeTab === 'profile' && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="p-3 bg-green-100 rounded-full">
                    <UserCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profil Saya</h2>
                    <p className="text-sm text-gray-600">Kelola informasi pribadi Anda</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Foto Profil */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Foto Profil
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-3xl">
                        JD
                      </div>
                      <div>
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <label htmlFor="photo-upload">
                          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('photo-upload').click()} className="cursor-pointer">
                            <PhotoIcon className="h-4 w-4 mr-2" />
                            Upload Foto
                          </Button>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG. Max 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="email@example.com"
                        required
                      />
                    </div>

                    {/* Telepon */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nomor Telepon <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="+62 812-xxxx-xxxx"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tanggal Lahir */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tanggal Lahir
                      </label>
                      <Input
                        type="date"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                      />
                    </div>

                    {/* Jenis Kelamin */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Jenis Kelamin
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={profileData.gender}
                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                      >
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="Alamat lengkap"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Kota */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kota
                      </label>
                      <Input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        placeholder="Jakarta"
                      />
                    </div>

                    {/* Provinsi */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Provinsi
                      </label>
                      <Input
                        type="text"
                        value={profileData.province}
                        onChange={(e) => setProfileData({...profileData, province: e.target.value})}
                        placeholder="DKI Jakarta"
                      />
                    </div>

                    {/* Kode Pos */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kode Pos
                      </label>
                      <Input
                        type="text"
                        value={profileData.postalCode}
                        onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                        placeholder="12950"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/seller/dashboard')}
                      className="flex-1 cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Ubah Password */}
          {activeTab === 'password' && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="p-3 bg-red-100 rounded-full">
                    <LockClosedIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Ubah Password</h2>
                    <p className="text-sm text-gray-600">Perbarui password untuk keamanan akun Anda</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* Password Lama */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password Lama <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                        placeholder="Masukkan password lama"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showOldPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Baru */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password Baru <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Masukkan password baru"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Minimal 8 karakter</p>
                  </div>

                  {/* Konfirmasi Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Konfirmasi Password Baru <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Masukkan ulang password baru"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Tips Password Aman:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Gunakan minimal 8 karakter</li>
                      <li>Kombinasikan huruf besar, huruf kecil, angka, dan simbol</li>
                      <li>Jangan gunakan informasi pribadi yang mudah ditebak</li>
                      <li>Gunakan password yang berbeda untuk setiap akun</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/seller/dashboard')}
                      className="flex-1 cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                      <LockClosedIcon className="h-5 w-5 mr-2" />
                      Ubah Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
      <CartSuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </SellerSidebar>
  );
}
