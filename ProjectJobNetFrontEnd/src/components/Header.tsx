import React from 'react';
import './Header.css';
import logo from '../media/logos/logo.svg'; // Import the logo

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="ProjectJobNet Logo" className="logo-image" />
      </div>
      <nav className="nav-buttons">
        <button className="btn">Blog</button>
        <button className="btn">Sign In</button>
        <button className="btn btn-primary">Sign Up</button>
      </nav>
    </header>
  );
}

export default Header;
