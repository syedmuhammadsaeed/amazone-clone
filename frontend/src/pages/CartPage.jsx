import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import api from '../utils/api.js';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const shippingPrice = subtotal > 100 || subtotal === 0 ? 0 : 8.99;
  const taxPrice = Number((subtotal * 0.08).toFixed(2));
  const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

  const handleAddressChange = (event) => {
    setShippingAddress((value) => ({ ...value, [event.target.name]: event.target.value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setPlacingOrder(true);
    try {
      await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod: 'Cash on Delivery',
        itemsPrice: Number(subtotal.toFixed(2)),
        shippingPrice,
        taxPrice,
        totalPrice
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Cart</p>
          <h1>Review and place order</h1>
        </div>
      </div>
      <ErrorMessage message={error} />
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              Your cart is empty. <Link to="/">Browse products</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.product}>
                <img src={item.image} alt={item.name} />
                <div>
                  <Link to={`/products/${item.product}`} className="cart-name">
                    {item.name}
                  </Link>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <select
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.product, event.target.value)}
                >
                  {[...Array(item.countInStock).keys()].slice(0, 10).map((index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                <button
                  className="icon-button"
                  type="button"
                  title="Remove item"
                  onClick={() => removeFromCart(item.product)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <form className="summary-panel" onSubmit={placeOrder}>
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <strong>${shippingPrice.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <strong>${taxPrice.toFixed(2)}</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
          <h3>Shipping Address</h3>
          {['address', 'city', 'postalCode', 'country'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field === 'postalCode' ? 'Postal code' : field}
              value={shippingAddress[field]}
              required
              onChange={handleAddressChange}
            />
          ))}
          <button className="primary-button full" type="submit" disabled={placingOrder}>
            {placingOrder ? 'Placing order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CartPage;
