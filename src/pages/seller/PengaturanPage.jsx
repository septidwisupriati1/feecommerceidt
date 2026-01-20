import { useState, useEffect } from 'react';
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
import profileAPI from '../../services/profileAPI';
import storeAPI from '../../services/storeAPI';
import { getToken, getUser, saveAuth } from '../../utils/auth';

const apiOrigin = import.meta.env.VITE_API_BASE_URL ? new URL(import.meta.env.VITE_API_BASE_URL).origin : '';
const buildImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return apiOrigin ? `${apiOrigin}${url}` : url;
};

export default function PengaturanPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('toko');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Data - Toko
  const [tokoData, setTokoData] = useState({
    storeName: '',
    storeDescription: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    storeLogo: ''
  });

  const [storeLogoPreview, setStoreLogoPreview] = useState('');

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'male',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    profilePhoto: ''
  });

  const [profilePreview, setProfilePreview] = useState('');
  const [isUploadingStoreLogo, setIsUploadingStoreLogo] = useState(false);
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false);

  // Form Data - Password
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleTokoSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        store_name: tokoData.storeName,
        full_address: tokoData.storeAddress,
        about_store: tokoData.storeDescription,
      };

      const response = await storeAPI.updateStore(payload);

      // Sync phone with profile so it persists
      if (tokoData.storePhone) {
        try {
          await profileAPI.updateProfile({ phone: tokoData.storePhone });
        } catch (err) {
          console.warn('⚠️ Gagal sinkron telepon toko ke profil:', err?.message);
        }
      }

      // Refresh stored auth user with latest store info
      const token = getToken();
      const current = getUser();
      const updatedUser = {
        ...current,
        seller_profile: {
          ...(current?.seller_profile || {}),
          seller_id: response?.data?.seller_id ?? current?.seller_profile?.seller_id,
          store_name: response?.data?.store_name ?? tokoData.storeName,
          about_store: response?.data?.about_store ?? tokoData.storeDescription,
            store_phone: tokoData.storePhone || current?.seller_profile?.store_phone,
        },
          phone: tokoData.storePhone || current?.phone,
          email: tokoData.storeEmail || current?.email,
      };
      if (token && updatedUser) {
        saveAuth(token, updatedUser);
        window.dispatchEvent(new CustomEvent('sellerProfileUpdated', { detail: updatedUser }));
      }

      setToast({ show: true, message: `Pengaturan toko berhasil disimpan!\nNama: ${tokoData.storeName}` });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.error || error.message || 'Gagal menyimpan pengaturan toko' });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        full_name: profileData.fullName,
        phone: profileData.phone,
      };

      await profileAPI.updateProfile(payload);

      // Re-fetch profile to keep local auth state in sync
      const refreshed = await profileAPI.getProfile();
      const token = getToken();
      if (token && refreshed?.data) {
        const mergedUser = {
          ...(getUser() || {}),
          ...refreshed.data,
          roles: refreshed.data.roles || getUser()?.roles,
          seller_profile: refreshed.data.seller_profile || getUser()?.seller_profile,
        };
        saveAuth(token, mergedUser);
        window.dispatchEvent(new CustomEvent('sellerProfileUpdated', { detail: mergedUser }));
      }

      setToast({ show: true, message: `Profil berhasil diperbarui!\nNama: ${profileData.fullName || ''}` });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.error || error.message || 'Gagal menyimpan profil' });
    }
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setToast({ show: true, message: 'Ukuran logo maksimal 2MB' });
      e.target.value = '';
      return;
    }

    setIsUploadingStoreLogo(true);
    try {
      const response = await storeAPI.uploadStorePhoto(file);
      const photoUrl = response?.data?.data?.store_photo || response?.data?.store_photo || '';
      const previewUrl = buildImageUrl(photoUrl) || URL.createObjectURL(file);

      setStoreLogoPreview(previewUrl);
      setTokoData((prev) => ({ ...prev, storeLogo: photoUrl || prev.storeLogo }));

      const token = getToken();
      const current = getUser();
      if (token && current) {
        const updatedUser = {
          ...current,
          seller_profile: {
            ...(current?.seller_profile || {}),
            store_photo: photoUrl,
            store_name: response?.data?.data?.store_name || response?.data?.store_name || current?.seller_profile?.store_name,
          },
        };
        saveAuth(token, updatedUser);
        window.dispatchEvent(new CustomEvent('sellerProfileUpdated', { detail: updatedUser }));
      }

      setToast({ show: true, message: 'Logo toko berhasil diupload!' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.error || error.message || 'Gagal mengupload logo toko' });
    } finally {
      setIsUploadingStoreLogo(false);
      e.target.value = '';
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setToast({ show: true, message: 'Ukuran foto maksimal 2MB' });
      e.target.value = '';
      return;
    }

    setIsUploadingProfilePhoto(true);
    try {
      const response = await profileAPI.uploadProfilePicture(file);
      const photoUrl = response?.data?.data?.profile_picture || response?.data?.profile_picture || '';
      const previewUrl = buildImageUrl(photoUrl) || URL.createObjectURL(file);

      setProfilePreview(previewUrl);
      setProfileData((prev) => ({ ...prev, profilePhoto: photoUrl || prev.profilePhoto }));

      const token = getToken();
      const current = getUser();
      if (token && current) {
        const updatedUser = {
          ...current,
          profile_picture: photoUrl,
          username: response?.data?.data?.username || response?.data?.username || current.username,
        };
        saveAuth(token, updatedUser);
        window.dispatchEvent(new CustomEvent('sellerProfileUpdated', { detail: updatedUser }));
      }

      setToast({ show: true, message: 'Foto profil berhasil diupload!' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.error || error.message || 'Gagal mengupload foto profil' });
    } finally {
      setIsUploadingProfilePhoto(false);
      e.target.value = '';
    }
  };

  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storeRes, profileRes] = await Promise.all([
          storeAPI.getStore().catch((err) => {
            console.warn('⚠️ Store fetch failed:', err.message);
            return null;
          }),
          profileAPI.getProfile(),
        ]);

        if (storeRes?.success && storeRes.data) {
          setTokoData((prev) => ({
            ...prev,
            storeName: storeRes.data.store_name || prev.storeName,
            storeDescription: storeRes.data.about_store || prev.storeDescription,
            storeAddress: storeRes.data.full_address || prev.storeAddress,
            storeEmail: prev.storeEmail,
            storePhone: prev.storePhone,
            storeLogo: storeRes.data.store_photo || prev.storeLogo,
          }));
          setStoreLogoPreview(buildImageUrl(storeRes.data.store_photo) || '');
        }

        if (profileRes?.success && profileRes.data) {
          const p = profileRes.data;
          setProfileData((prev) => ({
            ...prev,
            fullName: p.full_name || p.username || prev.fullName,
            email: p.email || prev.email,
            phone: p.phone || prev.phone,
            profilePhoto: p.profile_picture || prev.profilePhoto,
          }));
          setProfilePreview(buildImageUrl(p.profile_picture) || '');

          setTokoData((prev) => ({
            ...prev,
            storeEmail: p.email || prev.storeEmail,
            storePhone: p.phone || prev.storePhone,
          }));

          const token = getToken();
          if (token) {
            const mergedUser = {
              ...(getUser() || {}),
              ...p,
              roles: p.roles || getUser()?.roles,
              seller_profile: p.seller_profile || getUser()?.seller_profile,
            };
            saveAuth(token, mergedUser);
            window.dispatchEvent(new CustomEvent('sellerProfileUpdated', { detail: mergedUser }));
          }
        }
      } catch (error) {
        console.error('❌ Gagal memuat data pengaturan:', error.message);
        setToast({ show: true, message: 'Gagal memuat data pengaturan. Coba lagi.' });
      }
    };

    loadData();
  }, []);

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
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-3xl overflow-hidden border-2 border-white shadow">
                        {storeLogoPreview ? (
                          <img
                            src={storeLogoPreview}
                            alt="Logo toko"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{(tokoData.storeName || 'JD').slice(0, 2).toUpperCase()}</span>
                        )}
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
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('logo-upload').click()}
                            disabled={isUploadingStoreLogo}
                            className="cursor-pointer"
                          >
                            <PhotoIcon className="h-4 w-4 mr-2" />
                            {isUploadingStoreLogo ? 'Mengupload...' : 'Upload Logo'}
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
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">Email mengikuti akun dan tidak dapat diubah di sini.</p>
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
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-3xl overflow-hidden border-2 border-white shadow">
                        {profilePreview ? (
                          <img
                            src={profilePreview}
                            alt="Foto profil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{(profileData.fullName || 'JD').slice(0, 2).toUpperCase()}</span>
                        )}
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
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('photo-upload').click()}
                            disabled={isUploadingProfilePhoto}
                            className="cursor-pointer"
                          >
                            <PhotoIcon className="h-4 w-4 mr-2" />
                            {isUploadingProfilePhoto ? 'Mengupload...' : 'Upload Foto'}
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
