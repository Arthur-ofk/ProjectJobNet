import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from '../slices/authSlice.ts';
import { RootState, AppDispatch } from '../store.ts';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  const [isBusiness, setIsBusiness] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // Additional business fields
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerRequest({
      email,
      password,
      username: userName,
      firstName,
      lastName,
      dateOfBirth,
      address,
      phoneNumber,
      ...(isBusiness && { companyName, companyAddress })
    }));
  };

  React.useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <h2>Sign Up - {isBusiness ? 'Business Account' : 'Personal Account'}</h2>
      <button onClick={() => setIsBusiness(b => !b)} style={{ marginBottom: 16, padding: '8px 16px', background: '#eaf4fb', color: '#245ea0', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
        Switch to {isBusiness ? 'Personal' : 'Business'} Account
      </button>
      <form onSubmit={handleSubmit}>
        {/* Form fields with consistent styling */}
        <div style={{ marginBottom: 12 }}>
          <label>Username:</label>
          <input value={userName} onChange={e => setUserName(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>First Name:</label>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Last Name:</label>
          <input value={lastName} onChange={e => setLastName(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
        </div>
        {isBusiness && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label>Company Name:</label>
              <input value={companyName} onChange={e => setCompanyName(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Company Address:</label>
              <input value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
            </div>
          </>
        )}
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password:</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Date of Birth:</label>
          <input value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} type="date" required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Address:</label>
          <input value={address} onChange={e => setAddress(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Phone Number:</label>
          <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
        </div>
        <button type="submit" disabled={loading} style={{ borderRadius: 8, padding: '10px 20px', background: '#245ea0', color: '#fff', border: 'none', width: '100%' }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        Already registered? <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
}

export default Register;
