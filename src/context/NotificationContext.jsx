import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

// Initial mock notifications
const initialNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'Pesan Baru dari Kickchickclo',
    message: 'Halo, apakah produk masih tersedia?',
    time: '2 menit yang lalu',
    read: false,
    icon: 'message'
  },
  {
    id: 2,
    type: 'order',
    title: 'Pesanan Dikonfirmasi',
    message: 'Pesanan #TH2023-001 telah dikonfirmasi dan sedang diproses',
    time: '1 jam yang lalu',
    read: false,
    icon: 'order'
  },
  {
    id: 3,
    type: 'promo',
    title: 'Diskon Spesial 50%',
    message: 'Dapatkan diskon hingga 50% untuk kategori Fashion Wanita',
    time: '3 jam yang lalu',
    read: false,
    icon: 'promo'
  },
  {
    id: 4,
    type: 'shipping',
    title: 'Paket Dalam Pengiriman',
    message: 'Pesanan #TH2023-002 sedang dalam perjalanan ke alamat Anda',
    time: '5 jam yang lalu',
    read: true,
    icon: 'shipping'
  },
  {
    id: 5,
    type: 'payment',
    title: 'Pembayaran Berhasil',
    message: 'Pembayaran untuk pesanan #TH2023-003 telah berhasil diproses',
    time: '1 hari yang lalu',
    read: true,
    icon: 'payment'
  },
  {
    id: 6,
    type: 'message',
    title: 'Pesan Baru dari GarmentMarts',
    message: 'Terima kasih sudah berbelanja! Ada yang bisa kami bantu?',
    time: '1 hari yang lalu',
    read: true,
    icon: 'message'
  },
  {
    id: 7,
    type: 'system',
    title: 'Update Sistem',
    message: 'TalentHub telah diperbarui dengan fitur baru! Cek sekarang.',
    time: '2 hari yang lalu',
    read: true,
    icon: 'system'
  },
  {
    id: 8,
    type: 'order',
    title: 'Pesanan Selesai',
    message: 'Pesanan #TH2023-004 telah selesai. Berikan ulasan Anda!',
    time: '3 hari yang lalu',
    read: true,
    icon: 'order'
  }
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications)

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const addNotification = (notification) => {
    const newNotif = {
      id: Date.now(),
      read: false,
      time: 'Baru saja',
      ...notification
    }
    setNotifications(prev => [newNotif, ...prev])
  }

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addNotification,
      getUnreadCount,
      unreadCount: getUnreadCount()
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
