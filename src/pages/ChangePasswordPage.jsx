import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import CartSuccessToast from "../components/CartSuccessToast";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!currentPassword) e.currentPassword = 'Masukkan kata sandi saat ini';
    if (!newPassword) e.newPassword = 'Masukkan kata sandi baru';
    if (newPassword && newPassword.length < 8) e.newPassword = 'Kata sandi minimal 8 karakter';
    if (newPassword !== confirmPassword) e.confirmPassword = 'Konfirmasi kata sandi tidak cocok';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    // Frontend-only: simulate success
    setToast({ show: true, message: 'Kata sandi berhasil diubah (simulasi)', variant: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)', backgroundAttachment: 'fixed' }}>
      <BuyerNavbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Ubah Kata Sandi</h2>
              <p className="text-gray-600 mb-6">Halaman ini hanya tampilan front-end; perubahan kata sandi tidak akan tersimpan.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Saat Ini</label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full" />
                  {errors.currentPassword && <div className="text-sm text-red-600 mt-1">{errors.currentPassword}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Baru</label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full" />
                  {errors.newPassword && <div className="text-sm text-red-600 mt-1">{errors.newPassword}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Kata Sandi Baru</label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full" />
                  {errors.confirmPassword && <div className="text-sm text-red-600 mt-1">{errors.confirmPassword}</div>}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white cursor-pointer flex-1">Simpan</Button>
                  <Button variant="outline" onClick={() => navigate(-1)} className="flex-1 cursor-pointer">Batal</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />

      <CartSuccessToast show={toast.show} message={toast.message} variant={toast.variant} onClose={() => setToast(prev => ({ ...prev, show: false }))} />
    </div>
  );
}
