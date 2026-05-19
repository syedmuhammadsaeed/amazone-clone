import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const redirect = location.state?.from?.pathname || '/';

  const submitHandler = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(credentials);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submitHandler}>
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <ErrorMessage message={error} />
        <label>
          Email
          <input
            type="email"
            value={credentials.email}
            required
            onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={credentials.password}
            required
            onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
          />
        </label>
        <button className="primary-button full" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          New customer? <Link to="/register">Create an account</Link>
        </p>
        <p className="hint">Demo admin: admin@example.com / 123456</p>
      </form>
    </section>
  );
};

export default LoginPage;
