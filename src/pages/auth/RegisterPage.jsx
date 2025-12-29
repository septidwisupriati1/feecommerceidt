import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Pilih Jenis Akun
          </h2>
          <p className="mt-2 text-gray-600">
            Pilih peran yang sesuai untuk memulai
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Buyer Card */}
          <Link
            to="/register/buyer"
            className="group relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-orange-600 to-yellow-600 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCartIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Pembeli
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Belanja produk favorit dengan mudah
              </p>
              <ul className="text-left space-y-2 mb-4">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Belanja dari berbagai toko</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Pembayaran aman</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Tracking pesanan</span>
                </li>
              </ul>
              <div className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-lg font-medium group-hover:from-orange-700 group-hover:to-yellow-700 transition text-sm">
                Daftar Pembeli
              </div>
            </div>
          </Link>

          {/* Seller Card */}
          <Link
            to="/register/seller"
            className="group relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBagIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Penjual
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Jual produk dan kelola toko online
              </p>
              <ul className="text-left space-y-2 mb-4">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Kelola produk & stok</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Terima pesanan</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Analitik penjualan</span>
                </li>
              </ul>
              <div className="w-full py-2.5 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium group-hover:from-green-700 group-hover:to-blue-700 transition text-sm">
                Daftar Penjual
              </div>
            </div>
          </Link>

          {/* Admin Card */}
          <Link
            to="/register/admin"
            className="group relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Admin
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Kelola platform dengan akses penuh
              </p>
              <ul className="text-left space-y-2 mb-4">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Kelola pengguna</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Moderasi konten</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Laporan & analitik</span>
                </li>
              </ul>
              <div className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium group-hover:from-purple-700 group-hover:to-pink-700 transition text-sm">
                Daftar Admin
              </div>
            </div>
          </Link>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
