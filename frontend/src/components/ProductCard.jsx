import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import StarRating from './StarRating.jsx';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const isAdmin = Boolean(user?.isAdmin);

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img src={product.image} alt={product.name} className="product-image" />
      </Link>
      <div className="product-card-body">
        <div className="product-meta">{product.category}</div>
        <Link to={`/products/${product._id}`} className="product-title">
          {product.name}
        </Link>
        <StarRating rating={product.rating} reviews={product.numReviews} />
        <div className="product-card-footer">
          <strong>${product.price.toFixed(2)}</strong>
          {isAdmin ? (
            <span className="admin-note">Manage only</span>
          ) : (
            <button
              className="icon-button dark"
              type="button"
              title="Add to cart"
              disabled={product.countInStock === 0}
              onClick={() => addToCart(product, 1)}
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
