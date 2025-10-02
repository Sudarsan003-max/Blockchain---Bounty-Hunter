import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import { ethers } from 'ethers';

export default function CreateBounty() {
  const navigate = useNavigate();
  const { account, bugBounty } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    deadline: '',
    type: 'web',
    requirements: '',
    scope: ''
  });

  const bountyTypes = [
    { value: 'web', label: 'Web Security' },
    { value: 'smart-contract', label: 'Smart Contract' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'api', label: 'API Security' },
    { value: 'network', label: 'Network Security' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!bugBounty) {
        throw new Error('Contract not initialized');
      }

      // Convert reward to wei
      const rewardInWei = ethers.utils.parseEther(formData.reward);
      
      // Convert deadline to timestamp (seconds)
      const deadlineDate = new Date(formData.deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);

      // Create bounty transaction
      const tx = await bugBounty.createBounty(
        formData.title,
        formData.description,
        rewardInWei,
        deadlineTimestamp,
        formData.type,
        formData.requirements,
        formData.scope,
        { value: rewardInWei } // Send ETH with the transaction
      );

      // Wait for transaction to be mined
      await tx.wait();
      
      // Navigate to dashboard after success
      navigate('/company/dashboard');
    } catch (error) {
      console.error('Error creating bounty:', error);
      alert(error.message || 'Failed to create bounty. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="dark-card mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Create New Bounty</h1>
            <span className="text-sm text-gray-400">Connected: {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Not Connected'}</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="dark-input w-full"
                placeholder="Enter a descriptive title for the bounty"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="dark-input w-full h-32"
                placeholder="Describe the vulnerabilities you're looking for"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Reward (ETH)
                  <span className="text-sm text-gray-500 ml-2">Min: 0.01 ETH</span>
                </label>
                <input
                  type="number"
                  name="reward"
                  value={formData.reward}
                  onChange={handleChange}
                  className="dark-input w-full"
                  placeholder="0.0"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Deadline
                  <span className="text-sm text-gray-500 ml-2">Future date required</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="dark-input w-full"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Bounty Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="dark-input w-full"
                required
              >
                {bountyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="dark-input w-full h-24"
                placeholder="List specific requirements or qualifications needed"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Scope</label>
              <textarea
                name="scope"
                value={formData.scope}
                onChange={handleChange}
                className="dark-input w-full h-24"
                placeholder="Define what is in and out of scope for this bounty"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/company/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`dark-button px-6 py-3 flex items-center space-x-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  'Create Bounty'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 