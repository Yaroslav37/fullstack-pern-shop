import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './components/Layout.tsx'
import Products from './components/DashboardComponents/Products.tsx'
import PromocodesManager from './components/DashboardComponents/PromoCodes.tsx'
import Purchases from './components/DashboardComponents/Purchase.tsx'
import Transactions from './components/DashboardComponents/Transactions.tsx'
import Users from './components/DashboardComponents/Users.tsx'
import LoginPage from './components/AuthComponents/LoginPage.tsx'
import RegisterPage from './components/AuthComponents/RegisterPage.tsx'
import { UserProvider } from './contexts/AuthContext.tsx'
import TopUpBalancePage from './components/ReplenishPage.tsx'
import Cart from './pages/Cart.tsx'
import ProtectedRoute from './components/ProtectedRoutes.tsx'
import UserLogs from './pages/UserLogs.tsx'
import Reviews from './pages/Reviews.tsx'
import CategoryProducts from './pages/CategoryProducts.tsx'

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/logs" element={<UserLogs />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/top-up-balance"
          element={
            <ProtectedRoute>
              <TopUpBalancePage />
            </ProtectedRoute>
          }
        />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="products" element={<Products />} />
          <Route path="promo-codes" element={<PromocodesManager />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="users" element={<Users />} />
          <Route path="purchases" element={<Purchases />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </UserProvider>
)
