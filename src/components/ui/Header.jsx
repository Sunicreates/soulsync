import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = ({ isAuthenticated = false, user = null, onLogin, onRegister, onSignOut }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Icon name="Heart" size={20} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SoulSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard' ?'text-primary' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/matches"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/matches' ?'text-primary' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Matches
                </Link>
                <Link
                  to="/messages"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/messages' ?'text-primary' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/profile' ?'text-primary' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/#features"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/#about"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/#pricing"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Pricing
                </Link>
              </>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {user?.full_name || 'User'}
                    </span>
                  </div>
                )}
                <button
                  onClick={onSignOut}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onRegister}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-border shadow-lg z-50">
          <div className="px-4 py-6 space-y-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-text-secondary hover:text-text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/matches"
                  className="block text-text-secondary hover:text-text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Matches
                </Link>
                <Link
                  to="/messages"
                  className="block text-text-secondary hover:text-text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="block text-text-secondary hover:text-text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                {user && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{user?.full_name || 'User'}</p>
                        <p className="text-sm text-text-secondary">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSignOut?.();
                        closeMobileMenu();
                      }}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/#features"
                  className="block text-text-secondary hover:text-text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Features
                </Link>
                <Link
                  to="/#about"
                  className="block text-text-secondary hover:text-text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
                <Link
                  to="/#pricing"
                  className="block text-text-secondary hover:text-text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Pricing
                </Link>
                <div className="pt-4 border-t border-border space-y-3">
                  <button
                    onClick={() => {
                      onLogin?.();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onRegister?.();
                      closeMobileMenu();
                    }}
                    className="btn-primary w-full text-sm"
                  >
                    Get Started
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;