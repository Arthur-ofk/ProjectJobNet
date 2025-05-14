import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Change import from login to loginRequest
import { loginRequest } from '../slices/authSlice.ts';
import { RootState, AppDispatch } from '../store.ts';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 16, padding: 32 }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ borderRadius: 8, padding: '8px 20px' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
}

export default Login;
