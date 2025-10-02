import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from '../utils/Web3Context';
import Navbar from '../components/Navbar';
import Dashboard from './Dashboard';
import BountyList from './BountyList';
import Profile from './Profile';
import Login from './Login';
import BugBounties from '../components/BugBounties';
import CompanyDashboard from './CompanyDashboard';
import CreateBounty from './CreateBounty';
import SubmissionDetails from './SubmissionDetails';

function App() {
  return (
    <Router>
      <Web3Provider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            {/* Hunter Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/bounties" element={<BountyList />} />
            <Route path="/submit-bug" element={<BugBounties />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            
            {/* Company Routes */}
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/create-bounty" element={<CreateBounty />} />
            <Route path="/company/submission/:submissionId" element={<SubmissionDetails />} />
          </Routes>
        </div>
      </Web3Provider>
    </Router>
  );
}

export default App; 