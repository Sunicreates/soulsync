import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

import HeroSection from './components/HeroSection';
import ProfessionCards from './components/ProfessionCards';
import SocialProofSection from './components/SocialProofSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

const LandingPage = () => {
  const { user, userProfile, signIn, signUp, signOut, signInWithGitHub, authError, loading } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    profession: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    setShowLoginModal(true);
    setFormErrors({});
  };

  const handleRegister = () => {
    setShowRegisterModal(true);
    setFormErrors({});
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setFormData({ email: '', password: '', fullName: '', profession: '' });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (isLogin = false) => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.fullName) {
        errors.fullName = 'Full name is required';
      }
      if (!formData.profession) {
        errors.profession = 'Please select your profession';
      }
    }

    return errors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateForm(true);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const result = await signIn(formData.email, formData.password);
    
    if (result.success) {
      closeModals();
      navigate('/dashboard');
    } else {
      setFormErrors({ submit: result.error });
    }
    
    setIsSubmitting(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateForm(false);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const result = await signUp(formData.email, formData.password, {
      fullName: formData.fullName,
      profession: formData.profession
    });
    
    if (result.success) {
      closeModals();
      // Show success message or redirect
      navigate('/dashboard');
    } else {
      setFormErrors({ submit: result.error });
    }
    
    setIsSubmitting(false);
  };

  const handleGitHubSignIn = async () => {
    setIsSubmitting(true);
    const result = await signInWithGitHub();
    
    if (!result.success) {
      setFormErrors({ submit: result.error });
    }
    
    setIsSubmitting(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // If user is authenticated, show authenticated header
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={isAuthenticated}
        user={userProfile}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSignOut={handleSignOut}
      />
      
      <main>
        <HeroSection onGetStarted={handleRegister} />
        <ProfessionCards />
        <SocialProofSection />
        <FeaturesSection />
      </main>
      
      <Footer />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 relative animation-fade-in">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              <Icon name="X" size={20} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Heart" size={24} color="white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h2>
              <p className="text-text-secondary">Sign in to your SoulSync account</p>
            </div>

            {(authError || formErrors.submit) && (
              <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-lg">
                <p className="text-error text-sm">{authError || formErrors.submit}</p>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`input-field ${formErrors.email ? 'border-error' : ''}`}
                  disabled={isSubmitting}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-error">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`input-field ${formErrors.password ? 'border-error' : ''}`}
                  disabled={isSubmitting}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-error">{formErrors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-text-secondary">Remember me</span>
                </label>
                <Link to="#" className="text-sm text-primary hover:text-primary-700 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-text-secondary">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGitHubSignIn}
                disabled={isSubmitting}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg bg-surface hover:bg-background transition-colors"
              >
                <Icon name="Github" size={20} className="mr-2" />
                GitHub (For Developers)
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-text-secondary">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                  className="text-primary hover:text-primary-700 font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 relative animation-fade-in">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              <Icon name="X" size={20} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Heart" size={24} color="white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Join SoulSync</h2>
              <p className="text-text-secondary">Create your professional matchmaking profile</p>
            </div>

            {(authError || formErrors.submit) && (
              <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-lg">
                <p className="text-error text-sm">{authError || formErrors.submit}</p>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`input-field ${formErrors.fullName ? 'border-error' : ''}`}
                  disabled={isSubmitting}
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-sm text-error">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`input-field ${formErrors.email ? 'border-error' : ''}`}
                  disabled={isSubmitting}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-error">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Profession
                </label>
                <select 
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.profession ? 'border-error' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="">Select your profession</option>
                  <option value="developer">Developer</option>
                  <option value="doctor">Doctor</option>
                  <option value="founder">Founder</option>
                </select>
                {formErrors.profession && (
                  <p className="mt-1 text-sm text-error">{formErrors.profession}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className={`input-field ${formErrors.password ? 'border-error' : ''}`}
                  disabled={isSubmitting}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-error">{formErrors.password}</p>
                )}
              </div>

              <div className="flex items-start">
                <input type="checkbox" className="mt-1 rounded border-border text-primary focus:ring-primary-500" />
                <span className="ml-2 text-sm text-text-secondary">
                  I agree to the{' '}
                  <Link to="#" className="text-primary hover:text-primary-700 transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="#" className="text-primary hover:text-primary-700 transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-text-secondary">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGitHubSignIn}
                disabled={isSubmitting}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg bg-surface hover:bg-background transition-colors"
              >
                <Icon name="Github" size={20} className="mr-2" />
                GitHub (For Developers)
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-text-secondary">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                  className="text-primary hover:text-primary-700 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;