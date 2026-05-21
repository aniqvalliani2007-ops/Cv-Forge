// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, FileText, Sparkles, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [usage, setUsage] = useState({ used: 0, limit: 3 });

  // Check if we're on landing page or dashboard
  const isLandingPage = location.pathname === '/';
  const isDashboardPage = location.pathname === '/dashboard';

  // Sections for navigation (only for landing page)
  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'design', label: 'Unique Design' },
    { id: 'testimonials', label: 'Testimonials' }
  ];

  // Fetch usage data for dashboard
  useEffect(() => {
    if (user && isDashboardPage) {
      const fetchUsage = async () => {
        // Replace with actual API call
        setUsage({ used: 0, limit: 3 });
      };
      fetchUsage();
    }
  }, [user, isDashboardPage]);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position (only for landing page)
      if (isLandingPage) {
        const scrollPosition = window.scrollY + 100;
        
        for (const section of sections) {
          const element = document.getElementById(section.id);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section.id);
              break;
            }
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage, sections]);

  const scrollToSection = (sectionId) => {
    if (!isLandingPage) return;
    
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      setActiveSection('home');
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
      setActiveSection(sectionId);
    }
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const remainingGenerations = usage.limit - usage.used;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
        : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between relative">
          {/* Logo */}
          <button 
            onClick={() => isLandingPage ? scrollToSection('home') : navigate('/dashboard')}
            className="flex items-center gap-1.5 group transition-transform hover:scale-105 active:scale-95"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 shadow-sm shadow-gray-900/20 group-hover:shadow-md group-hover:shadow-gray-900/30 transition-all duration-300">
              <FileText className="w-4 h-4 text-white" strokeWidth={2.5} />
              <Sparkles className="w-3 h-3 text-gray-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              CV<span className="text-gray-500">Forge</span>
            </span>
          </button>

          {/* Desktop Navigation - Different for Landing vs Dashboard */}
          {isLandingPage && (
            <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 md:items-center md:gap-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-sm transition-colors relative py-1 group ${
                    activeSection === section.id
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {section.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${
                    activeSection === section.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))}
            </div>
          )}

          {/* Dashboard Stats (only on dashboard) */}
          {isDashboardPage && user && (
            <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 md:items-center md:gap-2">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-3 py-1.5">
                <div className="flex items-center gap-1">
                  {[...Array(usage.limit)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full transition-all ${
                        i < usage.used ? 'bg-gray-300' : 'bg-gray-900'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {remainingGenerations} of {usage.limit} left
                </span>
              </div>
            </div>
          )}

          {/* CTA Buttons / User Menu */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {user ? (
              <>
                {/* User Menu for Dashboard */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700 hidden lg:inline">
                      {user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="rounded-md px-3 py-1.5 text-sm text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              // Landing page buttons
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-md px-4 py-1.5 text-sm font-medium text-gray-600 transition-all hover:text-gray-900"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 py-3">
            {/* Show different mobile menu based on page */}
            {isLandingPage && (
              <>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </>
            )}

            {/* Dashboard mobile menu */}
            {isDashboardPage && user && (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="text-sm text-gray-600">Free uses left</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(usage.limit)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full transition-all ${
                            i < usage.used ? 'bg-gray-300' : 'bg-gray-900'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {remainingGenerations}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      {user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="rounded-md px-3 py-1.5 text-sm text-red-600 transition-all hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Mobile menu for non-authenticated users */}
            {!user && (
              <div className="pt-3 mt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    handleGetStarted();
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-2 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;