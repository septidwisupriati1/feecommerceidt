import { useState, useEffect } from 'react'
import { 
  UserCircleIcon,
  KeyIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [profileData, setProfileData] = useState({
    namaLengkap: 'Admin',
    username: 'admin',
    email: 'admin@talenthub.com',
    telepon: '081234567890',
    alamat: 'Kantor Pusat TalentHub',
    kota: 'Jakarta',
    kodePos: '12345'
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
    console.log('Profile data:', profileData)
    localStorage.setItem('userProfile', JSON.stringify(profileData))
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
    
    console.log('Password change:', passwordData)
    alert('Password berhasil diubah!')
    
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
            <p>Administrator | System Manager</p>
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

          <button 
            className={`settings-menu-item ${activeSection === 'system' ? 'active' : ''}`}
            onClick={() => setActiveSection('system')}
          >
            <Cog6ToothIcon />
            <span>System Settings</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="settings-content">
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
                      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">
                        TALENT
                      </text>
                      <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">
                        HUB
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
                    placeholder="Admin"
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
                      placeholder="admin"
                      value={profileData.username}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="admin@talenthub.com"
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
                    placeholder="081234567890"
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
                    placeholder="Kantor Pusat TalentHub"
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
                      placeholder="Jakarta"
                      value={profileData.kota}
                      onChange={(e) => handleProfileChange('kota', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="kodePosProfile">Kode Pos</label>
                    <input 
                      type="text" 
                      id="kodePosProfile" 
                      placeholder="12345"
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

          {activeSection === 'system' && (
            <div className="content-section">
              <div className="section-header">
                <h2>System Settings</h2>
              </div>
              <p>Pengaturan sistem akan ditambahkan di sini...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
