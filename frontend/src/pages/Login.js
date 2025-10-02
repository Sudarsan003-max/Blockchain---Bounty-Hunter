import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';

export default function Login() {
  const navigate = useNavigate();
  const { account, connectWallet } = useWeb3();

  const handleRoleSelect = async (role) => {
    if (!account) {
      await connectWallet();
    }
    if (role === 'company') {
      navigate('/company/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="bg-blue-600/20 inline-block p-4 rounded-2xl mb-6 backdrop-blur-sm border border-blue-500/20">
            <span className="text-blue-400 text-4xl font-bold tracking-wider">BBBB</span>
          </div>
          <h1 className="text-3xl font-bold text-white mt-6 tracking-tight">
            Welcome to Blockchain Bug Bounty
          </h1>
          <p className="mt-2 text-gray-400">Choose your role to continue</p>
        </div>

        {/* Role Selection Cards */}
        <div className="mt-10 space-y-4">
          <button
            onClick={() => handleRoleSelect('hunter')}
            className="w-full group dark-card bg-opacity-40 hover:bg-opacity-50 border border-blue-500/10 hover:border-blue-500/20"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 p-4 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <span className="text-3xl">👨‍💻</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Bug Hunter
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300">
                  Find and report vulnerabilities
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('company')}
            className="w-full group dark-card bg-opacity-40 hover:bg-opacity-50 border border-purple-500/10 hover:border-purple-500/20"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/10 p-4 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <span className="text-3xl">🏢</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                  Company
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300">
                  Create and manage bounties
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Wallet Status */}
        <div className="mt-8 text-center">
          {account ? (
            <div className="bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-xl inline-flex items-center space-x-2 border border-gray-700">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-gray-300 font-mono">
                {`${account.substring(0, 6)}...${account.substring(38)}`}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/30 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <span>🔗</span>
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 