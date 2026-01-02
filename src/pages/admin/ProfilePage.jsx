import { useState, useEffect } from 'react';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import AdminSidebar from "../../components/AdminSidebar";
import Footer from '../../components/Footer';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CameraIcon,
  PencilIcon,
  KeyIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function AdminProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile data
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '08123456789',
    address: 'Jl. Admin No. 123, Jakarta',
    role: 'admin',
    avatar: null,
    joined_date: '2024-01-15'
  });

  // Edit form data
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Password form data
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Load profile from localStorage or API
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      setProfile(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email,
        role: user.role || 'admin'
      }));
    }
  }, []);

  const handleEditProfile = () => {
    setEditForm({
      name: profile.name,
      phone: profile.phone,
      address: profile.address
    });
    setIsEditingProfile(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditForm({ name: '', phone: '', address: '' });
    setMessage({ type: '', text: '' });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update profile
      setProfile(prev => ({
        ...prev,
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address
      }));

      // Update localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.name = editForm.name;
      localStorage.setItem('user', JSON.stringify(user));

      setMessage({ type: 'success', text: 'Profile berhasil diperbarui!' });
      setIsEditingProfile(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal memperbarui profile: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    setIsChangingPassword(true);
    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    setMessage({ type: '', text: '' });
  };

  const handleCancelChangePassword = () => {
    setIsChangingPassword(false);
    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    setMessage({ type: '', text: '' });
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (passwordForm.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter!' });
      setLoading(false);
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setMessage({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok!' });
      setLoading(false);
      return;
    }

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'Password berhasil diubah!' });
      setIsChangingPassword(false);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal mengubah password: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Ukuran file maksimal 2MB!' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile(prev => ({ ...prev, avatar: event.target.result }));
        setMessage({ type: 'success', text: 'Foto profile berhasil diubah!' });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Profile Admin
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5" />
              )}
              <p>{message.text}</p>
            </div>
          </div>
        )}

        {/* Profile Header Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-500">
                    {getInitials(profile.name)}
                  </div>
                )}
                
                {/* Change Avatar Button */}
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-all group-hover:scale-110">
                  <CameraIcon className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <EnvelopeIcon className="h-5 w-5" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <PhoneIcon className="h-5 w-5" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold uppercase">
                    {profile.role}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditingProfile && (
                <Button
                  onClick={handleEditProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserCircleIcon className="h-6 w-6 text-blue-600" />
                Informasi Profile
              </h3>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <Input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <Input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="08123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckIcon className="h-5 w-5 mr-2" />
                      {loading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      variant="outline"
                      className="flex-1"
                    >
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Batal
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                    <p className="text-gray-900 font-medium">{profile.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Nomor Telepon</label>
                    <p className="text-gray-900 font-medium">{profile.phone || '-'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Alamat</label>
                    <p className="text-gray-900 font-medium">{profile.address || '-'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Bergabung Sejak</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(profile.joined_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <KeyIcon className="h-6 w-6 text-blue-600" />
                Keamanan Akun
              </h3>

              {isChangingPassword ? (
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Saat Ini
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      required
                      placeholder="Masukkan password saat ini"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      required
                      placeholder="Minimal 6 karakter"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      required
                      placeholder="Ulangi password baru"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckIcon className="h-5 w-5 mr-2" />
                      {loading ? 'Menyimpan...' : 'Ubah Password'}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelChangePassword}
                      disabled={loading}
                      variant="outline"
                      className="flex-1"
                    >
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Batal
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <span className="text-green-600 text-sm font-medium">Aman</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      ••••••••••••
                    </p>
                    <Button
                      onClick={handleChangePassword}
                      variant="outline"
                      className="w-full"
                    >
                      <KeyIcon className="h-5 w-5 mr-2" />
                      Ubah Password
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Tips Keamanan</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>✓ Gunakan password minimal 6 karakter</li>
                      <li>✓ Kombinasi huruf besar, kecil, dan angka</li>
                      <li>✓ Jangan gunakan password yang sama dengan akun lain</li>
                      <li>✓ Ubah password secara berkala</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Statistics */}
        <Card className="mt-6 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Aktivitas Akun</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <p className="text-2xl font-bold text-blue-600 uppercase">{profile.role}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status Akun</p>
                <p className="text-2xl font-bold text-green-600">Aktif</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Bergabung Sejak</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Date(profile.joined_date).toLocaleDateString('id-ID', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </AdminSidebar>
  );
}
