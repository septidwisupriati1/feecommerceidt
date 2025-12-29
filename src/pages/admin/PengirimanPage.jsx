import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import CourierLogo from '../../components/CourierLogo';
import { COURIERS, getCourierByCode } from '../../data/couriers';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const PengirimanPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    basePrice: '',
    contact: '',
    website: '',
    status: 'aktif'
  });

  // Data ekspedisi
  const [expeditions, setExpeditions] = useState([
    {
      id: 1,
      name: 'JNE',
      code: 'JNE',
      courierCode: 'jne',
      description: 'JNE Express - Jalur Nugraha Ekakurir',
      basePrice: 'Rp 15.000',
      contact: '021-2927-8888',
      website: 'www.jne.co.id',
      status: 'aktif',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'J&T Express',
      code: 'JNT',
      courierCode: 'jnt',
      description: 'J&T Express Indonesia',
      basePrice: 'Rp 12.000',
      contact: '021-8066-1888',
      website: 'www.jet.co.id',
      status: 'aktif',
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'SiCepat',
      code: 'SICEPAT',
      courierCode: 'sicepat',
      description: 'SiCepat Express',
      basePrice: 'Rp 13.000',
      contact: '021-5020-0050',
      website: 'www.sicepat.com',
      status: 'aktif',
      createdAt: '2024-01-16'
    },
    {
      id: 4,
      name: 'Pos Indonesia',
      code: 'POS',
      courierCode: 'pos',
      description: 'Pos Indonesia - PT Pos Indonesia',
      basePrice: 'Rp 10.000',
      contact: '1500-161',
      website: 'www.posindonesia.co.id',
      status: 'aktif',
      createdAt: '2024-01-16'
    },
    {
      id: 5,
      name: 'Anteraja',
      code: 'ANTERAJA',
      description: 'Anteraja Courier',
      basePrice: 'Rp 11.000',
      contact: '021-5088-8000',
      website: 'www.anteraja.id',
      status: 'aktif',
      createdAt: '2024-01-17'
    },
    {
      id: 6,
      name: 'Ninja Xpress',
      code: 'NINJA',
      description: 'Ninja Xpress Indonesia',
      basePrice: 'Rp 14.000',
      contact: '021-2927-1010',
      website: 'www.ninjaxpress.co',
      status: 'aktif',
      createdAt: '2024-01-17'
    },
    {
      id: 7,
      name: 'ID Express',
      code: 'IDX',
      description: 'ID Express Logistics',
      basePrice: 'Rp 13.500',
      contact: '021-8060-0088',
      website: 'www.idexpress.com',
      status: 'aktif',
      createdAt: '2024-01-18'
    }
  ]);

  const handleAddExpedition = () => {
    if (formData.name && formData.code) {
      const newExpedition = {
        id: expeditions.length + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setExpeditions([...expeditions, newExpedition]);
      setShowAddModal(false);
      setFormData({
        name: '',
        code: '',
        description: '',
        basePrice: '',
        contact: '',
        website: '',
        status: 'aktif'
      });
    }
  };

  const handleEditExpedition = () => {
    if (selectedExpedition && formData.name && formData.code) {
      setExpeditions(expeditions.map(exp => 
        exp.id === selectedExpedition.id 
          ? { ...exp, ...formData }
          : exp
      ));
      setShowEditModal(false);
      setSelectedExpedition(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        basePrice: '',
        contact: '',
        website: '',
        status: 'aktif'
      });
    }
  };

  const handleDeleteExpedition = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ekspedisi ini?')) {
      setExpeditions(expeditions.filter(exp => exp.id !== id));
    }
  };

  const openEditModal = (expedition) => {
    setSelectedExpedition(expedition);
    setFormData({
      name: expedition.name,
      code: expedition.code,
      description: expedition.description,
      basePrice: expedition.basePrice,
      contact: expedition.contact,
      website: expedition.website,
      status: expedition.status
    });
    setShowEditModal(true);
  };

  const handleToggleStatus = (id) => {
    setExpeditions(expeditions.map(exp => 
      exp.id === id 
        ? { ...exp, status: exp.status === 'aktif' ? 'non-aktif' : 'aktif' }
        : exp
    ));
  };

  const filteredExpeditions = expeditions.filter(exp =>
    exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'aktif' ? (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
        Aktif
      </span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
        Non-Aktif
      </span>
    );
  };

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Ekspedisi Pengiriman
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola ekspedisi yang bekerjasama dengan platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Add */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ekspedisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              Tambah Ekspedisi
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Ekspedisi</p>
                <p className="text-3xl font-bold text-blue-600">{expeditions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TruckIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Ekspedisi Aktif</p>
                <p className="text-3xl font-bold text-green-600">
                  {expeditions.filter(e => e.status === 'aktif').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TruckIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Ekspedisi Non-Aktif</p>
                <p className="text-3xl font-bold text-red-600">
                  {expeditions.filter(e => e.status === 'non-aktif').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TruckIcon className="h-8 w-8 text-red-600" />
              </div>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Ekspedisi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Deskripsi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Harga Dasar</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kontak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Website</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExpeditions.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      Tidak ada data ekspedisi
                    </td>
                  </tr>
                ) : (
                  filteredExpeditions.map((expedition, index) => (
                    <tr key={expedition.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CourierLogo code={expedition.courierCode} size="sm" />
                          <span className="text-sm font-semibold text-gray-900">{expedition.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-xs">
                          {expedition.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {expedition.description}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {expedition.basePrice}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{expedition.contact}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">
                        <a href={`https://${expedition.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {expedition.website}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {getStatusBadge(expedition.status)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(expedition.id)}
                            className={`p-2 rounded transition-colors ${
                              expedition.status === 'aktif' 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={expedition.status === 'aktif' ? 'Non-aktifkan' : 'Aktifkan'}
                          >
                            {expedition.status === 'aktif' ? '⭕' : '✅'}
                          </button>
                          <button
                            onClick={() => openEditModal(expedition)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpedition(expedition.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Hapus"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Tambah Ekspedisi</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: '',
                      code: '',
                      description: '',
                      basePrice: '',
                      contact: '',
                      website: '',
                      status: 'aktif'
                    });
                  }}
                  className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Ekspedisi <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: JNE Express"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kode Ekspedisi <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: JNE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Deskripsi singkat ekspedisi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga Dasar
                  </label>
                  <input
                    type="text"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Rp 15.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kontak
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: 021-xxxx-xxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: www.ekspedisi.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="non-aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: '',
                      code: '',
                      description: '',
                      basePrice: '',
                      contact: '',
                      website: '',
                      status: 'aktif'
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddExpedition}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Ekspedisi</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedExpedition(null);
                    setFormData({
                      name: '',
                      code: '',
                      description: '',
                      basePrice: '',
                      contact: '',
                      website: '',
                      status: 'aktif'
                    });
                  }}
                  className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Ekspedisi <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: JNE Express"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kode Ekspedisi <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: JNE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Deskripsi singkat ekspedisi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga Dasar
                  </label>
                  <input
                    type="text"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Rp 15.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kontak
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: 021-xxxx-xxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: www.ekspedisi.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="non-aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedExpedition(null);
                    setFormData({
                      name: '',
                      code: '',
                      description: '',
                      basePrice: '',
                      contact: '',
                      website: '',
                      status: 'aktif'
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleEditExpedition}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </AdminSidebar>
  );
};

export default PengirimanPage;
