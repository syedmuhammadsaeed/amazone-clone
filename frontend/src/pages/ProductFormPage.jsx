import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api from '../utils/api.js';

const emptyProduct = {
  name: '',
  image: '',
  brand: '',
  category: '',
  description: '',
  price: '',
  countInStock: '',
  rating: 0,
  numReviews: 0
};

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [product, setProduct] = useState(emptyProduct);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    const loadProduct = async () => {
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
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((current) => ({ ...current, [name]: value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...product,
      price: Number(product.price),
      countInStock: Number(product.countInStock),
      rating: Number(product.rating),
      numReviews: Number(product.numReviews)
    };

    try {
      if (isEditing) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading product form" />;

  return (
    <section className="auth-page wide">
      <form className="auth-card product-form" onSubmit={submitHandler}>
        <p className="eyebrow">Admin products</p>
        <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>
        <ErrorMessage message={error} />
        <div className="form-grid">
          <label>
            Name
            <input name="name" value={product.name} required onChange={handleChange} />
          </label>
          <label>
            Brand
            <input name="brand" value={product.brand} required onChange={handleChange} />
          </label>
          <label>
            Category
            <input name="category" value={product.category} required onChange={handleChange} />
          </label>
          <label>
            Image URL
            <input name="image" value={product.image} required onChange={handleChange} />
          </label>
          <label>
            Price
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={product.price}
              required
              onChange={handleChange}
            />
          </label>
          <label>
            Stock
            <input
              name="countInStock"
              type="number"
              min="0"
              value={product.countInStock}
              required
              onChange={handleChange}
            />
          </label>
          <label>
            Rating
            <input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={product.rating}
              required
              onChange={handleChange}
            />
          </label>
          <label>
            Reviews
            <input
              name="numReviews"
              type="number"
              min="0"
              value={product.numReviews}
              required
              onChange={handleChange}
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            name="description"
            rows="5"
            value={product.description}
            required
            onChange={handleChange}
          />
        </label>
        <button className="primary-button full" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </section>
  );
};

export default ProductFormPage;
