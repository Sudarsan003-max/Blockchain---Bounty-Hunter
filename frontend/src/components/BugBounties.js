import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../utils/Web3Context';
import { ethers } from 'ethers';

export default function BugBounties() {
  const { bugBounty, account } = useWeb3();
  const [bugs, setBugs] = useState([]);
  const [newBug, setNewBug] = useState({
    title: '',
    description: '',
    bountyAmount: '',
    bountyType: 'security', // security, functionality, performance
    requirements: '',
    difficultyLevel: 1
  });

  const bountyTypes = [
    { value: 'security', label: 'Security Vulnerability' },
    { value: 'functionality', label: 'Functionality Issue' },
    { value: 'performance', label: 'Performance Improvement' }
  ];

  useEffect(() => {
    if (bugBounty && account) {
      loadBugs();
    }
  }, [bugBounty, account]);

  const loadBugs = async () => {
    try {
      const userBugs = await bugBounty.getUserBugs(account);
      const bugsData = await Promise.all(
        userBugs.map(async (bugId) => {
          const bug = await bugBounty.getBug(bugId);
          return {
            id: bugId.toString(),
            title: bug.title,
            description: bug.description,
            bountyAmount: ethers.utils.formatEther(bug.bountyAmount),
            status: ['Open', 'UnderReview', 'Resolved', 'Rejected'][bug.status],
            difficultyLevel: bug.difficultyLevel.toString(),
            bountyType: bug.bountyType,
            requirements: bug.requirements
          };
        })
      );
      setBugs(bugsData);
    } catch (error) {
      console.error('Error loading bugs:', error);
    }
  };

  const handleSubmitBug = async (e) => {
    e.preventDefault();
    try {
      const tx = await bugBounty.submitBug(
        newBug.title,
        newBug.description,
        newBug.difficultyLevel,
        newBug.bountyType,
        newBug.requirements,
        {
          value: ethers.utils.parseEther(newBug.bountyAmount)
        }
      );
      await tx.wait();
      loadBugs();
      setNewBug({
        title: '',
        description: '',
        bountyAmount: '',
        bountyType: 'security',
        requirements: '',
        difficultyLevel: 1
      });
    } catch (error) {
      console.error('Error submitting bug:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bug Bounties</h2>

      {/* Submit Bug Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Submit New Bug Bounty</h3>
        <form onSubmit={handleSubmitBug}>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Bounty Title"
              value={newBug.title}
              onChange={(e) => setNewBug({...newBug, title: e.target.value})}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Bug Description"
              value={newBug.description}
              onChange={(e) => setNewBug({...newBug, description: e.target.value})}
              className="border p-2 rounded"
              rows="4"
            />
            <select
              value={newBug.bountyType}
              onChange={(e) => setNewBug({...newBug, bountyType: e.target.value})}
              className="border p-2 rounded"
            >
              {bountyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Requirements (e.g., steps to reproduce, environment details)"
              value={newBug.requirements}
              onChange={(e) => setNewBug({...newBug, requirements: e.target.value})}
              className="border p-2 rounded"
              rows="3"
            />
            <input
              type="text"
              placeholder="Bounty Amount (ETH)"
              value={newBug.bountyAmount}
              onChange={(e) => setNewBug({...newBug, bountyAmount: e.target.value})}
              className="border p-2 rounded"
            />
            <div className="flex items-center gap-2">
              <label>Difficulty Level:</label>
              <input
                type="range"
                min="1"
                max="5"
                value={newBug.difficultyLevel}
                onChange={(e) => setNewBug({...newBug, difficultyLevel: parseInt(e.target.value)})}
                className="w-full"
              />
              <span>{newBug.difficultyLevel}</span>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit Bug Bounty
            </button>
          </div>
        </form>
      </div>

      {/* Bug List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bugs.map((bug) => (
          <div key={bug.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-2">{bug.title}</h3>
            <p className="text-gray-600 mb-2">{bug.description}</p>
            <p className="mb-2">Type: {bountyTypes.find(t => t.value === bug.bountyType)?.label || bug.bountyType}</p>
            <p className="mb-2">Requirements: {bug.requirements}</p>
            <p className="mb-2">Bounty: {bug.bountyAmount} ETH</p>
            <p className="mb-2">Difficulty: {bug.difficultyLevel}/5</p>
            <p className="mb-2">
              <span className={`px-2 py-1 rounded text-sm ${
                bug.status === 'Open' ? 'bg-green-100 text-green-800' :
                bug.status === 'UnderReview' ? 'bg-yellow-100 text-yellow-800' :
                bug.status === 'Resolved' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {bug.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 