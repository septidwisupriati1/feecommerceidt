import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BanknotesIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const RekeningPenjualPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Data rekening dari semua seller (akan terintegrasi dengan database)
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      sellerId: 'S001',
      sellerName: 'John Doe',
      storeName: "John's Store",
      email: 'john@seller.com',
      bankName: 'Bank BCA',
      accountNumber: '1234567890',
      accountHolder: 'John Doe',
      branchName: 'KCP Jakarta Pusat',
      status: 'verified',
      isPrimary: true,
      createdAt: '2025-01-15',
      verifiedAt: '2025-01-16',
      verifiedBy: 'Admin System',
      notes: ''
    },
    {
      id: 2,
      sellerId: 'S001',
      sellerName: 'John Doe',
      storeName: "John's Store",
      email: 'john@seller.com',
      bankName: 'Bank Mandiri',
      accountNumber: '9876543210',
      accountHolder: 'John Doe',
      branchName: 'KCP Jakarta Selatan',
      status: 'pending',
      isPrimary: false,
      createdAt: '2025-11-10',
      verifiedAt: null,
      verifiedBy: null,
      notes: ''
    },
    {
      id: 3,
      sellerId: 'S002',
      sellerName: 'Jane Smith',
      storeName: 'Fashion House',
      email: 'jane@seller.com',
      bankName: 'Bank BNI',
      accountNumber: '5555666677',
      accountHolder: 'Jane Smith',
      branchName: 'KCP Bandung',
      status: 'pending',
      isPrimary: true,
      createdAt: '2025-11-09',
      verifiedAt: null,
      verifiedBy: null,
      notes: ''
    },
    {
      id: 4,
      sellerId: 'S003',
      sellerName: 'Bob Wilson',
      storeName: 'Tech Store',
      email: 'bob@seller.com',
      bankName: 'Bank BRI',
      accountNumber: '1111222233',
      accountHolder: 'Bob Wilson',
      branchName: 'KCP Surabaya',
      status: 'rejected',
      isPrimary: true,
      createdAt: '2025-11-08',
      verifiedAt: '2025-11-09',
      verifiedBy: 'Admin John',
      notes: 'Nama pemilik rekening tidak sesuai dengan data toko'
    }
  ]);

  const handleVerify = (accountId) => {
    setAccounts(accounts.map(acc => 
      acc.id === accountId 
        ? { 
            ...acc, 
            status: 'verified',
            verifiedAt: new Date().toISOString().split('T')[0],
            verifiedBy: 'Admin System'
          } 
        : acc
    ));
  };

  const handleReject = (accountId, notes) => {
    setAccounts(accounts.map(acc => 
      acc.id === accountId 
        ? { 
            ...acc, 
            status: 'rejected',
            verifiedAt: new Date().toISOString().split('T')[0],
            verifiedBy: 'Admin System',
            notes: notes || 'Ditolak oleh admin'
          } 
        : acc
    ));
  };

  const handleViewDetail = (account) => {
    setSelectedAccount(account);
    setShowDetailModal(true);
  };

  const filteredAccounts = accounts.filter(account => {
    const matchSearch = 
      account.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.accountNumber.includes(searchQuery);
    
    const matchStatus = filterStatus === 'all' || account.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const stats = [
    { 
      label: 'Total Rekening', 
      value: accounts.length, 
      color: 'blue',
      icon: BanknotesIcon
    },
    { 
      label: 'Menunggu Verifikasi', 
      value: accounts.filter(a => a.status === 'pending').length, 
      color: 'yellow',
      icon: ClockIcon
    },
    { 
      label: 'Terverifikasi', 
      value: accounts.filter(a => a.status === 'verified').length, 
      color: 'green',
      icon: CheckCircleIcon
    },
    { 
      label: 'Ditolak', 
      value: accounts.filter(a => a.status === 'rejected').length, 
      color: 'red',
      icon: XCircleIcon
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: {
        text: 'Terverifikasi',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      },
      pending: {
        text: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      },
      rejected: {
        text: 'Ditolak',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}>
        {config.text}
      </span>
    );
  };

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Rekening Penjual
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
              yellow: { text: 'text-yellow-600', bg: 'bg-yellow-50' },
              green: { text: 'text-green-600', bg: 'bg-green-50' },
              red: { text: 'text-red-600', bg: 'bg-red-50' }
            };
            const colors = colorClasses[stat.color];
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari penjual, toko, bank, atau nomor rekening..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Terverifikasi</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Penjual
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Informasi Rekening
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Tidak ada data rekening yang sesuai
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{account.sellerName}</p>
                          <p className="text-sm text-gray-600">{account.storeName}</p>
                          <p className="text-xs text-gray-500">{account.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{account.bankName}</p>
                          <p className="text-sm text-gray-600">{account.accountNumber}</p>
                          <p className="text-xs text-gray-500">a/n {account.accountHolder}</p>
                          {account.isPrimary && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                              Rekening Utama
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(account.status)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(account.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetail(account)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          {account.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerify(account.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Verifikasi"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => {
                                  const notes = prompt('Alasan penolakan (opsional):');
                                  if (notes !== null) {
                                    handleReject(account.id, notes);
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Tolak"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Detail Rekening</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Seller Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informasi Penjual</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Penjual</p>
                    <p className="font-semibold text-gray-800">{selectedAccount.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nama Toko</p>
                    <p className="font-semibold text-gray-800">{selectedAccount.storeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">{selectedAccount.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ID Penjual</p>
                    <p className="font-semibold text-gray-800">{selectedAccount.sellerId}</p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informasi Rekening</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Bank</p>
                    <p className="font-semibold text-gray-800">{selectedAccount.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nomor Rekening</p>
                    <p className="font-semibold text-gray-800">{selectedAccount.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nama Pemilik</p>
                    <p className="font-semibold text-gray-800">{selectedAccount.accountHolder}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nama Cabang</p>
                    <p className="font-semibold text-gray-800">{selectedAccount.branchName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedAccount.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipe</p>
                    <p className="font-semibold text-gray-800">
                      {selectedAccount.isPrimary ? 'Rekening Utama' : 'Rekening Sekunder'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informasi Verifikasi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pengajuan</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedAccount.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  {selectedAccount.verifiedAt && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Verifikasi</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(selectedAccount.verifiedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Diverifikasi Oleh</p>
                        <p className="font-semibold text-gray-800">{selectedAccount.verifiedBy}</p>
                      </div>
                    </>
                  )}
                  {selectedAccount.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Catatan</p>
                      <p className="font-semibold text-gray-800">{selectedAccount.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedAccount.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleVerify(selectedAccount.id);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Verifikasi Rekening
                  </button>
                  <button
                    onClick={() => {
                      const notes = prompt('Alasan penolakan:');
                      if (notes !== null) {
                        handleReject(selectedAccount.id, notes);
                        setShowDetailModal(false);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Tolak Rekening
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 border-t">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </AdminSidebar>
  );
};

export default RekeningPenjualPage;
