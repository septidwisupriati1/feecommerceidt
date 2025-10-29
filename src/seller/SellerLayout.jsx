import { Outlet } from 'react-router-dom'
import SellerNavbar from './components/SellerNavbar.jsx'
import Footer from '../components/Footer.jsx'

export default function SellerLayout() {
  return (
    <>
      <SellerNavbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
