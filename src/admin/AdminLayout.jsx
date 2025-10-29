import { Outlet } from 'react-router-dom'
import AdminNavbar from './components/AdminNavbar.jsx'
import Footer from '../components/Footer.jsx'

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
