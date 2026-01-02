import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { 
  FunnelIcon,
  ArrowDownTrayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const PembayaranPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Data pembayaran
  const [payments, setPayments] = useState([
    {
      id: 1,
      storeName: 'Planet Distro 2',
      dateTime: '2023-01-04 11:40:23',
      nominal: 41000,
      bankAccount: 'BANK MANDIRI - 1234567890123\n( SUMANTA )',
      status: 'Pengajuan Baru',
      statusColor: 'cyan',
      referenceNumber: ''
    },
    {
      id: 2,
      storeName: 'Planet Distro 2',
      dateTime: '2023-01-04 11:38:38',
      nominal: 9000,
      bankAccount: 'BANK MANDIRI - 1234567890123\n( SUMANTA )',
      status: 'Pengajuan Baru',
      statusColor: 'cyan',
      referenceNumber: ''
    },
    {
      id: 3,
      storeName: 'Planet Distro 2',
      dateTime: '2022-12-20 17:27:45',
      nominal: 10000,
      bankAccount: 'BANK MANDIRI - 1234567890123\n( SUMANTA )',
      status: 'Diproses',
      statusColor: 'red',
      referenceNumber: 'EC20250929000015'
    },
    {
      id: 4,
      storeName: 'Planet Distro 2',
      dateTime: '2022-12-20 17:24:45',
      nominal: 70000,
      bankAccount: 'BANK MANDIRI - 1234567890123\n( SUMANTA )',
      status: 'Diproses',
      statusColor: 'red',
      referenceNumber: 'EC20221220000014'
    },
    {
      id: 5,
      storeName: 'Planet Distro 2',
      dateTime: '2022-12-20 17:22:47',
      nominal: 50000,
      bankAccount: 'BANK MANDIRI - 1234567890123\n( SUMANTA )',
      status: 'Selesai',
      statusColor: 'green',
      referenceNumber: 'EC20221220000013'
    },
    {
      id: 6,
      storeName: 'Planet Distro 2',
      dateTime: '2022-12-13 12:03:39',
      nominal: 300000,
      bankAccount: 'BANK MANDIRI - 1234567890123\n( SUMANTA )',
      status: 'Selesai',
      statusColor: 'green',
      referenceNumber: 'EC20221219000012'
    },
    {
      id: 7,
      storeName: 'Planet Distro 2',
      dateTime: '2022-12-13 11:07:21',
      nominal: 500000,
      bankAccount: 'BANK MANDIRI - 1234567890123\n( SUMANTA )',
      status: 'Selesai',
      statusColor: 'green',
      referenceNumber: 'EC20221219000011'
    },
    {
      id: 8,
      storeName: 'Planet Distro 2',
      dateTime: '2022-12-06 12:08:44',
      nominal: 100000,
      bankAccount: 'BANK BCA - 6043990298',
      status: 'Diproses (KOCHI)',
      statusColor: 'red',
      referenceNumber: 'EC20221219000010'
    }
  ]);

  const handleApprove = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menyetujui pembayaran ini?')) {
      setPayments(payments.map(payment => 
        payment.id === id 
          ? { ...payment, status: 'Selesai', statusColor: 'green' }
          : payment
      ));
    }
  };

  const handleProcess = (id) => {
    if (window.confirm('Apakah Anda yakin ingin memproses pembayaran ini?')) {
      const referenceNumber = prompt('Masukkan No. Referensi:');
      if (referenceNumber) {
        setPayments(payments.map(payment => 
          payment.id === id 
            ? { ...payment, status: 'Diproses', statusColor: 'red', referenceNumber }
            : payment
        ));
      }
    }
  };

  const getStatusBadge = (status, color) => {
    const colorClasses = {
      cyan: 'bg-cyan-500 hover:bg-cyan-600',
      red: 'bg-red-600 hover:bg-red-700',
      green: 'bg-green-600 hover:bg-green-700'
    };
    
    return (
      <span className={`px-4 py-2 ${colorClasses[color]} text-white rounded text-sm font-semibold inline-block`}>
        {status}
      </span>
    );
  };

  const filteredPayments = payments.filter(payment => {
    const matchStatus = !selectedStatus || payment.status === selectedStatus;
    const matchSearch = !searchQuery || 
      payment.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bankAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStartDate = !startDate || new Date(payment.dateTime) >= new Date(startDate);
    const matchEndDate = !endDate || new Date(payment.dateTime) <= new Date(endDate);
    
    return matchStatus && matchSearch && matchStartDate && matchEndDate;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const handleExportData = () => {
    alert('Export data functionality');
  };

  const handleExportHistory = () => {
    alert('Export history functionality');
  };

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Pembayaran Penjual
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="bg-red-600 text-white px-6 py-4 rounded-t-xl">
            <h2 className="text-xl font-bold">Data Pembayaran Penjual</h2>
          </div>
          
          {/* Filters */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Tanggal Awal */}
              <div>
                <label className="block text-sm font-semibold text-white bg-red-600 px-4 py-2 rounded-t mb-0">
                  Tanggal Awal
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-b focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="dd/mm/yyyy"
                />
                <div className="mt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tampilkan
                  </label>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">entri</p>
                </div>
              </div>

              {/* Tanggal Akhir */}
              <div>
                <label className="block text-sm font-semibold text-white bg-red-600 px-4 py-2 rounded-t mb-0">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-b focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="dd/mm/yyyy"
                />
                <div className="mt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Cari:
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Cari..."
                  />
                </div>
              </div>

              {/* Status Penarikan */}
              <div>
                <label className="block text-sm font-semibold text-white bg-red-600 px-4 py-2 rounded-t mb-0">
                  Status Penarikan
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-b focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Semua Status</option>
                  <option value="Pengajuan Baru">Pengajuan Baru</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export Data
              </button>
              <button
                onClick={handleExportHistory}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <ClockIcon className="h-5 w-5" />
                Riwayat Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Toko</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal Penarikan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nominal (Rp.)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rekening Penarikan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">No. Referensi</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      Tidak ada data pembayaran
                    </td>
                  </tr>
                ) : (
                  filteredPayments.slice(0, entriesPerPage).map((payment, index) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-semibold">
                        {payment.storeName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{payment.dateTime}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        {formatCurrency(payment.nominal)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-line">
                        {payment.bankAccount}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {getStatusBadge(payment.status, payment.statusColor)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {payment.referenceNumber || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          {payment.status === 'Pengajuan Baru' && (
                            <button
                              onClick={() => handleProcess(payment.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-semibold"
                            >
                              Proses Pengajuan
                            </button>
                          )}
                          {payment.status === 'Diproses' && (
                            <button
                              onClick={() => handleApprove(payment.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Selesai"
                            >
                              <span className="text-2xl">✓</span>
                            </button>
                          )}
                          {payment.status === 'Selesai' && (
                            <span className="text-gray-400 text-sm">-</span>
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

        {/* Pagination Info */}
        {filteredPayments.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan 1 sampai {Math.min(entriesPerPage, filteredPayments.length)} dari {filteredPayments.length} entri
          </div>
        )}
      </div>
      <Footer />
    </AdminSidebar>
  );
};

export default PembayaranPage;
