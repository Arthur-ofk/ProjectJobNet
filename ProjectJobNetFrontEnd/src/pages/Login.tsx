import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../slices/authSlice.ts';
import { RootState, AppDispatch } from '../store.ts';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token, user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest({ email, password }));
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    }
  }, [token, user, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
            style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password:</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
            style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ borderRadius: 8, padding: '10px 20px', background: '#245ea0', color: '#fff', border: 'none', width: '100%' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        Not registered yet? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;
