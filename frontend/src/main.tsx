import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import ProductDetail from './components/ProductDetail.tsx'
import Layout from './components/Layout.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Products from './pages/Products.tsx'
import PromocodesManager from './pages/PromoCodes.tsx'
import Purchases from './pages/Purchase.tsx'
import Transactions from './pages/Transactions.tsx'
import Users from './pages/Users.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="admin" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="promo-codes" element={<PromocodesManager />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="users" element={<Users />} />
        <Route path="purchases" element={<Purchases />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
