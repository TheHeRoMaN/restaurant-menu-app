import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <h1>🍽️ Bella Vista Restaurant</h1>
      <nav className="header-nav">
        <Link 
          to="/menu" 
          className={location.pathname === '/menu' || location.pathname === '/' ? 'active' : ''}
        >
          Menu
        </Link>

        {!isAuthenticated ? (
          <Link 
            to="/login"
            className={location.pathname === '/login' ? 'active' : ''}
          >
            Admin Login
          </Link>
        ) : (
          <>
            <Link 
              to="/admin"
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Admin Panel
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                Welcome, {user?.username}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;