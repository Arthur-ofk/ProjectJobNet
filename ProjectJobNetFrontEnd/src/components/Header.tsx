import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../store.ts';
import { logout } from '../slices/authSlice.ts';
import './Header.css';
import logo from '../media/logos/logo.svg'; // Assuming logo is in assets folder

function Header() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logo}  width="40" height="40" />
        </Link>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18"></path>
          </svg>
        </button>
        
        <nav className={`nav ${mobileMenuOpen ? 'nav--mobile-open' : ''}`}>
          <ul className="nav__list">
            {['Blog', 'Vacancies', 'Services'].map(label => (
              <li key={label} className="nav__item">
                <Link 
                  to={`/${label.toLowerCase()}`} 
                  className="nav__link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={`auth-actions ${mobileMenuOpen ? 'auth-actions--mobile-open' : ''}`}>
          {token ? (
            <div className="user-dropdown">
              <button 
                className="user-dropdown__toggle" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.userName} ▼
              </button>
              {dropdownOpen && (
                <div className="user-dropdown__menu">
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn--outline-light">Sign In</Link>
              <Link to="/register" className="btn btn--light">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
