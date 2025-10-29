import { useState } from 'react'
import { 
  UsersIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

export default function AdminAccounts() {
  const [activeSection, setActiveSection] = useState('sellers')
  const [searchQuery, setSearchQuery] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    role: 'Admin'
  })
  const [permissions, setPermissions] = useState({
    category: false,
    products: false,
    report: false,
    orders: false,
    shipment: false,
    inbox: false,
    payment: false,
    tc: false,
    blast: false,
    privacy: false,
    faq: false,
    stp: false,
    mode: false,
    rekening: false
  })
  
  const sellers = [
    { id: 1, storeName: 'abc', name: 'abc', phone: '08123', email: 'nekozuuii@gmail.com', role: 'Seller', status: 'Aktif' },
    { id: 2, storeName: 'Ahmad Amar Al-Gifari', name: "Ahmad 'Amar Al-Gifari", phone: '085933714199', email: 'ammar4t@gmail.com', role: 'Seller', status: 'Aktif' },
    { id: 3, storeName: 'CHARITY FASHION', name: 'AINY ningrum', phone: '087835291989', email: 'ainyningrum@gmail.com', role: 'Seller', status: 'Aktif' },
    { id: 4, storeName: 'Flowerista', name: 'Ajib Syah Abad', phone: '0895324885473', email: 'ajib.oktober@gmail.com', role: 'Seller', status: 'Aktif' },
    { id: 5, storeName: 'Batik Cah Ayu', name: 'Alvina Tasya', phone: '085843874841', email: 'batikcahayu236@gmail.com', role: 'Seller', status: 'Aktif' },
    { id: 6, storeName: 'OkaWO', name: 'Andy Hardiantono KW', phone: '081226146672', email: 'kundagemilangsongomaju@gmail.com', role: 'Seller', status: 'Aktif' },
  ]

  const buyers = [
    { id: 1, name: 'aaaaaaaaaa', phone: '12312', email: 'qquipp@mitigirli.me', role: 'Buyer', status: 'Aktif' },
    { id: 2, name: 'Ambarwati', phone: '081908227153', email: 'ambarwatieca72@gmail.com', role: 'Buyer', status: 'Aktif' },
    { id: 3, name: 'John Doe', phone: '081234567893', email: 'john.doe@example.com', role: 'Buyer', status: 'Aktif' },
    { id: 4, name: 'Sarah Johnson', phone: '081234567894', email: 'sarah.j@example.com', role: 'Buyer', status: 'Aktif' },
  ]

  const [admins] = useState([
    { id: 1, name: 'Super Admin', email: 'superadmin@talenthub.com', phone: '081234567890', role: 'Super Admin', status: 'Aktif' },
    { id: 2, name: 'Admin Marketing', email: 'marketing@talenthub.com', phone: '081234567891', role: 'Admin', status: 'Aktif' },
    { id: 3, name: 'Admin Support', email: 'support@talenthub.com', phone: '081234567892', role: 'Admin', status: 'Aktif' },
  ])

  const filteredSellers = sellers.filter(seller => 
    seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredBuyers = buyers.filter(buyer => 
    buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({
      username: '',
      name: '',
      email: '',
      phone: '',
      role: 'Admin'
    })
    setPermissions({
      category: false,
      products: false,
      report: false,
      orders: false,
      shipment: false,
      inbox: false,
      payment: false,
      tc: false,
      blast: false,
      privacy: false,
      faq: false,
      stp: false,
      mode: false,
      rekening: false
    })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePermissionChange = (e) => {
    setPermissions({
      ...permissions,
      [e.target.name]: e.target.checked
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    console.log('Permissions:', permissions)
    alert('Admin berhasil ditambahkan!')
    handleCloseModal()
  }

  return (
    <div className="profile-settings-page">
      {/* Header */}
      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-info">
            <h1>Kelola Akun</h1>
            <p>Manage Users & Administrators</p>
          </div>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <button 
            className={`settings-menu-item ${activeSection === 'sellers' ? 'active' : ''}`}
            onClick={() => setActiveSection('sellers')}
          >
            <ShoppingBagIcon />
            <span>Data Seller</span>
          </button>
          
          <button 
            className={`settings-menu-item ${activeSection === 'buyers' ? 'active' : ''}`}
            onClick={() => setActiveSection('buyers')}
          >
            <UsersIcon />
            <span>Data Buyer</span>
          </button>

          <button 
            className={`settings-menu-item ${activeSection === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveSection('admins')}
          >
            <ShieldCheckIcon />
            <span>Data Admin</span>
          </button>
        </aside>        {/* Content Area */}
        <main className="settings-content">
          {activeSection === 'sellers' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Data Seller</h2>
              </div>

              {/* Controls */}
              <div className="data-table-controls">
                <div className="data-table-left">
                  <label>
                    Tampilkan 
                    <select className="entries-select" value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    entri
                  </label>
                </div>
                <div className="data-table-right">
                  <button className="btn-export btn-pdf">PDF</button>
                  <button className="btn-export btn-excel">Excel</button>
                </div>
              </div>

              {/* Search */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative', maxWidth: '300px' }}>
                  <MagnifyingGlassIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.5rem', width: '100%', padding: '.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '.375rem', fontSize: '.9rem' }}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>User</th>
                      <th>Nama</th>
                      <th>Telepon</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Pilihan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSellers.map((seller, index) => (
                      <tr key={seller.id}>
                        <td>{index + 1}</td>
                        <td>{seller.storeName}</td>
                        <td>{seller.name}</td>
                        <td>{seller.phone}</td>
                        <td>{seller.email}</td>
                        <td>
                          <span className="badge badge-primary">{seller.role}</span>
                        </td>
                        <td>
                          <span className="badge badge-success">{seller.status}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-action btn-view">
                              <EyeIcon style={{ width: '16px', height: '16px' }} />
                              Lihat Toko
                            </button>
                            <button className="btn-action btn-delete">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                              Nonaktifkan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'buyers' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Data Buyer</h2>
              </div>

              {/* Controls */}
              <div className="data-table-controls">
                <div className="data-table-left">
                  <label>
                    Tampilkan 
                    <select className="entries-select" value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    entri
                  </label>
                </div>
                <div className="data-table-right">
                  <button className="btn-export btn-pdf">PDF</button>
                  <button className="btn-export btn-excel">Excel</button>
                </div>
              </div>

              {/* Search */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative', maxWidth: '300px' }}>
                  <MagnifyingGlassIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.5rem', width: '100%', padding: '.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '.375rem', fontSize: '.9rem' }}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Telepon</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Pilihan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBuyers.map((buyer, index) => (
                      <tr key={buyer.id}>
                        <td>{index + 1}</td>
                        <td>{buyer.name}</td>
                        <td>{buyer.phone}</td>
                        <td>{buyer.email}</td>
                        <td>
                          <span className="badge badge-secondary">{buyer.role}</span>
                        </td>
                        <td>
                          <span className="badge badge-success">{buyer.status}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-action btn-view">
                              <EyeIcon style={{ width: '16px', height: '16px' }} />
                              Lihat Detail
                            </button>
                            <button className="btn-action btn-delete">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                              Nonaktifkan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'admins' && (
            <div className="content-section">
              <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Data Admin</h2>
                <button className="btn btn-primary" onClick={handleOpenModal} style={{ background: '#2563eb', border: 'none', padding: '.5rem 1rem', borderRadius: '0', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                  + Tambah Data Admin
                </button>
              </div>

              {/* Controls */}
              <div className="data-table-controls">
                <div className="data-table-left">
                  <label>
                    Tampilkan 
                    <select className="entries-select" value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    entri
                  </label>
                </div>
                <div className="data-table-right">
                  <button className="btn-export btn-pdf">PDF</button>
                  <button className="btn-export btn-excel">Excel</button>
                </div>
              </div>

              {/* Search */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative', maxWidth: '300px' }}>
                  <MagnifyingGlassIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.5rem', width: '100%', padding: '.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '.375rem', fontSize: '.9rem' }}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Telepon</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Pilihan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, index) => (
                      <tr key={admin.id}>
                        <td>{index + 1}</td>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        <td>{admin.phone}</td>
                        <td>
                          <span className={`badge ${admin.role === 'Super Admin' ? 'badge-danger' : 'badge-warning'}`}>
                            {admin.role}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-success">{admin.status}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-action btn-view">
                              <EyeIcon style={{ width: '16px', height: '16px' }} />
                              Lihat Detail
                            </button>
                            <button className="btn-action btn-delete">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                              Nonaktifkan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Tambah Admin */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', borderRadius: '0' }}>
            <div className="modal-header" style={{ background: '#2563eb', color: '#fff', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '0' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Tambah Data Admin</h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              {/* Username */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: '#374151' }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan Username"
                  required
                  style={{ width: '100%', padding: '.5rem', border: '1px solid #d1d5db', borderRadius: '0', fontSize: '.9rem' }}
                />
              </div>

              {/* Nama Lengkap */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: '#374151' }}>Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan Nama Lengkap"
                  required
                  style={{ width: '100%', padding: '.5rem', border: '1px solid #d1d5db', borderRadius: '0', fontSize: '.9rem' }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: '#374151' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email"
                  required
                  style={{ width: '100%', padding: '.5rem', border: '1px solid #d1d5db', borderRadius: '0', fontSize: '.9rem' }}
                />
              </div>

              {/* Telepon */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.9rem', color: '#374151' }}>Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Masukkan Telepon"
                  required
                  style={{ width: '100%', padding: '.5rem', border: '1px solid #d1d5db', borderRadius: '0', fontSize: '.9rem' }}
                />
              </div>

              {/* Peran Admin */}
              <div style={{ marginBottom: '1rem', padding: '.75rem', background: '#eff6ff', borderRadius: '0', textAlign: 'center' }}>
                <label style={{ fontSize: '.9rem', color: '#1e40af', fontWeight: '600' }}>Peran Admin</label>
              </div>

              {/* Permissions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.75rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="category" checked={permissions.category} onChange={handlePermissionChange} />
                  CATEGORY
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="products" checked={permissions.products} onChange={handlePermissionChange} />
                  PRODUCTS
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="report" checked={permissions.report} onChange={handlePermissionChange} />
                  REPORT
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="orders" checked={permissions.orders} onChange={handlePermissionChange} />
                  ORDERS
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="shipment" checked={permissions.shipment} onChange={handlePermissionChange} />
                  SHIPMENT
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="inbox" checked={permissions.inbox} onChange={handlePermissionChange} />
                  INBOX
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="payment" checked={permissions.payment} onChange={handlePermissionChange} />
                  PAYMENT
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="tc" checked={permissions.tc} onChange={handlePermissionChange} />
                  TC
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="blast" checked={permissions.blast} onChange={handlePermissionChange} />
                  BLAST
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="privacy" checked={permissions.privacy} onChange={handlePermissionChange} />
                  PRIVACY
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="faq" checked={permissions.faq} onChange={handlePermissionChange} />
                  FAQ
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="stp" checked={permissions.stp} onChange={handlePermissionChange} />
                  STP
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="mode" checked={permissions.mode} onChange={handlePermissionChange} />
                  MODE
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}>
                  <input type="checkbox" name="rekening" checked={permissions.rekening} onChange={handlePermissionChange} />
                  REKENING
                </label>
              </div>

              {/* Password Default */}
              <div style={{ background: '#2563eb', color: '#fff', padding: '.5rem 1rem', borderRadius: '0', textAlign: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '.9rem', fontWeight: '600' }}>Password Default User Baru : 12345678</span>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '.5rem 1.5rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '0', cursor: 'pointer', fontWeight: '600' }}>
                  Tutup
                </button>
                <button type="submit" style={{ padding: '.5rem 1.5rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '0', cursor: 'pointer', fontWeight: '600' }}>
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
