"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useUser } from '@/app/context/UserContext';
import { useLocale } from 'next-intl';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building2, 
  Briefcase,
  ExternalLink,
  Trash2,
  Pin
} from 'lucide-react';

interface SavedJob {
  id: number;
  title: string;
  company_name: string;
  company_location: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  experience_level: string;
  created_at: string;
  branch: string;
  url?: string;
}

export default function SavedJobsPage() {
  const t = useTranslations('savedJobs');
  const locale = useLocale();
  const { user, token } = useUser();
  
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingJobId, setRemovingJobId] = useState<number | null>(null);
  
  useEffect(() => {
    if (user && token) {
      fetchSavedJobs();
    }
  }, [user, token]);
  
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/user/saved-jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch saved jobs');
      }
      
      setSavedJobs(data.jobs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveJob = async (jobId: number) => {
    try {
      setRemovingJobId(jobId);
      
      const response = await fetch(`/api/user/saved-jobs/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove job');
      }
      
      // Remove the job from the list
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRemovingJobId(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatSalary = (min?: number, max?: number) => {
    if (min && max) {
      return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
    } else if (min) {
      return `€${min.toLocaleString()}+`;
    }
    return t('salaryNotSpecified') || 'Salary not specified';
  };
  
  if (!user) {
    return (
      <ProtectedRoute>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">{t('loading') || 'Loading...'}</p>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="container mx-auto p-8">      
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Pin className="w-8 h-8 mr-3 text-blue-500" />
              {t('title') || 'Saved Jobs'}
            </h1>
            
            <Link 
              href="/jobs"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              {t('browseJobs') || 'Browse Jobs'}
            </Link>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">{t('loadingJobs') || 'Loading saved jobs...'}</p>
            </div>
          ) : savedJobs.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t('noSavedJobs') || 'No saved jobs yet'}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('noSavedJobsDescription') || 'Start browsing jobs and save the ones you\'re interested in!'}
              </p>
              <Link 
                href="/jobs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                {t('exploreJobs') || 'Explore Jobs'}
              </Link>
            </div>
          ) : (
            /* Jobs List */
            <div className="space-y-6">
              <p className="text-gray-600 mb-6">
                {savedJobs.length === 1 
                  ? `${t('jobCountSinglePrefix')} ${savedJobs.length} ${t('jobCountSingleSuffix')}`
                  : `${t('jobCountPluralPrefix')} ${savedJobs.length} ${t('jobCountPluralSuffix')}`
                }
              </p>
              
              {savedJobs.map((job) => (
                <div 
                  key={job.id}
                  className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Job Title and Company */}
                      <div className="mb-3">
                        <a                                             // ✅ ADD THIS LINE!
                          href={job.url || `/${locale}/jobs/${job.id}`}
                          target={job.url ? "_blank" : "_self"}
                          rel={job.url ? "noopener noreferrer" : ""}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600 flex items-center"
                        >
                          {job.title}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                        <p className="text-lg text-blue-600 flex items-center mt-1">
                          <Building2 className="w-4 h-4 mr-1" />
                          {job.company_name}
                        </p>
                      </div>
                      
                      {/* Job Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {t('posted') || 'Posted'}: {formatDate(job.created_at)}
                        </div>
                        
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {formatSalary(job.salary_min, job.salary_max)}
                        </div>
                        
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {job.job_type}
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.branch && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {job.branch}
                          </span>
                        )}
                        {job.experience_level && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {job.experience_level}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="ml-6 flex flex-col space-y-2">
                      <a
                        href={job.url || `/${locale}/jobs/${job.id}`}
                        target={job.url ? "_blank" : "_self"}
                        rel={job.url ? "noopener noreferrer" : ""}
                        className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {t('viewJob') || 'View'}
                      </a>
                      
                      <button
                        onClick={() => handleRemoveJob(job.id)}
                        disabled={removingJobId === job.id}
                        className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {removingJobId === job.id 
                          ? (t('removing') || 'Removing...') 
                          : (t('remove') || 'Remove')
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}