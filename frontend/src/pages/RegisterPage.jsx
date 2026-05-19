import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submitHandler}>
        <p className="eyebrow">Create account</p>
        <h1>Register</h1>
        <ErrorMessage message={error} />
        <label>
          Name
          <input
            value={formData.name}
            required
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={formData.email}
            required
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            minLength="6"
            value={formData.password}
            required
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
          />
        </label>
        <button className="primary-button full" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterPage;
