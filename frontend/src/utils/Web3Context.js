import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import EduChainArtifact from '../artifacts/contracts/EduChain.sol/EduChain.json';
import BugBountyArtifact from '../artifacts/contracts/bug_bounty.sol/BugBounty.json';
import contractAddresses from '../contracts/addresses.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);
  const [eduChain, setEduChain] = useState(null);
  const [bugBounty, setBugBounty] = useState(null);
  const [loading, setLoading] = useState(true);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
      // Create ethers provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setAccount(account);
      setProvider(provider);
      setSigner(signer);
      setError(null);

      // Initialize EduChain and BugBounty contracts
      const eduChainContract = new ethers.Contract(
        contractAddresses.eduChain,
        EduChainArtifact.abi,
        signer
      );

      const bugBountyContract = new ethers.Contract(
        contractAddresses.bugBounty,
        BugBountyArtifact.abi,
        signer
      );

      setEduChain(eduChainContract);
      setBugBounty(bugBountyContract);

      return account;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
      return null;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setEduChain(null);
    setBugBounty(null);
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const contextValue = {
    account,
    provider,
    signer,
    error,
    connectWallet,
    disconnectWallet,
    eduChain,
    bugBounty,
    loading
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
} 