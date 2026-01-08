import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import CartSuccessToast from "../components/CartSuccessToast";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { getCurrentUser } from '../services/authAPI';

export default function VerifyEmailLocalPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('idle'); // idle, sent, verified
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [email, setEmail] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    setEmail(user?.email || 'user@example.com');
  }, []);

  const sendCode = () => {
    if (secondsRemaining > 0) return; // cooldown active
    setStep('sent');
    setToast({ show: true, message: `Kode verifikasi telah dikirim ke ${email} (simulasi)`, variant: 'success' });
    setSecondsRemaining(30);
  };

  // Countdown effect for resend cooldown
  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const id = setInterval(() => {
      setSecondsRemaining((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [secondsRemaining]);

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    if (!code || code.trim().length < 4) {
      setError('Masukkan kode verifikasi yang valid');
      return;
    }
    // Frontend-only: accept any code
    setStep('verified');
    setToast({ show: true, message: 'Email berhasil diverifikasi (simulasi)', variant: 'success' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)', backgroundAttachment: 'fixed' }}>
      <BuyerNavbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">Verifikasi Email</h2>
              <p className="text-gray-600 mb-6">Halaman ini hanya tampilan front-end; email tidak dikirimkan sebenarnya.</p>

              {step === 'idle' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">Kami akan mengirimkan kode verifikasi ke alamat:</p>
                  <div className="p-3 bg-gray-50 rounded-md font-medium">{email}</div>
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer" onClick={sendCode}>Kirim Kode Verifikasi</Button>
                    <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => navigate(-1)}>Batal</Button>
                  </div>
                </div>
              )}

              {step === 'sent' && (
                <form onSubmit={handleVerify} className="space-y-4">
                  <p className="text-sm text-gray-700">Masukkan kode  yang Anda terima di email:</p>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Kode verifikasi" />
                  {error && <div className="text-sm text-red-600">{error}</div>}
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer">Verifikasi</Button>
                    <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setStep('idle')}>Kembali</Button>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Belum menerima?{' '}
                    <button
                      type="button"
                      onClick={sendCode}
                      disabled={secondsRemaining > 0}
                      className={`text-blue-600 hover:underline cursor-pointer ${secondsRemaining > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {secondsRemaining > 0 ? `Kirim ulang (${secondsRemaining}s)` : 'Kirim ulang'}
                    </button>
                  </div>
                </form>
              )}

              {step === 'verified' && (
                <div className="text-center space-y-4">
                  <div className="text-green-600 font-semibold">✔ Email terverifikasi (simulasi)</div>
                  <Button className="cursor-pointer" onClick={() => navigate('/profil')}>Kembali ke Profil</Button>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />

      <CartSuccessToast show={toast.show} message={toast.message} variant={toast.variant} onClose={() => setToast(prev => ({ ...prev, show: false }))} />
    </div>
  );
}
