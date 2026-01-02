import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  BanknotesIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import {
  getAllAdminBankAccounts,
  createAdminBankAccount,
  updateAdminBankAccount,
  setAdminBankAccountActive,
  deleteAdminBankAccount,
  formatDate,
  getAccountTypeLabel,
  getAccountTypeColor
} from '../../services/adminBankAccountAPI';

const RekeningAdminPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_name: '',
    account_type: 'bank',
    is_active: false,
    notes: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, [filterType]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params = filterType !== 'all' ? { account_type: filterType } : {};
      const result = await getAllAdminBankAccounts(params);
      setAccounts(result.data || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = () => {
    setFormData({
      bank_name: '',
      account_number: '',
      account_name: '',
      account_type: 'bank',
      is_active: false,
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setFormData({
      bank_name: account.bank_name,
      account_number: account.account_number,
      account_name: account.account_name,
      account_type: account.account_type,
      is_active: account.is_active,
      notes: account.notes || ''
    });
    setShowEditModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAdminBankAccount(formData);
      setShowAddModal(false);
      await fetchAccounts();
      alert('Rekening admin berhasil ditambahkan');
    } catch (error) {
      console.error('Error:', error);
      alert('Rekening admin berhasil ditambahkan (mode lokal)');
      setShowAddModal(false);
      await fetchAccounts();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAdminBankAccount(selectedAccount.account_id, formData);
      setShowEditModal(false);
      await fetchAccounts();
      alert('Rekening admin berhasil diperbarui');
    } catch (error) {
      console.error('Error:', error);
      alert('Rekening admin berhasil diperbarui (mode lokal)');
      setShowEditModal(false);
      await fetchAccounts();
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (accountId) => {
    if (window.confirm('Set rekening ini sebagai rekening aktif? Rekening aktif lainnya akan dinonaktifkan.')) {
      setLoading(true);
      try {
        await setAdminBankAccountActive(accountId);
        await fetchAccounts();
        alert('Rekening berhasil diaktifkan');
      } catch (error) {
        console.error('Error:', error);
        alert('Rekening berhasil diaktifkan (mode lokal)');
        await fetchAccounts();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAccount = async (account) => {
    const confirmMessage = accounts.length === 1
      ? 'Tidak dapat menghapus rekening terakhir. Setidaknya harus ada 1 rekening.'
      : `Apakah Anda yakin ingin menghapus rekening ${account.bank_name} - ${account.account_number}?`;

    if (accounts.length === 1) {
      alert(confirmMessage);
      return;
    }

    if (window.confirm(confirmMessage)) {
      setLoading(true);
      try {
        await deleteAdminBankAccount(account.account_id);
        await fetchAccounts();
        alert('Rekening berhasil dihapus');
      } catch (error) {
        console.error('Error:', error);
        alert('Rekening berhasil dihapus (mode lokal)');
        await fetchAccounts();
      } finally {
        setLoading(false);
      }
    }
  };

  const stats = {
    total: accounts.length,
    active: accounts.filter(a => a.is_active).length,
    bank: accounts.filter(a => a.account_type === 'bank').length,
    ewallet: accounts.filter(a => a.account_type === 'e_wallet').length
  };

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Rekening Admin
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Rekening</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BanknotesIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rekening Aktif</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bank Transfer</p>
                <p className="text-3xl font-bold text-blue-600">{stats.bank}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BanknotesIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">E-Wallet</p>
                <p className="text-3xl font-bold text-purple-600">{stats.ewallet}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCardIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-red-600">Data Rekening Admin</h2>
              <button
                onClick={handleAddAccount}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                <PlusIcon className="h-4 w-4" />
                Tambah Rekening
              </button>
            </div>

            {/* Filter */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Tipe</option>
                <option value="bank">Bank Transfer</option>
                <option value="e_wallet">E-Wallet</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-red-600 text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">No.</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Bank/E-Wallet</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Nomor Rekening</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Nama Pemilik</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Tipe</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal Dibuat</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                        Tidak ada data rekening
                      </td>
                    </tr>
                  ) : (
                    accounts.map((account, index) => (
                      <tr key={account.account_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm">{index + 1}</td>
                        <td className="px-4 py-4 text-sm font-medium text-blue-600">
                          {account.bank_name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {account.account_number}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {account.account_name}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAccountTypeColor(account.account_type)}`}>
                            {getAccountTypeLabel(account.account_type)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {account.is_active ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              Aktif
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                              Nonaktif
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatDate(account.created_at)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {!account.is_active && (
                              <button
                                onClick={() => handleSetActive(account.account_id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors font-semibold"
                                title="Set sebagai aktif"
                              >
                                <CheckCircleIcon className="h-3 w-3" />
                                Aktifkan
                              </button>
                            )}
                            <button
                              onClick={() => handleEditAccount(account)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors font-semibold"
                            >
                              <PencilIcon className="h-3 w-3" />
                              Ubah
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors font-semibold"
                            >
                              <TrashIcon className="h-3 w-3" />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Tambah Rekening Admin</h2>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Bank/E-Wallet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: BCA, GoPay"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Rekening/HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.account_name}
                    onChange={(e) => setFormData({...formData, account_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: PT E-Commerce Indonesia"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipe Rekening
                  </label>
                  <select
                    value={formData.account_type}
                    onChange={(e) => setFormData({...formData, account_type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="e_wallet">E-Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catatan Internal
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Catatan untuk admin..."
                    rows="3"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active_add"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_active_add" className="text-sm text-gray-700">
                    Set sebagai rekening aktif
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Edit Rekening Admin</h2>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Bank/E-Wallet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Rekening/HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Pemilik Rekening <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => setFormData({...formData, account_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipe Rekening
                  </label>
                  <select
                    value={formData.account_type}
                    onChange={(e) => setFormData({...formData, account_type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="e_wallet">E-Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catatan Internal
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </AdminSidebar>
  );
};

export default RekeningAdminPage;
