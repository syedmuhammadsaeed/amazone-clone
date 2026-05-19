import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import CartPage from './pages/CartPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

const App = () => (
  <>
    <Navbar />
    <main className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute customerOnly />}>
          <Route path="/orders" element={<OrderHistoryPage />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products/new" element={<ProductFormPage />} />
          <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
        </Route>
      </Routes>
    </main>
  </>
);

export default App;
