import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth(); // Remove 'user' since it's not used
  const { pathname } = useLocation();
  
  return (
    <header className="header">
      <h1>🍽️ Bella Vista Restaurant</h1>
      <nav className="header-nav">
        <Link to="/menu" className={pathname === '/menu' || pathname === '/' ? 'active' : ''}>Menu</Link>
        {!isAuthenticated ? (
          <Link to="/login" className={pathname === '/login' ? 'active' : ''}>Admin Login</Link>
        ) : (
          <>
            <Link to="/admin" className={pathname === '/admin' ? 'active' : ''}>Admin Panel</Link>
            <button className="btn btn-secondary" onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
