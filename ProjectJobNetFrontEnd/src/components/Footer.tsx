import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h5>Contact Us</h5>
        <ul>
          <li>Email: support@projectjobnet.com</li>
          <li>Phone: +1 234 567 8901</li>
          <li>Address: 123 Main St, City</li>
        </ul>
      </div>
      <div className="footer-section">
        <h5>Fast Links</h5>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h5>Other</h5>
        <ul>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
