import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import authAPI from '../../services/authAPI';
import { saveAuth, debugAuth } from '../../utils/auth';
import { getDashboardPath } from '../../utils/roleHelper';

export default function RegisterBuyerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    role: 'buyer'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError('Username minimal 3 karakter');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Email tidak valid');
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('Password minimal 8 karakter');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return false;
    }

    if (formData.phone && formData.phone.length < 10) {
      setError('Nomor telepon minimal 10 digit');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      console.log('📝 [RegisterBuyerPage] Registering buyer with data:', {
        username: registerData.username,
        email: registerData.email,
        role: registerData.role
      });
      
      const response = await authAPI.register(registerData);
      
      console.log('📥 [RegisterBuyerPage] Registration response:', {
        success: response.success,
        message: response.message
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Registrasi gagal');
      }

      // IMPORTANT: Berdasarkan docs, backend return user info TANPA token
      // Token hanya didapat setelah email verified dan login
      
      // Check if backend requires email verification
      if (response.message?.includes('verify') || response.message?.includes('email')) {
        // Production mode: Email verification required
        setSuccess(
          'Registrasi berhasil! ' +
          'Silakan cek email Anda untuk verifikasi akun. ' +
          'Setelah verifikasi, Anda dapat login.'
        );
        
        console.log('✅ [RegisterBuyerPage] Registration successful - email verification required');
        console.log('📧 [RegisterBuyerPage] User should check email:', registerData.email);
        
        // Redirect to login after showing message
        setTimeout(() => {
          navigate('/login', { 
            replace: true,
            state: { 
              message: 'Registrasi berhasil! Cek email untuk verifikasi.',
              email: registerData.email 
            }
          });
        }, 3000);
        
      } else if (response.data?.token && response.data?.user) {
        // Fallback mode: Auto-login (development only)
        console.log('💾 [RegisterBuyerPage] Fallback mode - saving auth and auto-login');
        
        // Ensure user has correct role format
        const user = {
          ...response.data.user,
          role: response.data.user.role || 'buyer',
          roles: response.data.user.roles || ['buyer']
        };
        
        saveAuth(response.data.token, user);
        
        // Verify save
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (!savedToken || !savedUser) {
          throw new Error('Gagal menyimpan data. Silakan login manual.');
        }
        
        console.log('✅ [RegisterBuyerPage] Auth saved successfully');
        debugAuth();
        
        setSuccess('Registrasi berhasil! Mengalihkan ke dashboard...');
        
        const dashboardPath = getDashboardPath(user);
        console.log('🔄 [RegisterBuyerPage] Redirecting to:', dashboardPath);
        
        setTimeout(() => {
          navigate(dashboardPath, { replace: true });
        }, 1500);
      } else {
        // Registration success but no auto-login
        setSuccess(
          'Registrasi berhasil! Silakan login dengan akun Anda.'
        );
        
        setTimeout(() => {
          navigate('/login', {
            replace: true,
            state: { email: registerData.email }
          });
        }, 2000);
      }

    } catch (err) {
      console.error('❌ [RegisterBuyerPage] Registration error:', err);
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-600 to-yellow-600 p-3 rounded-xl shadow-lg">
              <ShoppingCartIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Daftar Sebagai Pembeli
          </h2>
          <p className="mt-2 text-gray-600">
            Mulai belanja produk favorit Anda
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <EnvelopeIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-blue-900 mb-1">⚠️ Penting:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Setelah registrasi, cek email untuk verifikasi</li>
                <li>Klik link verifikasi di email Anda</li>
                <li>Setelah verifikasi, login untuk mulai belanja</li>
                <li>Cek folder spam jika email tidak masuk</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits Box */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start">
            <ShoppingCartIcon className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-orange-900 mb-1">Keuntungan Pembeli:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Belanja dari berbagai penjual</li>
                <li>Sistem pembayaran aman</li>
                <li>Tracking pesanan real-time</li>
                <li>Bisa upgrade ke seller kapan saja</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Alert Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="username"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimal 3 karakter</p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Nama Lengkap"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="081234567890"
                />
              </div>
              {formData.phone && (
                <p className="mt-1 text-xs text-gray-500">
                  {formData.phone.length}/15 karakter
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Min. 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimal 8 karakter</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Saya menyetujui{' '}
                <a href="#" className="text-orange-600 hover:text-orange-500">
                  Syarat & Ketentuan
                </a>{' '}
                dan{' '}
                <a href="#" className="text-orange-600 hover:text-orange-500">
                  Kebijakan Privasi
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Atau</span>
              </div>
            </div>
          </div>

          {/* Back to Role Selection */}
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Kembali ke pilihan role
            </Link>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
