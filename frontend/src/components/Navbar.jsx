import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, PackagePlus, ShoppingCart, Store, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="brand">
          <Store size={24} />
          <span>Amazon Clone</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>
            Products
          </NavLink>
          {user && (
            <NavLink to="/orders">
              <PackagePlus size={17} />
              Orders
            </NavLink>
          )}
          {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
          <NavLink to="/cart" className="cart-link">
            <ShoppingCart size={18} />
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </NavLink>
          {user ? (
            <button className="nav-button" type="button" onClick={handleLogout}>
              <LogOut size={17} />
              Logout
            </button>
          ) : (
            <NavLink to="/login">
              <UserRound size={17} />
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
