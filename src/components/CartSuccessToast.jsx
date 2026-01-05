import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import styles from "./CartSuccessToast.module.css";

export default function CartSuccessToast({ message, show, onClose, variant = 'success', title }) {
  const isError = variant === 'error';
  const Icon = isError ? XCircle : CheckCircle;
  const resolvedTitle = title || (isError ? 'Gagal' : 'Berhasil');

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <div className={`${styles.toast} ${show ? styles.show : ""} ${isError ? styles.error : styles.success}`}>
      <div className={`${styles.iconWrap} ${isError ? styles.iconWrapError : styles.iconWrapSuccess}`}>
        <Icon className={`${styles.icon} ${isError ? styles.iconError : styles.iconSuccess}`} />
      </div>
      <div className={styles.textWrap}>
        <div className={`${styles.title} ${isError ? styles.titleError : styles.titleSuccess}`}>{resolvedTitle}</div>
        <div className={styles.message}>{message}</div>
      </div>
      <button
        type="button"
        className={styles.closeBtn}
        aria-label="Tutup notifikasi"
        onClick={onClose}
      >
        x
      </button>
      {show && <span className={`${styles.progress} ${isError ? styles.progressError : styles.progressSuccess}`} aria-hidden="true" />}
    </div>
  );
}
