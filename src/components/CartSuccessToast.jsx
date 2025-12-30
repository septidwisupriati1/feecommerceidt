import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import styles from "./CartSuccessToast.module.css";

export default function CartSuccessToast({ message, show, onClose }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <div className={`${styles.toast} ${show ? styles.show : ""}`}>
      <div className={styles.iconWrap}>
        <CheckCircle className={styles.icon} />
      </div>
      <div className={styles.textWrap}>
        <div className={styles.title}>Berhasil</div>
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
      {show && <span className={styles.progress} aria-hidden="true" />}
    </div>
  );
}
