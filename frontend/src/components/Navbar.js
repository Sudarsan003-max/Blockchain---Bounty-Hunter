import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';

export default function Navbar() {
  const { account, connectWallet } = useWeb3();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCompanyView, setIsCompanyView] = useState(location.pathname.startsWith('/company'));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hunterLinks = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/bounties', label: 'Bounties', icon: '🎯' },
    { path: '/submit-bug', label: 'Submit Bug', icon: '🐛' },
  ];

  const companyLinks = [
    { path: '/company/dashboard', label: 'Dashboard', icon: '📊' },
  ];

  const activeLinks = isCompanyView ? companyLinks : hunterLinks;

  const handleViewSwitch = (isCompany) => {
    setIsCompanyView(isCompany);
    setIsMobileMenuOpen(false);
    if (isCompany) {
      navigate('/company/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="fixed w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl z-50">
        <div className="max-w-7xl mx-auto">
          {/* Main Navbar Content */}
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              {/* Logo and Navigation */}
              <div className="flex items-center space-x-8">
                <Link 
                  to={isCompanyView ? '/company/dashboard' : '/'} 
                  className="group flex items-center space-x-2"
                >
                  <div className="bg-blue-600 p-2 rounded-lg transform group-hover:scale-110 transition-all duration-200">
                    <span className="text-white text-xl font-bold">BBBB</span>
                  </div>
                  <span className="text-white font-medium hidden sm:inline">
                    Bug Bounty Platform
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-1">
                  {activeLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all duration-200 
                        ${location.pathname === link.path
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center space-x-4">
                {/* Role Switcher */}
                <div className="hidden sm:flex p-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg shadow-inner">
                  <button
                    onClick={() => handleViewSwitch(false)}
                    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 
                      ${!isCompanyView
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                      }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>👨‍💻</span>
                      <span>Hunter</span>
                    </span>
                    {!isCompanyView && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                    )}
                  </button>
                  <button
                    onClick={() => handleViewSwitch(true)}
                    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 
                      ${isCompanyView
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                      }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>🏢</span>
                      <span>Company</span>
                    </span>
                    {isCompanyView && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                    )}
                  </button>
                </div>

                {/* Account Section */}
                {account ? (
                  <div className="hidden sm:flex items-center space-x-4">
                    <Link
                      to={isCompanyView ? '/company/profile' : '/profile'}
                      className="group relative px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-200"
                    >
                      <span className="flex items-center space-x-2 text-gray-300 group-hover:text-white">
                        <span>👤</span>
                        <span className="text-sm font-medium">Profile</span>
                      </span>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                    </Link>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-md shadow-inner">
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="font-mono text-sm text-gray-300">
                        {`${account.substring(0, 6)}...${account.substring(38)}`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg transform hover:scale-105"
                  >
                    <span>🔗</span>
                    <span className="font-medium">Connect Wallet</span>
                  </button>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} border-t border-gray-700`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {activeLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </span>
              </Link>
            ))}
            
            {/* Mobile Role Switcher */}
            <div className="px-3 py-2">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleViewSwitch(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    !isCompanyView
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>👨‍💻</span>
                    <span>Hunter Mode</span>
                  </span>
                </button>
                <button
                  onClick={() => handleViewSwitch(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isCompanyView
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>🏢</span>
                    <span>Company Mode</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Account Section */}
            {account ? (
              <div className="px-3 py-2">
                <Link
                  to={isCompanyView ? '/company/profile' : '/profile'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  <span className="flex items-center space-x-2">
                    <span>👤</span>
                    <span>Profile</span>
                  </span>
                </Link>
                <div className="mt-2 px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-md">
                  <span className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    <span className="font-mono">
                      {`${account.substring(0, 6)}...${account.substring(38)}`}
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2">
                <button
                  onClick={connectWallet}
                  className="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🔗</span>
                    <span>Connect Wallet</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Content Spacer */}
      <div className="h-[4.5rem]"></div>
    </>
  );
} 