import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';

export default function SubmissionDetails() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { contract } = useWeb3();
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (contract && submissionId) {
      loadSubmissionDetails();
    }
  }, [contract, submissionId]);

  const loadSubmissionDetails = async () => {
    try {
      const submissionData = await contract.getSubmissionDetails(submissionId);
      setSubmission(submissionData);
    } catch (error) {
      console.error('Error loading submission details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSubmission = async () => {
    try {
      const transaction = await contract.acceptSubmission(submissionId, {
        value: submission.reward
      });
      await transaction.wait();
      navigate('/company/dashboard');
    } catch (error) {
      console.error('Error accepting submission:', error);
      alert('Failed to accept submission. Please try again.');
    }
  };

  const handleRejectSubmission = async () => {
    try {
      const transaction = await contract.rejectSubmission(submissionId, feedback);
      await transaction.wait();
      navigate('/company/dashboard');
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Failed to reject submission. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Submission not found</h2>
          <button
            onClick={() => navigate('/company/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Submission Details
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  For bounty: {submission.bountyTitle}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                submission.status === 'Accepted'
                  ? 'bg-green-100 text-green-800'
                  : submission.status === 'Rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {submission.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="space-y-6">
              {/* Submission Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Bug Description</h3>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {submission.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Severity Level</h3>
                  <p className="mt-2 text-gray-700">{submission.severity}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Reproducibility</h3>
                  <p className="mt-2 text-gray-700">{submission.reproducible ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Steps to Reproduce */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Steps to Reproduce</h3>
                <div className="mt-2 prose prose-blue">
                  <ol className="list-decimal list-inside text-gray-700">
                    {submission.stepsToReproduce.map((step, index) => (
                      <li key={index} className="mt-1">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Proof of Concept */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Proof of Concept</h3>
                <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-x-auto">
                  <code className="text-sm text-gray-700">
                    {submission.proofOfConcept}
                  </code>
                </pre>
              </div>

              {/* Suggested Fix */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Suggested Fix</h3>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {submission.suggestedFix}
                </p>
              </div>

              {/* Feedback Section */}
              {submission.status === 'Pending' && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Provide Feedback</h3>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="4"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your feedback here..."
                  ></textarea>
                </div>
              )}

              {/* Action Buttons */}
              {submission.status === 'Pending' && (
                <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
                  <button
                    onClick={() => navigate('/company/dashboard')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectSubmission}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleAcceptSubmission}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Accept & Pay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 