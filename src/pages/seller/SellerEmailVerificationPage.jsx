import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerNavbar from '../../components/SellerNavbar';
import Footer from '../../components/Footer';
import profileAPI from '../../services/profileAPI';
import { getUser, saveAuth } from '../../utils/auth';
import { EnvelopeOpenIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function SellerEmailVerificationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const user = getUser();
    setEmail(user?.email || '');
    const alreadyVerified = user?.email_verified === true || !!user?.email_verified_at;
    setVerified(!!alreadyVerified);
    setLoading(false);
  }, []);

  const refreshStatus = async () => {
    setChecking(true);
    setError('');
    try {
      const response = await profileAPI.getProfile();
      const profile = response?.data?.data || response?.data || {};
      const emailVerified = profile.email_verified === true || !!profile.email_verified_at;
      if (emailVerified) {
        const current = getUser() || {};
        const updatedUser = { ...current, ...profile, email_verified: true };
        if (!updatedUser.roles && updatedUser.role) {
          updatedUser.roles = [updatedUser.role];
        }
        saveAuth(localStorage.getItem('token'), updatedUser);
      }
      setVerified(emailVerified);
    } catch (err) {
      setError(err?.message || 'Gagal memeriksa status.');
    } finally {
      setChecking(false);
    }
  };

  const handleGoDashboard = () => {
    navigate('/seller/dashboard');
  };

  const statusColor = verified ? 'text-green-600' : 'text-orange-600';
  const statusBg = verified ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200';

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col">
      <SellerNavbar />

      {/* Blurred dashboard-like backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90" />
        <div className="absolute inset-0" aria-hidden>
          <div className="grid grid-cols-3 gap-4 p-8 opacity-40">
            {[...Array(9)].map((_, idx) => (
              <div
                key={idx}
                className="h-24 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/5 shadow-lg"
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl" />
      </div>

      <main className="flex-1 relative z-10 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="rounded-2xl bg-white/10 border border-white/15 shadow-2xl backdrop-blur-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl ${verified ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
                {verified ? (
                  <CheckCircleIcon className="w-8 h-8 text-green-300" />
                ) : (
                  <EnvelopeOpenIcon className="w-8 h-8 text-orange-300" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-200/70">Verifikasi Email Seller</p>
                <h1 className="text-2xl font-semibold text-white">{verified ? 'Email terverifikasi' : 'Silakan konfirmasi di email'}</h1>
              </div>
            </div>

            <div className={`${verified ? 'bg-green-500/10 border-green-400/30' : 'bg-orange-500/10 border-orange-400/30'} border rounded-lg p-4 mb-6`}>
              <p className={`text-sm font-medium ${verified ? 'text-green-200' : 'text-orange-200'}`}>
                {verified
                  ? 'Email sudah terverifikasi. Dashboard seller siap diakses.'
                  : 'Kami mengirimkan tautan verifikasi ke email Anda. Buka email dan klik tautan untuk melanjutkan.'}
              </p>
              {email && !verified && (
                <p className="text-sm text-slate-200 mt-2">Dikirim ke: <span className="font-semibold text-white">{email}</span></p>
              )}
            </div>

            {!verified && (
              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://mail.google.com', '_blank')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition shadow-lg shadow-blue-500/30"
                >
                  Buka Email
                </button>
                <button
                  onClick={refreshStatus}
                  disabled={checking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/25 text-white font-medium hover:bg-white/10 transition disabled:opacity-60"
                >
                  {checking ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Memeriksa status...
                    </>
                  ) : (
                    'Saya sudah klik tautan, cek lagi'
                  )}
                </button>
                {error && <p className="text-sm text-red-300">{error}</p>}
              </div>
            )}

            {verified && (
              <div className="space-y-3">
                <button
                  onClick={handleGoDashboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition shadow-lg shadow-green-500/30"
                >
                  Pergi ke Dashboard Seller
                </button>
                <p className="text-sm text-slate-200/80">Jika halaman ini tidak berpindah otomatis, klik tombol di atas.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
