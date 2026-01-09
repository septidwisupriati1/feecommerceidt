import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import CartSuccessToast from "../components/CartSuccessToast";
import {
  ArrowLeft,
  Building2,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  X,
  Image as ImageIcon
} from "lucide-react";
import styles from "./PaymentPage.module.css";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.order;

  // Load Midtrans Snap script
  useEffect(() => {
    const existing = document.querySelector('script[src*="snap.js"]');
    if (existing) return;
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.dataset.clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // Bank account info (bisa diganti dengan data dari API)
  const bankInfo = {
    bankName: "Bank BCA",
    accountNumber: "1234567890",
    accountHolder: "PT E-Commerce Indonesia"
  };

  // Countdown timer (24 jam dari sekarang)
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Hanya file gambar yang diperbolehkan (JPG, PNG, dll)');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Nomor rekening berhasil disalin!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Silakan upload bukti transfer terlebih dahulu');
      return;
    }

    if (!accountName.trim()) {
      alert('Silakan isi nama rekening pengirim');
      return;
    }

    setUploading(true);

    // Simulasi upload - ganti dengan API call yang sebenarnya
    try {
      const formData = new FormData();
      formData.append('payment_proof', selectedFile);
      formData.append('account_name', accountName);
      formData.append('notes', notes);
      formData.append('order_id', orderData?.order_id);

      // TODO: Replace with actual API call
      // const response = await uploadPaymentProof(formData);

      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setToast({ show: true, message: 'Bukti pembayaran berhasil dikirim! Tim kami akan memverifikasi dalam 1x24 jam.', variant: 'success' });
      // Navigate after showing toast briefly
      setTimeout(() => {
        navigate('/pesanan-saya');
      }, 1600);
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      alert('Gagal mengirim bukti pembayaran. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  // Jika tidak ada order data, redirect ke checkout
  if (!orderData) {
    useEffect(() => {
      navigate('/checkout');
    }, []);
    return null;
  }

  return (
    <div className={styles.paymentPage}>
      <BuyerNavbar />
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/pesanan-saya')}
          >
            <ArrowLeft size={16} />
            Kembali ke Pesanan
          </button>
          <h1 className={styles.title}>Menunggu Pembayaran</h1>
          <p className={styles.subtitle}>
            Silakan lakukan pembayaran dan upload bukti transfer Anda
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Main Section */}
          <div className={styles.mainSection}>
            {/* Status */}
            <div className={styles.card}>
              <div className={`${styles.statusBadge} ${styles.waiting}`}>
                <Clock size={16} />
                Menunggu Pembayaran
              </div>

              <div className={styles.alert + ' ' + styles.warning}>
                <AlertCircle className={styles.alertIcon} />
                <div>
                  <strong>Batas Waktu Pembayaran:</strong>
                  <div style={{ marginTop: '0.25rem', fontSize: '1.125rem', fontWeight: 'bold' }}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Account Info */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Building2 className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>Informasi Rekening</h2>
              </div>

              <div className={styles.instructions}>
                <div className={styles.instructionTitle}>
                  Cara Transfer:
                </div>
                <ul className={styles.instructionList}>
                  <li>Transfer sesuai nominal yang tertera</li>
                  <li>Gunakan kode unik jika ada</li>
                  <li>Simpan bukti transfer</li>
                  <li>Upload bukti transfer di bawah</li>
                </ul>
              </div>

              <div className={styles.bankCard}>
                <div className={styles.bankName}>{bankInfo.bankName}</div>
                <div className={styles.accountNumber}>{bankInfo.accountNumber}</div>
                <div className={styles.accountName}>a.n. {bankInfo.accountHolder}</div>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(bankInfo.accountNumber)}
                >
                  <Copy size={16} />
                  Salin Nomor Rekening
                </button>
              </div>
            </div>

            {/* Upload Section */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Upload className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>Upload Bukti Transfer</h2>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {/* File Upload */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Bukti Transfer <span className={styles.required}>*</span>
                  </label>

                  {!previewUrl ? (
                    <div
                      className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      <ImageIcon className={styles.uploadIcon} />
                      <div className={styles.uploadText}>
                        Klik untuk upload atau drag & drop
                      </div>
                      <div className={styles.uploadHint}>
                        Format: JPG, PNG, max 5MB
                      </div>
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                      />
                    </div>
                  ) : (
                    <div className={styles.imagePreview}>
                      <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={handleRemoveFile}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Account Name */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="accountName">
                    Nama Rekening Pengirim <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="accountName"
                    type="text"
                    className={styles.input}
                    placeholder="Masukkan nama sesuai rekening"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>

                {/* Notes */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="notes">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    id="notes"
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Tambahkan catatan jika diperlukan"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      Mengirim...
                    </div>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Kirim Bukti Pembayaran
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Total Payment */}
            <div className={styles.totalCard}>
              <div className={styles.totalLabel}>Total Pembayaran</div>
              <div className={styles.totalAmount}>
                {formatPrice(orderData?.total || 15999000)}
              </div>
              <div className={styles.deadline}>
                <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Bayar sebelum: {formatTime(timeLeft)}
              </div>
            </div>

            {/* Order Details */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>
                Detail Pesanan
              </h3>
              <div className={styles.orderInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>No. Pesanan</span>
                  <span className={styles.infoValue + ' ' + styles.highlight}>
                    {orderData?.order_id || 'ORD-20231201-001'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Jumlah Barang</span>
                  <span className={styles.infoValue}>
                    {orderData?.items_count || 1} barang
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ongkos Kirim</span>
                  <span className={styles.infoValue}>
                    {orderData?.shipping_cost ? formatPrice(orderData.shipping_cost) : 'GRATIS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className={styles.alert + ' ' + styles.info}>
              <AlertCircle className={styles.alertIcon} />
              <div>
                <strong>Butuh Bantuan?</strong>
                <div style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
                  Hubungi Customer Service kami jika ada kendala
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <CartSuccessToast show={toast.show} message={toast.message} variant={toast.variant} onClose={() => setToast(prev => ({ ...prev, show: false }))} />
    </div>
  );
}
