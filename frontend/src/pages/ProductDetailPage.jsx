import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import StarRating from '../components/StarRating.jsx';
import { useCart } from '../context/CartContext.jsx';
import api from '../utils/api.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) return <LoadingSpinner label="Loading product" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="detail-layout">
      <Link to="/" className="back-link">
        Back to products
      </Link>
      <div className="detail-grid">
        <img src={product.image} alt={product.name} className="detail-image" />
        <div className="detail-content">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <StarRating rating={product.rating} reviews={product.numReviews} />
          <p className="description">{product.description}</p>
          <div className="product-facts">
            <span>Brand</span>
            <strong>{product.brand}</strong>
            <span>Stock</span>
            <strong className={product.countInStock > 0 ? 'in-stock' : 'out-stock'}>
              {product.countInStock > 0 ? `${product.countInStock} available` : 'Out of stock'}
            </strong>
            <span>Price</span>
            <strong>${product.price.toFixed(2)}</strong>
          </div>
          <div className="purchase-row">
            <label>
              Quantity
              <select
                value={quantity}
                disabled={product.countInStock === 0}
                onChange={(event) => setQuantity(Number(event.target.value))}
              >
                {[...Array(product.countInStock).keys()].slice(0, 10).map((item) => (
                  <option key={item + 1} value={item + 1}>
                    {item + 1}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="primary-button"
              type="button"
              disabled={product.countInStock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
