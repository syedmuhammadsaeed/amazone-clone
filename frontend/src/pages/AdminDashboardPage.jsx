import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Plus, Trash2 } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api from '../utils/api.js';

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [{ data: productsData }, { data: ordersData }, { data: usersData }] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
        api.get('/users')
      ]);
      setProducts(productsData.products);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const deleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts((items) => items.filter((item) => item._id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete product');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}`, { status });
      setOrders((items) => items.map((item) => (item._id === orderId ? data : item)));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update order status');
    }
  };

  const deleteCustomer = async (userId) => {
    if (!window.confirm('Delete this customer account?')) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers((items) => items.filter((item) => item._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete customer');
    }
  };

  if (loading) return <LoadingSpinner label="Loading admin dashboard" />;

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Dashboard</h1>
        </div>
        <Link to="/admin/products/new" className="primary-button">
          <Plus size={18} />
          Add Product
        </Link>
      </div>
      <ErrorMessage message={error} />

      <div className="admin-grid">
        <div className="admin-panel">
          <h2>Products</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.countInStock}</td>
                    <td className="action-cell">
                      <Link
                        className="icon-button"
                        title="Edit product"
                        to={`/admin/products/${product._id}/edit`}
                      >
                        <Edit size={17} />
                      </Link>
                      <button
                        className="icon-button danger"
                        type="button"
                        title="Delete product"
                        onClick={() => deleteProduct(product._id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <h2>All User Orders</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8)}</td>
                    <td>
                      {order.user?.name || 'Deleted user'}
                      <span className="table-subtext">{order.user?.email}</span>
                    </td>
                    <td>{order.orderItems.map((item) => `${item.name} x ${item.quantity}`).join(', ')}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(event) => updateOrderStatus(order._id, event.target.value)}
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <h2>Customer Accounts</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'Admin' : 'Customer'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.isAdmin ? (
                        <span className="admin-note">Protected</span>
                      ) : (
                        <button
                          className="icon-button danger"
                          type="button"
                          title="Delete customer account"
                          onClick={() => deleteCustomer(user._id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
