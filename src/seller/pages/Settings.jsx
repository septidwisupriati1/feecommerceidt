import { useState, useEffect } from 'react'
import { 
  ShoppingBagIcon,
  UserCircleIcon,
  KeyIcon 
} from '@heroicons/react/24/outline'

export default function SellerSettings() {
  const [activeSection, setActiveSection] = useState('store')
  const [profileData, setProfileData] = useState({
    namaLengkap: 'Rave',
    username: 'rave',
    email: 'rave@gmail.com',
    telepon: '082277690145',
    alamat: 'Petodjo Selatan',
    kota: 'Gambir',
    kodePos: '12750'
  })
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Load profile data from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      try {
        const data = JSON.parse(storedProfile)
        setProfileData(data)
      } catch (e) {
        console.error('Error loading profile:', e)
      }
    }
  }, [])

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    // Simpan data profil
    console.log('Profile data:', profileData)
    // Sync to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData))
    // Trigger custom event untuk update navbar
    window.dispatchEvent(new Event('profileUpdated'))
    alert('Profil berhasil diperbarui!')
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    // Validasi password
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Semua field password harus diisi!')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Password baru minimal 6 karakter!')
      return
    }
    
    // Simpan password (dalam produksi, kirim ke API)
    console.log('Password change:', passwordData)
    alert('Password berhasil diubah!')
    
    // Reset form
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="profile-settings-page">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-info">
            <h1>Hai {profileData.namaLengkap}</h1>
            <p>Frontend Engineer | UI/UX Designer</p>
            <div className="profile-social">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>abdurrahman-faiz-af</span>
            </div>
          </div>
          <div className="profile-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${profileData.namaLengkap.replace(' ', '+')}&size=120&background=3b82f6&color=fff`} 
              alt="Profile" 
            />
          </div>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <button 
            className={`settings-menu-item ${activeSection === 'store' ? 'active' : ''}`}
            onClick={() => setActiveSection('store')}
          >
            <ShoppingBagIcon />
            <span>Toko Saya</span>
          </button>
          
          <button 
            className={`settings-menu-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <UserCircleIcon />
            <span>Profil Saya</span>
          </button>
          
          <button 
            className={`settings-menu-item ${activeSection === 'password' ? 'active' : ''}`}
            onClick={() => setActiveSection('password')}
          >
            <KeyIcon />
            <span>Password Saya</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="settings-content">
          {activeSection === 'store' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Toko Saya</h2>
              </div>
              
              <form className="store-form">
                {/* Nama Toko */}
                <div className="form-group-full">
                  <label htmlFor="storeName">Nama Toko</label>
                  <input 
                    type="text" 
                    id="storeName" 
                    placeholder="Planet Distro 2"
                    defaultValue="Planet Distro 2"
                  />
                </div>

                {/* Provinsi & Kabupaten */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="provinsi">Provinsi</label>
                    <select id="provinsi">
                      <option value="">Pilih Provinsi</option>
                      <option value="jawa-tengah">Jawa Tengah</option>
                      <option value="jawa-barat">Jawa Barat</option>
                      <option value="jawa-timur">Jawa Timur</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="kabupaten">Kabupaten</label>
                    <select id="kabupaten">
                      <option value="">Pilih Kab Kota</option>
                      <option value="solo">Surakarta</option>
                      <option value="semarang">Semarang</option>
                    </select>
                  </div>
                </div>

                {/* Kecamatan, Kelurahan, Kode Pos */}
                <div className="form-row-3">
                  <div className="form-group">
                    <label htmlFor="kecamatan">Kecamatan</label>
                    <select id="kecamatan">
                      <option value="">Pilih Kab Kota</option>
                      <option value="laweyan">Laweyan</option>
                      <option value="banjarsari">Banjarsari</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="kelurahan">Kelurahan</label>
                    <select id="kelurahan">
                      <option value="">Pilih Kelurahan</option>
                      <option value="sondakan">Sondakan</option>
                      <option value="penumping">Penumping</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="kodePos">Kode Pos</label>
                    <input 
                      type="text" 
                      id="kodePos" 
                      placeholder="12920"
                      defaultValue="12920"
                    />
                  </div>
                </div>

                {/* Alamat */}
                <div className="form-group-full">
                  <label htmlFor="alamat">Alamat</label>
                  <textarea 
                    id="alamat" 
                    rows="4"
                    placeholder="Jl. Karet Gusuran III No 10"
                    defaultValue="Jl. Karet Gusuran III No 10"
                  />
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary">Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Profil Saya</h2>
              </div>
              
              <form className="store-form" onSubmit={handleProfileSubmit}>
                {/* Logo Section */}
                <div className="form-logo-section">
                  <div className="form-logo">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="48" fill="#1f2937" stroke="#000" strokeWidth="2"/>
                      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="20" fontWeight="bold" fontFamily="Arial, sans-serif">
                        PLANET
                      </text>
                      <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">
                        DISTRO
                      </text>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="5,5"/>
                    </svg>
                  </div>
                </div>

                {/* Nama Lengkap */}
                <div className="form-group-full">
                  <label htmlFor="namaLengkap">Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="namaLengkap" 
                    placeholder="Rave"
                    value={profileData.namaLengkap}
                    onChange={(e) => handleProfileChange('namaLengkap', e.target.value)}
                  />
                </div>

                {/* Username & Email */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                      type="text" 
                      id="username" 
                      placeholder="rave"
                      value={profileData.username}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="rave@gmail.com"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                    />
                  </div>
                </div>

                {/* Telepon */}
                <div className="form-group-full">
                  <label htmlFor="telepon">Telepon</label>
                  <input 
                    type="tel" 
                    id="telepon" 
                    placeholder="082277690145"
                    value={profileData.telepon}
                    onChange={(e) => handleProfileChange('telepon', e.target.value)}
                  />
                </div>

                {/* Alamat */}
                <div className="form-group-full">
                  <label htmlFor="alamatProfile">Alamat</label>
                  <textarea 
                    id="alamatProfile" 
                    rows="4"
                    placeholder="Petodjo Selatan"
                    value={profileData.alamat}
                    onChange={(e) => handleProfileChange('alamat', e.target.value)}
                  />
                </div>

                {/* Kota & Kode Pos */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="kota">Kota</label>
                    <input 
                      type="text" 
                      id="kota" 
                      placeholder="Gambir"
                      value={profileData.kota}
                      onChange={(e) => handleProfileChange('kota', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="kodePosProfile">Kode Pos</label>
                    <input 
                      type="text" 
                      id="kodePosProfile" 
                      placeholder="12750"
                      value={profileData.kodePos}
                      onChange={(e) => handleProfileChange('kodePos', e.target.value)}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary">Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'password' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Password Saya</h2>
              </div>
              
              <form className="store-form" onSubmit={handlePasswordSubmit}>
                {/* Password Lama */}
                <div className="form-group-full">
                  <label htmlFor="oldPassword">Password Lama</label>
                  <input 
                    type="password" 
                    id="oldPassword" 
                    placeholder="Masukkan Password Lama..."
                    value={passwordData.oldPassword}
                    onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                  />
                </div>

                {/* Password Baru */}
                <div className="form-group-full">
                  <label htmlFor="newPassword">Password Baru</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    placeholder="Masukkan Password Baru..."
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  />
                </div>

                {/* Konfirmasi Password Baru */}
                <div className="form-group-full">
                  <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    placeholder="Masukkan Konfirmasi Password Baru..."
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setPasswordData({oldPassword: '', newPassword: '', confirmPassword: ''})}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
