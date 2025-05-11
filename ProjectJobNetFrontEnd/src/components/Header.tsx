import React from 'react';
import './Header.css';
import logo from '../media/logos/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';

function Header() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase();
    }
    if (user?.userName) {
      return user.userName[0].toUpperCase();
    }
    return '?';
  };

  return (
    <header className="header">
      <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        <img src={logo} alt="ProjectJobNet Logo" className="logo-image" />
      </div>
      <nav className="nav-buttons">
        <button className="btn" onClick={() => navigate('/blog')}>Blog</button>
        {!token ? (
          <>
            <button className="btn" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>Sign Up</button>
          </>
        ) : (
          <div
            className="profile-circle"
            onClick={() => navigate('/profile')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#eaf4fb',
              color: '#245ea0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 20,
              cursor: 'pointer',
              marginLeft: 16
            }}
            title="Your profile"
          >
            {user?.profilePicUrl
              ? <img src={user.profilePicUrl} alt="profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              : getInitials()}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
