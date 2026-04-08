import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          🦁 <span>SAFARI</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/destinations" onClick={() => setMenuOpen(false)}>Destinations</Link>
            {isAuthenticated && (
              <Link to="/bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>
            )}
          </div>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <>
                <span className="navbar-user">👤 {user?.name}</span>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
