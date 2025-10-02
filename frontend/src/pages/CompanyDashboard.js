import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { account, contract } = useWeb3();
  const [activeTab, setActiveTab] = useState('active');
  const [bounties, setBounties] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (contract) {
      loadBounties();
      loadSubmissions();
    }
  }, [contract, account]);

  const loadBounties = async () => {
    try {
      const companyBounties = await contract.getCompanyBounties(account);
      setBounties(companyBounties);
    } catch (error) {
      console.error('Error loading bounties:', error);
    }
  };

  const loadSubmissions = async () => {
    try {
      const bountiesSubmissions = await contract.getBountySubmissions(account);
      setSubmissions(bountiesSubmissions);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSubmission = async (submissionId, reward) => {
    try {
      const transaction = await contract.acceptSubmission(submissionId, {
        value: reward
      });
      await transaction.wait();
      loadSubmissions();
    } catch (error) {
      console.error('Error accepting submission:', error);
      alert('Failed to accept submission. Please try again.');
    }
  };

  const stats = {
    totalBounties: bounties.length,
    activeBounties: bounties.filter(b => !b.completed).length,
    totalSubmissions: submissions.length,
    totalPaid: '10.5 ETH'
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <button
            onClick={() => navigate('/company/create-bounty')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Create New Bounty
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total Bounties</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalBounties}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Active Bounties</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeBounties}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total Submissions</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.totalSubmissions}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalPaid}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Bounties
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Submissions
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading...</p>
              </div>
            ) : activeTab === 'active' ? (
              <div className="space-y-6">
                {bounties.map((bounty) => (
                  <div key={bounty.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{bounty.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{bounty.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bounty.completed ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {bounty.completed ? 'Completed' : 'Active'}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Reward:</span>
                        <span className="ml-2 text-blue-600 font-medium">{bounty.reward} ETH</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Submissions:</span>
                        <span className="ml-2 font-medium">{bounty.submissionCount}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => navigate(`/company/bounty/${bounty.id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {submissions.map((submission) => (
                  <div key={submission.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.bountyTitle}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted by: {submission.hunter.substring(0, 6)}...{submission.hunter.substring(38)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        submission.accepted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {submission.accepted ? 'Accepted' : 'Pending Review'}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-700">{submission.description}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => navigate(`/company/submission/${submission.id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Details →
                      </button>
                      {!submission.accepted && (
                        <button
                          onClick={() => handleAcceptSubmission(submission.id, submission.reward)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                        >
                          Accept & Pay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 