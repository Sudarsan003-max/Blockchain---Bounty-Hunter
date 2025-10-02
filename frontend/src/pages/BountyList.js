import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BountyList() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  const location = useLocation();
  const isCompanyView = location.pathname.startsWith('/company');

  const bounties = [
    {
      id: 1,
      title: 'Critical Security Vulnerability in Authentication',
      type: 'security',
      reward: '2.5 ETH',
      difficulty: 'Hard',
      status: 'Open',
      deadline: '2024-04-15',
      submissions: 3
    },
    // Add more bounties here
  ];

  const filterOptions = [
    { value: 'all', label: 'All Bounties' },
    { value: 'security', label: 'Security' },
    { value: 'functionality', label: 'Functionality' },
    { value: 'performance', label: 'Performance' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'highest', label: 'Highest Reward' },
    { value: 'deadline', label: 'Deadline' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Bounties</h1>
          {isCompanyView && (
            <button
              onClick={() => navigate('/company/create-bounty')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Post New Bounty
            </button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Filter by:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-md px-3 py-1.5"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-3 py-1.5"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bounties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bounties.map((bounty) => (
            <div
              key={bounty.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {bounty.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    bounty.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bounty.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-gray-900">{bounty.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reward:</span>
                    <span className="font-medium text-blue-600">{bounty.reward}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Difficulty:</span>
                    <span className="font-medium text-gray-900">{bounty.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Deadline:</span>
                    <span className="font-medium text-gray-900">{bounty.deadline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Submissions:</span>
                    <span className="font-medium text-gray-900">{bounty.submissions}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/bounty/${bounty.id}`)}
                  className="mt-6 w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 