import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from '../../components/Footer';
import CourierLogo from "../../components/CourierLogo";
import { COURIERS, getCourierByCode } from "../../data/couriers";
import { 
  TruckIcon,
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import CartSuccessToast from '../../components/CartSuccessToast';

export default function PengirimanPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    courierName: '',
    serviceName: '',
    estimationDays: '',
    price: '',
    coverageArea: '',
    description: ''
  });
  const [toast, setToast] = useState({ show: false, message: '' });

  // Update data layanan pengiriman menggunakan COURIERS dari data
  const [shippingServices, setShippingServices] = useState([
    {
      id: 1,
      courierCode: 'jne',
      courierName: 'JNE',
      services: [
        {
          id: 1,
          name: 'JNE Regular',
          estimationDays: '2-3 hari',
          price: 15000,
          coverageArea: 'Seluruh Indonesia',
          description: 'Layanan reguler dengan estimasi 2-3 hari kerja',
          isActive: true,
          totalUsed: 145
        },
        {
          id: 2,
          name: 'JNE YES',
          estimationDays: '1-2 hari',
          price: 25000,
          coverageArea: 'Kota besar Indonesia',
          description: 'Layanan express untuk pengiriman cepat',
          isActive: true,
          totalUsed: 78
        }
      ]
    },
    {
      id: 2,
      courierCode: 'sicepat',
      courierName: 'SiCepat',
      services: [
        {
          id: 3,
          name: 'SiCepat Reguler',
          estimationDays: '2-4 hari',
          price: 12000,
          coverageArea: 'Jawa, Sumatera, Bali',
          description: 'Layanan reguler ekonomis',
          isActive: true,
          totalUsed: 92
        },
        {
          id: 4,
          name: 'SiCepat Best',
          estimationDays: '1-2 hari',
          price: 20000,
          coverageArea: 'Kota besar Jawa',
          description: 'Layanan cepat dan terpercaya',
          isActive: false,
          totalUsed: 35
        }
      ]
    },
    {
      id: 3,
      courierCode: 'jnt',
      courierName: 'J&T Express',
      services: [
        {
          id: 5,
          name: 'JNT Express',
          estimationDays: '2-3 hari',
          price: 13000,
          coverageArea: 'Seluruh Indonesia',
          description: 'Pengiriman cepat dan aman',
          isActive: true,
          totalUsed: 120
        }
      ]
    },
    {
      id: 4,
      courierCode: 'pos',
      courierName: 'POS Indonesia',
      services: [
        {
          id: 6,
          name: 'Pos Reguler',
          estimationDays: '3-5 hari',
          price: 10000,
          coverageArea: 'Seluruh Indonesia',
          description: 'Layanan pos standar',
          isActive: true,
          totalUsed: 56
        }
      ]
    }
  ]);

  const filteredServices = shippingServices.map(courier => ({
    ...courier,
    services: courier.services.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courier.courierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.coverageArea.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(courier => courier.services.length > 0);

  const totalServices = shippingServices.reduce((sum, courier) => sum + courier.services.length, 0);
  const activeServices = shippingServices.reduce((sum, courier) => 
    sum + courier.services.filter(s => s.isActive).length, 0
  );

  const handleAddService = (e) => {
    e.preventDefault();
    setToast({ show: true, message: 'Layanan pengiriman baru akan ditambahkan:\n' +
          `Kurir: ${formData.courierName}\n` +
          `Layanan: ${formData.serviceName}\n` +
          `Estimasi: ${formData.estimationDays} hari\n` +
          `Harga: Rp ${formData.price}\n` +
          `Area: ${formData.coverageArea}`
    });
    setShowAddModal(false);
    setFormData({
      courierName: '',
      serviceName: '',
      estimationDays: '',
      price: '',
      coverageArea: '',
      description: ''
    });
  };

  const handleToggleActive = (courierId, serviceId) => {
    setToast({ show: true, message: `Status layanan akan diubah` });
  };

  const handleEditService = (courierId, serviceId) => {
    setToast({ show: true, message: `Edit layanan ID: ${serviceId}` });
  };

  const handleDeleteService = (courierId, serviceId) => {
    if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      setToast({ show: true, message: `Layanan ID: ${serviceId} akan dihapus` });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      <CartSuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: '' })}
      />
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Pengaturan Pengiriman
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola layanan pengiriman untuk toko Anda
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Layanan</p>
                  <h3 className="text-3xl font-bold text-gray-900">{totalServices}</h3>
                  <p className="text-sm text-blue-600 mt-1">Semua kurir</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <TruckIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Layanan Aktif</p>
                  <h3 className="text-3xl font-bold text-gray-900">{activeServices}</h3>
                  <p className="text-sm text-green-600 mt-1">Tersedia</p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Kurir</p>
                  <h3 className="text-3xl font-bold text-gray-900">{shippingServices.length}</h3>
                  <p className="text-sm text-purple-600 mt-1">Partner</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <span className="text-3xl">🚛</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari layanan pengiriman..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Add Button */}
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Tambah Layanan Pengiriman
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Services List */}
        <div className="space-y-6">
          {filteredServices.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-gray-400">
                  <TruckIcon className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Tidak ada layanan</p>
                  <p className="text-sm">Belum ada layanan pengiriman atau tidak ditemukan</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((courier) => (
              <Card key={courier.id} className="shadow-lg">
                <CardContent className="p-6">
                  {/* Courier Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <CourierLogo code={courier.courierCode} size="lg" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{courier.courierName}</h3>
                      <p className="text-sm text-gray-600">{courier.services.length} layanan tersedia</p>
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="space-y-4">
                    {courier.services.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          service.isActive 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Service Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                service.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {service.isActive ? '✓ Aktif' : '✕ Nonaktif'}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5 text-gray-600" />
                                <div>
                                  <p className="text-gray-500">Estimasi</p>
                                  <p className="font-semibold text-gray-900">{service.estimationDays}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <BanknotesIcon className="h-5 w-5 text-gray-600" />
                                <div>
                                  <p className="text-gray-500">Harga</p>
                                  <p className="font-semibold text-green-600">{formatCurrency(service.price)}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <MapPinIcon className="h-5 w-5 text-gray-600" />
                                <div>
                                  <p className="text-gray-500">Jangkauan</p>
                                  <p className="font-semibold text-gray-900">{service.coverageArea}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <TruckIcon className="h-5 w-5 text-gray-600" />
                                <div>
                                  <p className="text-gray-500">Digunakan</p>
                                  <p className="font-semibold text-blue-600">{service.totalUsed}x</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex md:flex-col gap-2">
                            <Button
                              onClick={() => handleToggleActive(courier.id, service.id)}
                              variant="outline"
                              size="sm"
                              className={service.isActive ? 'hover:bg-red-50 text-red-600' : 'hover:bg-green-50 text-green-600'}
                            >
                              {service.isActive ? (
                                <>
                                  <XCircleIcon className="h-4 w-4 mr-1" />
                                  Nonaktifkan
                                </>
                              ) : (
                                <>
                                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                                  Aktifkan
                                </>
                              )}
                            </Button>

                            <Button
                              onClick={() => handleEditService(courier.id, service.id)}
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </Button>

                            <Button
                              onClick={() => handleDeleteService(courier.id, service.id)}
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 text-red-600"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tambah Layanan Pengiriman</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Kurir
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: JNE, SiCepat, J&T"
                    value={formData.courierName}
                    onChange={(e) => setFormData({...formData, courierName: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Layanan
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: JNE Regular, SiCepat Express"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estimasi Pengiriman (hari)
                    </label>
                    <Input
                      type="text"
                      placeholder="Contoh: 2-3"
                      value={formData.estimationDays}
                      onChange={(e) => setFormData({...formData, estimationDays: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Harga (Rp)
                    </label>
                    <Input
                      type="number"
                      placeholder="15000"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Area Jangkauan
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Seluruh Indonesia, Jawa & Sumatera"
                    value={formData.coverageArea}
                    onChange={(e) => setFormData({...formData, coverageArea: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Deskripsi singkat tentang layanan ini..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Tambah Layanan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />
    </SellerSidebar>
  );
}
