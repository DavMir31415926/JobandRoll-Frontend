"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import { Pin } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SaveJobButtonProps {
  jobId: number;
  className?: string;
  showText?: boolean;
}

export default function SaveJobButton({ jobId, className = '', showText = true }: SaveJobButtonProps) {
  const t = useTranslations('jobs');
  const { user, token, isAuthenticated } = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if job is already saved when component mounts
  useEffect(() => {
    if (isAuthenticated && user && token) {
      checkIfJobIsSaved();
    }
  }, [isAuthenticated, user, token, jobId]);

  const checkIfJobIsSaved = async () => {
    try {
      const response = await fetch('/api/user/saved-jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const savedJobs = data.jobs || [];
        setIsSaved(savedJobs.some((job: any) => job.id === jobId));
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/user/saved-jobs/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save job');
      }

      setIsSaved(data.saved);
    } catch (err: any) {
      setError(err.message);
      console.error('Error toggling save status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't show the button for employers
  if (user?.role === 'employer') {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggleSave}
        disabled={loading}
        className={`
          flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200
          ${isSaved 
            ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' 
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-blue-200 hover:text-blue-600'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        title={isSaved ? (t('removeSaved') || 'Remove from saved') : (t('pinJob') || 'Pin job')}
      >
        <Pin 
          className={`w-5 h-5 transition-all duration-200 ${
            isSaved ? 'fill-current text-blue-500' : ''
          } ${showText ? 'mr-2' : ''}`} 
        />
        {showText && (
          <span className="font-medium">
            {loading 
              ? (t('pinning') || 'Pinning...') 
              : isSaved 
                ? (t('pinned') || 'Pinned') 
                : (t('pinJob') || 'Pin Job')
            }
          </span>
        )}
      </button>
      
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 text-red-600 text-xs rounded shadow-lg whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
}