import React from 'react';
import { useWeb3 } from '../utils/Web3Context';

export default function Dashboard() {
  const { account } = useWeb3();

  const stats = [
    { name: 'Total Bounties', value: '24' },
    { name: 'Active Bounties', value: '12' },
    { name: 'Completed', value: '8' },
    { name: 'Total Value', value: '5.5 ETH' },
  ];

  const recentActivity = [
    { id: 1, type: 'Bounty Submitted', title: 'XSS Vulnerability Fix', amount: '0.5 ETH', time: '2h ago' },
    { id: 2, type: 'Bounty Claimed', title: 'SQL Injection Prevention', amount: '1.2 ETH', time: '5h ago' },
    { id: 3, type: 'New Submission', title: 'Authentication Bypass Fix', amount: '0.8 ETH', time: '1d ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform duration-200">
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">{stat.value}</dd>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-600">{activity.type}</p>
                      <p className="text-base font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {activity.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Wallet Info</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Connected Address</p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                    {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Not connected'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="text-2xl font-bold text-gray-900">2.5 ETH</p>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  View Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 