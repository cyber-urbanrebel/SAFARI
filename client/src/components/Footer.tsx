import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <span className="footer-logo">🦁 SAFARI</span>
        <p>Explore the beauty of Kenya — from wildlife reserves to pristine beaches.</p>
      </div>
      <div className="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/destinations">Destinations</a></li>
          <li><a href="/bookings">My Bookings</a></li>
        </ul>
      </div>
      <div className="footer-contact">
        <h4>Contact</h4>
        <p>📍 Nairobi, Kenya</p>
        <p>✉️ hello@safari.co.ke</p>
        <p>📞 +254 700 000 000</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} SAFARI Kenya. Built with ❤️ for Kenyan adventures.</p>
    </div>
  </footer>
);

export default Footer;
