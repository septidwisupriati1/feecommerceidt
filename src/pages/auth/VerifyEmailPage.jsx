import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../../services/authAPI';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Token verifikasi tidak ditemukan. Silakan periksa link di email Anda.');
      return;
    }

    // Verify email
    const verify = async () => {
      try {
        const result = await verifyEmail(token);
        setStatus('success');
        setMessage(result.message || 'Email berhasil diverifikasi! Anda sekarang dapat login dan membuat toko.');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verifikasi gagal. Token mungkin sudah kadaluarsa atau tidak valid.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              <ArrowPathIcon className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Memverifikasi Email...
              </h2>
              <p className="text-gray-600">
                Mohon tunggu sebentar
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircleIcon className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifikasi Berhasil!
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition"
                >
                  Login Sekarang
                </Link>
                <Link
                  to="/"
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <ExclamationCircleIcon className="w-16 h-16 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifikasi Gagal
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Tips:</strong> Pastikan Anda menggunakan link yang benar dari email. Link verifikasi mungkin sudah kadaluarsa.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/register"
                  className="block w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition"
                >
                  Daftar Ulang
                </Link>
                <Link
                  to="/login"
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Ke Halaman Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
