import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';

export default function SubmitBug() {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const [formData, setFormData] = useState({
    bountyId: '',
    title: '',
    description: '',
    severity: 'low',
    proofOfConcept: '',
    stepsToReproduce: '',
    suggestedFix: ''
  });

  const severityLevels = [
    { value: 'critical', label: 'Critical', color: 'text-red-500' },
    { value: 'high', label: 'High', color: 'text-orange-500' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    { value: 'low', label: 'Low', color: 'text-blue-500' }
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
    try {
      // TODO: Add contract interaction here
      console.log('Submitting bug:', formData);
      navigate('/bounties');
    } catch (error) {
      console.error('Error submitting bug:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="dark-card mb-8">
          <h1 className="text-2xl font-bold text-white mb-6">Submit Bug Report</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Bounty ID</label>
              <input
                type="text"
                name="bountyId"
                value={formData.bountyId}
                onChange={handleChange}
                className="dark-input w-full"
                placeholder="Enter the bounty ID"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Bug Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="dark-input w-full"
                placeholder="Enter a descriptive title for the bug"
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
                placeholder="Provide a detailed description of the bug"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Severity Level</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="dark-input w-full"
                required
              >
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value} className={level.color}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Proof of Concept</label>
              <textarea
                name="proofOfConcept"
                value={formData.proofOfConcept}
                onChange={handleChange}
                className="dark-input w-full h-32"
                placeholder="Provide code, screenshots, or other evidence of the bug"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Steps to Reproduce</label>
              <textarea
                name="stepsToReproduce"
                value={formData.stepsToReproduce}
                onChange={handleChange}
                className="dark-input w-full h-32"
                placeholder="List detailed steps to reproduce the bug"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Suggested Fix</label>
              <textarea
                name="suggestedFix"
                value={formData.suggestedFix}
                onChange={handleChange}
                className="dark-input w-full h-32"
                placeholder="(Optional) Suggest how this bug could be fixed"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/bounties')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="dark-button px-6 py-3"
              >
                Submit Bug Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 