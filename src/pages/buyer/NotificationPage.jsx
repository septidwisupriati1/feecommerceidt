import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';
import Footer from '../../components/Footer';
import {
  BellIcon,
  CheckCircleIcon,
  TrashIcon,
  EnvelopeOpenIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import {
  BellAlertIcon,
} from '@heroicons/react/24/solid';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationIcon,
  formatTimeAgo,
} from '../../services/notificationAPI';

export default function NotificationPage() {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(0);

  // Fetch notifications
  const fetchNotifications = async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const params = {
        page: currentPage,
        pageSize: 20,
      };

      const data = await getNotifications(params);

      if (reset) {
        setNotifications(data.items);
        setPage(1);
      } else {
        setNotifications(prev => [...prev, ...data.items]);
      }
      
      setHasMore(currentPage < data.totalPages);
      setTotalNotifications(data.total);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotifications(true);
    fetchUnreadCount();
  }, []);

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Handle delete notification
  const handleDelete = async (notificationId) => {
    if (!window.confirm('Hapus notifikasi ini?')) return;
    
    try {
      await deleteNotification(notificationId);
      
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (deletedNotification && !deletedNotification.is_read) {
        fetchUnreadCount();
      }
      
      setTotalNotifications(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Handle delete all notifications
  const handleDeleteAll = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm(`Hapus semua ${notifications.length} notifikasi?`)) return;
    
    try {
      await Promise.all(notifications.map(n => deleteNotification(n.id)));
      
      setNotifications([]);
      setUnreadCount(0);
      setTotalNotifications(0);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      alert('Gagal menghapus notifikasi. Silakan coba lagi.');
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  // Load more
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchNotifications();
  };

  // Get notification type badge
  const getTypeBadge = (type) => {
    const badges = {
      order: { label: 'Pesanan', color: 'bg-blue-100 text-blue-800' },
      payment: { label: 'Pembayaran', color: 'bg-green-100 text-green-800' },
      shipping: { label: 'Pengiriman', color: 'bg-purple-100 text-purple-800' },
      promo: { label: 'Promo', color: 'bg-orange-100 text-orange-800' },
      review: { label: 'Ulasan', color: 'bg-yellow-100 text-yellow-800' },
      system: { label: 'Sistem', color: 'bg-gray-100 text-gray-800' },
    };
    
    return badges[type] || badges.system;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BellIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount > 0 ? (
                  <span className="text-blue-600 font-semibold">
                    {unreadCount} notifikasi belum dibaca
                  </span>
                ) : (
                  'Semua notifikasi sudah dibaca'
                )}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition shadow-sm"
            >
              <CheckCircleIcon className="h-5 w-5" />
              Tandai Telah Dibaca Semua
            </button>
            
            <button
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition shadow-sm"
            >
              <TrashIcon className="h-5 w-5" />
              Hapus Notifikasi
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-12">
            <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <BellAlertIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada notifikasi
            </h3>
            <p className="text-gray-500">
              Belum ada notifikasi untuk ditampilkan
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const typeBadge = getTypeBadge(notification.type);
              const IconComponent = getNotificationIcon(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all ${
                    !notification.is_read
                      ? 'border-l-4 border-blue-500'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`shrink-0 p-2 rounded-lg ${
                          !notification.is_read ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                      >
                        <IconComponent
                          className={`h-6 w-6 ${
                            !notification.is_read ? 'text-blue-600' : 'text-gray-600'
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeBadge.color}`}>
                              {typeBadge.label}
                            </span>
                            {!notification.is_read && (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>

                        <h3
                          className={`text-base font-semibold mb-1 ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>

                        {/* Metadata */}
                        {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                          <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                            {notification.metadata.order_id && (
                              <div>Order ID: <span className="font-mono font-medium">{notification.metadata.order_id}</span></div>
                            )}
                            {notification.metadata.amount && (
                              <div>Jumlah: <span className="font-semibold text-gray-900">Rp {notification.metadata.amount.toLocaleString('id-ID')}</span></div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1">
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Tandai sudah dibaca"
                          >
                            <EnvelopeOpenIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus notifikasi"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Load More */}
            {hasMore && (
              <div className="text-center py-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Memuat...
                    </span>
                  ) : (
                    'Muat Lebih Banyak'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
