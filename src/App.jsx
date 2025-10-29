import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import NotFound from './pages/NotFound.jsx'
import Chat from './pages/Chat.jsx'
import Account from './pages/Account.jsx'
import More from './pages/More.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import SellerLayout from './seller/SellerLayout.jsx'
import SellerDashboard from './seller/Dashboard.jsx'
import SellerProducts from './seller/pages/Products.jsx'
import SellerShop from './seller/pages/Shop.jsx'
import SellerReviews from './seller/pages/Reviews.jsx'
import SellerSettings from './seller/pages/Settings.jsx'
import SellerTerms from './seller/pages/Terms.jsx'
import SellerFAQ from './seller/pages/FAQ.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/Dashboard.jsx'
import AdminAccounts from './admin/pages/Accounts.jsx'
import AdminCategories from './admin/pages/Categories.jsx'
import AdminReports from './admin/pages/Reports.jsx'
import AdminTerms from './admin/pages/Terms.jsx'
import AdminPrivacy from './admin/pages/Privacy.jsx'
import AdminFAQ from './admin/pages/FAQ.jsx'
import AdminSettings from './admin/pages/Settings.jsx'
import Training from './pages/Training.jsx'
import TalentHub from './pages/TalentHub.jsx'
import Metaverse from './pages/Metaverse.jsx'
import Login from './pages/Login.jsx'
import Notifications from './pages/Notifications.jsx'
import StorePage from './pages/StorePage.jsx'

export default function App() {
  return (
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <ChatProvider>
              <NotificationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/store/:id" element={<StorePage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/training" element={<Training />} />
              <Route path="/talent" element={<TalentHub />} />
              <Route path="/metaverse" element={<Metaverse />} />
              <Route path="/account" element={<Account />} />
              <Route path="/more" element={<More />} />
            </Route>

            

            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={<SellerDashboard />} />
              <Route path="products" element={<SellerProducts />} />
              <Route path="shop" element={<SellerShop />} />
              <Route path="reviews" element={<SellerReviews />} />
              <Route path="settings" element={<SellerSettings />} />
              <Route path="terms" element={<SellerTerms />} />
              <Route path="faq" element={<SellerFAQ />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="accounts" element={<AdminAccounts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="terms" element={<AdminTerms />} />
              <Route path="privacy" element={<AdminPrivacy />} />
              <Route path="faq" element={<AdminFAQ />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
              </NotificationProvider>
            </ChatProvider>
        </CartProvider>
      </ProductsProvider>
      </AuthProvider>
  )
}
