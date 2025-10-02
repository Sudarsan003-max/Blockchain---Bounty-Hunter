import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider, useWeb3 } from './utils/Web3Context';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BountyList from './pages/BountyList';
import CreateBounty from './pages/CreateBounty';
import SubmitBug from './pages/SubmitBug';
import Profile from './pages/Profile';
import SubmissionDetails from './pages/SubmissionDetails';
import EditProfile from './pages/EditProfile';

function ProtectedRoute({ children, requiresAuth = true }) {
  const { account } = useWeb3();
  
  if (requiresAuth && !account) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-dark-primary">
          <Navbar />
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <>
                  <Dashboard />
                </>
              </ProtectedRoute>
            } />
            
            {/* Hunter Routes */}
            <Route path="/hunter/bounties" element={
              <ProtectedRoute>
                <>
                  <BountyList />
                </>
              </ProtectedRoute>
            } />
            <Route path="/submit-bug" element={
              <ProtectedRoute>
                <>
                  <SubmitBug />
                </>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <>
                  <Profile />
                </>
              </ProtectedRoute>
            } />
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <>
                  <EditProfile />
                </>
              </ProtectedRoute>
            } />

            {/* Company Routes */}
            <Route path="/company/dashboard" element={
              <ProtectedRoute>
                <>
                  <Dashboard />
                </>
              </ProtectedRoute>
            } />
            <Route path="/company/bounties" element={
              <ProtectedRoute>
                <>
                  <BountyList />
                </>
              </ProtectedRoute>
            } />
            <Route path="/company/create-bounty" element={
              <ProtectedRoute>
                <>
                  <CreateBounty />
                </>
              </ProtectedRoute>
            } />
            <Route path="/company/profile" element={
              <ProtectedRoute>
                <>
                  <Profile />
                </>
              </ProtectedRoute>
            } />
            <Route path="/company/submission/:submissionId" element={
              <ProtectedRoute>
                <>
                  <SubmissionDetails />
                </>
              </ProtectedRoute>
            } />

            {/* Redirect unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App; 