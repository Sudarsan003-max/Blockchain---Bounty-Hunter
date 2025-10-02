import React, { useState } from 'react';
import { useWeb3 } from '../utils/Web3Context';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const [activeTab, setActiveTab] = useState('submissions');

  const userStats = {
    totalEarned: '5.8 ETH',
    successRate: '85%',
    reputation: '4.8',
    completedBounties: '12'
  };

  const submissions = [
    {
      id: 1,
      bountyTitle: 'XSS Vulnerability Fix',
      status: 'Accepted',
      reward: '0.5 ETH',
      date: '2024-03-15'
    },
    // Add more submissions
  ];

  const activities = [
    {
      id: 1,
      type: 'Bounty Claimed',
      description: 'Successfully claimed reward for XSS fix',
      amount: '0.5 ETH',
      date: '2024-03-15'
    },
    // Add more activities
  ];

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white font-bold">
                  {account ? account.substring(2, 4).toUpperCase() : '??'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Not Connected'}
                </h1>
                <p className="text-gray-500">Joined March 2024</p>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Earned</p>
              <p className="text-xl font-bold text-blue-600">{userStats.totalEarned}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-xl font-bold text-green-600">{userStats.successRate}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Reputation</p>
              <p className="text-xl font-bold text-yellow-600">{userStats.reputation}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Completed Bounties</p>
              <p className="text-xl font-bold text-purple-600">{userStats.completedBounties}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
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
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activity
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'submissions' ? (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{submission.bountyTitle}</p>
                      <p className="text-sm text-gray-500">{submission.date}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        submission.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {submission.status}
                      </span>
                      <span className="font-medium text-blue-600">{submission.reward}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-600">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <span className="font-medium text-green-600">{activity.amount}</span>
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