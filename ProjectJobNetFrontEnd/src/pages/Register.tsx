import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../slices/authSlice.ts';
import { RootState, AppDispatch } from '../store.ts';
import { useNavigate } from 'react-router-dom';

function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({
      email,
      password,
      username: userName,
      firstName,
      lastName,
      dateOfBirth,
      address,
      phoneNumber
    }));
  };

  React.useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 16, padding: 32 }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input value={userName} onChange={e => setUserName(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>First Name:</label>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Last Name:</label>
          <input value={lastName} onChange={e => setLastName(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Email:</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Password:</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} type="date" required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Address:</label>
          <input value={address} onChange={e => setAddress(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Phone Number:</label>
          <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </div>
        <button type="submit" disabled={loading} style={{ borderRadius: 8, padding: '8px 20px' }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
}

export default Register;
