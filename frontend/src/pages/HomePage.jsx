import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import api from '../utils/api.js';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (category) params.set('category', category);

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products);
        setCategories(data.categories);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadProducts, 250);
    return () => clearTimeout(timeoutId);
  }, [keyword, category]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Full-stack e-commerce lab</p>
          <h1>Shop popular products</h1>
        </div>
        <div className="filters">
          <label className="search-box">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search products"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ErrorMessage message={error} />
      {loading ? (
        <LoadingSpinner label="Loading products" />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomePage;
