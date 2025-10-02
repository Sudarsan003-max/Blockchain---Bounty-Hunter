import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';

export default function EditProfile() {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    expertise: '',
    githubHandle: '',
    twitterHandle: '',
    email: ''
  });

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
      // TODO: Add contract interaction for profile update
      console.log('Updating profile:', formData);
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="dark-card mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <span className="text-sm text-gray-400">
              Connected: {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Not Connected'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="dark-input w-full"
                placeholder="Enter your preferred username"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="dark-input w-full h-32"
                placeholder="Tell us about yourself and your expertise"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Areas of Expertise</label>
              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className="dark-input w-full"
                placeholder="e.g., Web Security, Smart Contracts, Mobile Apps"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">GitHub Handle</label>
                <input
                  type="text"
                  name="githubHandle"
                  value={formData.githubHandle}
                  onChange={handleChange}
                  className="dark-input w-full"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Twitter Handle</label>
                <input
                  type="text"
                  name="twitterHandle"
                  value={formData.twitterHandle}
                  onChange={handleChange}
                  className="dark-input w-full"
                  placeholder="@username"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Contact Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="dark-input w-full"
                placeholder="Enter your contact email"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="dark-button px-6 py-3"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 