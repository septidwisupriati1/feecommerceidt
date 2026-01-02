import { useState } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import Footer from '../../components/Footer';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import mandiriLogo from '../../assets/mandiri.png';

export default function RekeningPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    branchName: ''
  });

  // Data rekening seller (akan terintegrasi dengan admin)
  const [accounts, setAccounts] = useState([
    {
      id: 2,
      bankName: 'Bank Mandiri',
      accountNumber: '9876543210',
      accountHolder: 'John Doe',
      branchName: 'KCP Jakarta Selatan',
      status: 'pending',
      isPrimary: true,
      createdAt: '2025-11-10',
      verifiedAt: null,
      verifiedBy: null
    }
  ]);

  const bankList = [
    'Bank Mandiri',
    'Bank BNI',
    'Bank BRI',
    'Bank CIMB Niaga',
    'Bank Danamon',
    'Bank Permata',
    'Bank BTN',
    'Bank Syariah Indonesia',
    'Bank Jago',
    'Bank Jenius (BTPN)',
    'Bank Neo Commerce',
    'Bank Seabank'
  ];

  const handleAddAccount = () => {
    setFormData({
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      branchName: ''
    });
    setShowAddModal(true);
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setFormData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountHolder: account.accountHolder,
      branchName: account.branchName
    });
    setShowEditModal(true);
  };

  const handleDeleteAccount = (accountId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rekening ini?')) {
      setAccounts(accounts.filter(acc => acc.id !== accountId));
    }
  };

  const handleSetPrimary = (accountId) => {
    setAccounts(accounts.map(acc => ({
      ...acc,
      isPrimary: acc.id === accountId
    })));
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    const newAccount = {
      id: Date.now(),
      ...formData,
      status: 'pending', // Status awal selalu pending, menunggu verifikasi admin
      isPrimary: accounts.length === 0,
      createdAt: new Date().toISOString().split('T')[0],
      verifiedAt: null,
      verifiedBy: null
    };
    setAccounts([...accounts, newAccount]);
    setShowAddModal(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    setAccounts(accounts.map(acc => 
      acc.id === selectedAccount.id 
        ? { ...acc, ...formData, status: 'pending' } // Status kembali ke pending setelah edit
        : acc
    ));
    setShowEditModal(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: {
        icon: CheckCircleIcon,
        text: 'Terverifikasi',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
      },
      pending: {
        icon: ExclamationTriangleIcon,
        text: 'Menunggu Verifikasi',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
      },
      rejected: {
        icon: XCircleIcon,
        text: 'Ditolak',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}>
        <Icon className={`h-4 w-4 ${config.iconColor}`} />
        {config.text}
      </span>
    );
  };

  return (
    <SellerSidebar isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Rekening Pembayaran</h1>
                <p className="text-gray-600 mt-1">Kelola rekening bank untuk menerima pembayaran</p>
              </div>
              <button
                onClick={handleAddAccount}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Rekening
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <BanknotesIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Informasi Penting</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Rekening yang ditambahkan akan diverifikasi oleh admin dalam 1-2 hari kerja</li>
                  <li>• Pastikan nama pemilik rekening sesuai dengan nama toko/penjual</li>
                  <li>• Hanya rekening terverifikasi yang dapat menerima pembayaran</li>
                  <li>• Anda dapat menandai satu rekening sebagai rekening utama</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Account List */}
          {accounts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <BanknotesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Rekening</h3>
              <p className="text-gray-600 mb-6">Tambahkan rekening bank untuk mulai menerima pembayaran</p>
              <button
                onClick={handleAddAccount}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Rekening Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {accounts.map((account) => (
                <div key={account.id} className="bg-white border rounded-lg shadow-sm">
                  {/* Header dengan Logo dan Nama Bank */}
                  <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white border rounded-lg flex items-center justify-center flex-shrink-0 p-1.5">
                        {account.bankName === 'Bank Mandiri' ? (
                          <img src={mandiriLogo} alt="Bank Mandiri" className="w-full h-full object-contain" />
                        ) : (
                          <BanknotesIcon className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{account.bankName}</h3>
                        <p className="text-xs text-gray-500">{account.isPrimary ? 'Rekening Utama' : '1 rekening terdaftar'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content - Detail Rekening */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-700">{account.accountHolder}</h4>
                            {account.status === 'verified' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded border border-green-200">
                                <CheckCircleIcon className="h-3 w-3" />
                                Aktif
                              </span>
                            ) : account.status === 'pending' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded border border-yellow-200">
                                <ExclamationTriangleIcon className="h-3 w-3" />
                                Menunggu Verifikasi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-semibold rounded border border-red-200">
                                <XCircleIcon className="h-3 w-3" />
                                Ditolak
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">Pastikan nama pemilik rekening sesuai dengan yang terdaftar</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BanknotesIcon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">No. Rekening</p>
                              <p className="font-semibold text-gray-800">{account.accountNumber}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BanknotesIcon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Cabang</p>
                              <p className="font-semibold text-gray-800">{account.branchName}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BanknotesIcon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Status</p>
                              <p className="font-semibold text-gray-800">
                                {account.status === 'verified' ? 'Terverifikasi' : 
                                 account.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        {account.status === 'verified' && (
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 text-sm font-semibold hover:bg-red-50 rounded transition-colors cursor-pointer"
                          >
                            <XCircleIcon className="h-4 w-4" />
                            Nonaktifkan
                          </button>
                        )}
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-600 text-sm font-semibold hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        {!account.isPrimary && (
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 text-sm font-semibold hover:bg-red-50 rounded transition-colors cursor-pointer"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Verification Info */}
                    {account.status === 'verified' && account.verifiedAt && (
                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Diverifikasi pada:</span> {new Date(account.verifiedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {account.verifiedBy && <span> oleh {account.verifiedBy}</span>}
                        </p>
                      </div>
                    )}

                    {account.status === 'pending' && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <span className="font-semibold">Menunggu verifikasi admin.</span> Rekening ini akan segera diverifikasi dalam 1-2 hari kerja.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Tambah Rekening Baru</h2>
              <p className="text-sm text-gray-600 mt-1">Isi data rekening dengan lengkap dan benar</p>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Bank <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Bank</option>
                    {bankList.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Rekening <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value.replace(/\D/g, '')})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: 1234567890"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Pemilik Rekening <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({...formData, accountHolder: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sesuai dengan KTP"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Harus sesuai dengan nama pemilik toko</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Cabang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => setFormData({...formData, branchName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: KCP Jakarta Pusat"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
                >
                  Tambah Rekening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditModal && selectedAccount && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Edit Rekening</h2>
              <p className="text-sm text-gray-600 mt-1">Perubahan akan menunggu verifikasi admin kembali</p>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Bank <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Bank</option>
                    {bankList.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Rekening <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value.replace(/\D/g, '')})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: 1234567890"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Pemilik Rekening <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({...formData, accountHolder: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sesuai dengan KTP"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Cabang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => setFormData({...formData, branchName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: KCP Jakarta Pusat"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </SellerSidebar>
  );
}
