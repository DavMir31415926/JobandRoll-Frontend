"use client";
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Search, Briefcase, Building2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import JobFilters from '../../../components/JobFilters';

interface Job {
  id: number;
  title: string;
  company_name?: string;
  company_id?: number;
  location: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  job_type?: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  branch?: string;
  tags?: string[];
  posted?: string;
  url?: string;
  company_logo?: string;
  language: string
}

interface FilterState {
  branch: string[];
  job_type: string;
  job_type_min: string; // Add this line
  job_type_max: string; // Add this line
  experience_level: string;
  location: string;
  locationId?: number;
  radius: string;
  salary_min: string;
  language: string;
}


export default function JobsPage() {
  const locale = useLocale();
  const t = useTranslations('jobs');
  const tBase = useTranslations();
  
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 50; // Match the default in your backend
  
  // Update state for filters - branches is now an array
  const [activeFilters, setActiveFilters] = useState({
    branch: [] as string[],
    job_type: '',
    job_type_min: '10',  // Add this line
    job_type_max: '100', // Add this line
    experience_level: '',
    location: '',
    locationId: undefined,
    radius: '0',
    salary_min: '',
    language: 'all' // Add this line
  });
  
  // Helper function to translate branch names
  const translateBranchName = (branchName: string) => {
    return tBase(`branch.${branchName}`, { fallback: branchName });
  };
  
  // Combine fetchJobs function to handle both initial load and filtering
  const fetchJobs = async (searchQuery = '', filters: Partial<FilterState> = {}, page = 1) => {
    try {
      // Generate a new request ID for this fetch
      const currentRequestId = requestId + 1;
      setRequestId(currentRequestId);
      
      setLoading(true);
      
      // Build the query string
      const params = new URLSearchParams();
  
      console.log(`[Request #${currentRequestId}] Building search params with filters:`, filters);
      
      // Add pagination parameters
      params.append('page', page.toString());
      params.append('limit', jobsPerPage.toString());
      
      // Ensure we're using the filters parameter that was passed in, not activeFilters
      const languageFilter = filters.language || 'all';
      params.append('language', languageFilter);
  
      console.log(`[Request #${currentRequestId}] language parameter added:`, languageFilter);
      
      if (searchQuery) {
        params.append('q', searchQuery);
      }
      
      // Add filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        // Skip language - it's already added
        // Also skip job_type_min and job_type_max as we'll handle them specially
        if (key !== 'language' && key !== 'job_type_min' && key !== 'job_type_max') {
          if (Array.isArray(value)) {
            // Handle array values (e.g., branches)
            value.forEach(item => {
              if (item) params.append(key, String(item));
            });
          } else if (value) {
            // Handle scalar values
            params.append(key, String(value));
          }
        }
      });
  
      // Handle job type range parameters separately
      if (filters.job_type_min && filters.job_type_min !== '10') {
        params.append('job_type_min', String(filters.job_type_min));
      }
      if (filters.job_type_max && filters.job_type_max !== '100') {
        params.append('job_type_max', String(filters.job_type_max));
      }
      
      console.log(`[Request #${currentRequestId}] Final search params:`, params.toString());
  
      const response = await fetch(`/api/jobs/search?${params.toString()}`);
      
      // Check if this response is for the most recent request
      if (currentRequestId !== requestId + 1) {
        console.log(`[Request #${currentRequestId}] Ignoring stale response, current request is #${requestId + 1}`);
        return; // Don't update state with a stale response
      }
      
      // Update the request ID now that we're processing the response
      setRequestId(currentRequestId);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`[Request #${currentRequestId}] API Response:`, data);
      
      // Handle different possible data structures
      let jobsData: Job[] = [];
      
      if (Array.isArray(data)) {
        jobsData = data;
      } else if (data && Array.isArray(data.jobs)) {
        jobsData = data.jobs;
        
        // If the API returns a total count or total pages, use it
        if (data.total) {
          setTotalPages(Math.ceil(data.total / jobsPerPage));
        } else if (data.count) {
          // If we don't have a total but we have count, and count is less than jobsPerPage
          // then we know we're on the last page
          if (data.count < jobsPerPage) {
            setTotalPages(page);
          } else {
            // If we have a full page, there might be more
            setTotalPages(page + 1);
          }
        }
      } else if (data && typeof data === 'object') {
        // Log more details to help debug
        console.log(`[Request #${currentRequestId}] Response keys:`, Object.keys(data));
        
        // Try to find an array in the response
        for (const key in data) {
          if (Array.isArray(data[key])) {
            console.log(`[Request #${currentRequestId}] Found array in key: ${key}`);
            jobsData = data[key];
            break;
          }
        }
      }
      
      console.log(`[Request #${currentRequestId}] API returned jobs with languages:`, jobsData.map(job => job.language));
      
      console.log(`[Request #${currentRequestId}] Jobs data:`, jobsData);
      
      // Add this line - examine the first job object if available
      if (jobsData.length > 0) {
        console.log(`[Request #${currentRequestId}] Example job object:`, jobsData[0]);
      }
      
      setJobs(jobsData || []);
      setError(null);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Initial load of jobs
  useEffect(() => {
    console.log('Component mounted or locale/page changed, loading jobs with filters:', activeFilters);
    fetchJobs('', activeFilters, currentPage);
  }, [locale, currentPage]); 

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchJobs(query, activeFilters, 1);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    console.log('Filter changed from:', activeFilters, 'to:', newFilters);
    setActiveFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    // Use the newFilters directly here, not activeFilters, because state update is asynchronous
    fetchJobs(query, newFilters, 1);
  };
  
  // Function to render active filter badges
  const renderActiveBadges = () => {
    // Check if any filters are applied
    const hasFilters = activeFilters.branch.length > 0 || 
      activeFilters.job_type || 
      activeFilters.experience_level || 
      activeFilters.location || 
      activeFilters.salary_min ||
      (activeFilters.language && activeFilters.language !== 'all');
    
    if (!hasFilters) return null;
    
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">{t('activeFilters')}:</h3>
        <div className="flex flex-wrap gap-2">
          {/* Branch filters as multiple badges */}
          {activeFilters.branch.length > 0 && activeFilters.branch.map(branch => (
            <span key={branch} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md flex items-center">
              {t('industry')}: {translateBranchName(branch)}
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  const newBranches = activeFilters.branch.filter(b => b !== branch);
                  const newFilters = {...activeFilters, branch: newBranches};
                  setActiveFilters(newFilters);
                  fetchJobs(query, newFilters);
                }}
              >
                &times;
              </button>
            </span>
          ))}
          
          
          {(activeFilters.job_type_min !== '10' || activeFilters.job_type_max !== '100') && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md flex items-center">
              {t('jobType')}: {activeFilters.job_type_min}% - {activeFilters.job_type_max}%
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  const newFilters = {
                    ...activeFilters, 
                    job_type_min: '10',
                    job_type_max: '100'
                  };
                  setActiveFilters(newFilters);
                  fetchJobs(query, newFilters);
                }}
              >
                &times;
              </button>
            </span>
          )}
          {activeFilters.experience_level && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md flex items-center">
              {t('experienceLevel')}: {activeFilters.experience_level}
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  const newFilters = {...activeFilters, experience_level: ''};
                  setActiveFilters(newFilters);
                  fetchJobs(query, newFilters);
                }}
              >
                &times;
              </button>
            </span>
          )}
          {(activeFilters.location || activeFilters.locationId) && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md flex items-center">
              {t('location')}: {activeFilters.location}
              {activeFilters.radius && parseInt(activeFilters.radius) > 0 && (
                <span className="ml-1 text-xs bg-blue-50 px-1 rounded">±{activeFilters.radius}km</span>
              )}
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  const newFilters = {...activeFilters, location: '', locationId: undefined, radius: '0'};
                  setActiveFilters(newFilters);
                  fetchJobs(query, newFilters);
                }}
              >
                &times;
              </button>
            </span>
          )}
          {activeFilters.salary_min && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md flex items-center">
              {t('minimumSalary')}: €{Number(activeFilters.salary_min).toLocaleString()}+
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  const newFilters = {...activeFilters, salary_min: ''};
                  setActiveFilters(newFilters);
                  fetchJobs(query, newFilters);
                }}
              >
                &times;
              </button>
            </span>
          )}

          {activeFilters.language && activeFilters.language !== 'all' && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md flex items-center">
              {t('language')}: {activeFilters.language === 'Englisch' ? t('english') : 
                              activeFilters.language === 'German' ? t('german') : 
                              activeFilters.language}
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  const newFilters = {...activeFilters, language: 'all'};
                  setActiveFilters(newFilters);
                  fetchJobs(query, newFilters);
                }}
              >
                &times;
              </button>
            </span>
          )}
          
          {/* Clear all button */}
          <button
            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-md hover:bg-gray-200"
            onClick={() => {
              const clearedFilters = {
                branch: [],
                job_type: '',
                job_type_min: '10',  // Add this line
                job_type_max: '100', // Add this line
                experience_level: '',
                location: '',
                locationId: undefined,
                radius: '0',
                salary_min: '',
                language: 'all'
              };
              setActiveFilters(clearedFilters);
              fetchJobs(query, clearedFilters);
            }}
          >
            {t('clearAll')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          {t('description')}
        </p>
      </motion.div>
      
      {/* Search Form */}
      <div className="max-w-4xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex bg-white rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="flex-grow px-6 py-4 focus:outline-none text-gray-700"
          />
          <motion.button
            type="submit"
            className="bg-blue-600 text-white px-6 py-4 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <Search size={20} className="mr-2" />
            {t('search')}
          </motion.button>
        </form>
      </div>
      
      {/* Main content with filters and job listings */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <JobFilters onFilterChange={handleFilterChange} initialFilters={activeFilters} />
          </div>
          
          {/* Jobs List */}
          <div className="w-full lg:w-3/4">
            {/* Active Filters Summary */}
            {renderActiveBadges()}
            
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">{t('loading')}</p>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="text-center py-12 bg-red-50 rounded-lg">
                <p className="text-red-600">{t('error')}: {error}</p>
              </div>
            )}
            
            {/* Empty State */}
            {!loading && !error && jobs.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">{t('noResults')}</p>
                <p className="mt-2 text-gray-500">{t('tryDifferentSearch')}</p>
              </div>
            )}
            
            {/* Jobs List */}
            {!loading && !error && jobs.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6">{jobs.length} {t('results')}</h3>
                
                <div className="space-y-6">
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="block p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900">
                              <a 
                                href={job.url || `/${locale}/jobs/${job.id}`}
                                target={job.url ? "_blank" : "_self"}
                                rel={job.url ? "noopener noreferrer" : ""}
                                className="hover:text-blue-600"
                              >
                                {job.title}
                              </a>
                            </h4>
                            <div className="flex items-center mt-2 text-gray-600">
                              {job.company_name && (
                                <>
                                  <Building2 size={16} className="mr-1" />
                                  <span className="mr-4 font-medium text-blue-600">
                                    {job.company_id ? (
                                      <Link href={`/${locale}/companies/${job.company_id}`} className="hover:underline">
                                        {job.company_name}
                                      </Link>
                                    ) : (
                                      job.company_name
                                    )}
                                  </span>
                                </>
                              )}
                              
                              {job.location && (
                                <>
                                  <MapPin size={16} className="mr-1" />
                                  <span>{job.location}</span>
                                </>
                              )}
                            </div>
                            
                            {/* Display branch and language if available */}
                            {(job.branch || job.language) && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {job.branch && (
                                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                    {translateBranchName(job.branch)}
                                  </span>
                                )}
                                {job.language && (
                                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                                    {job.language === 'Englisch' ? t('english') : 
                                    job.language === 'German' ? t('german') : job.language}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {job.job_type && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              job.job_type.includes('%') ? 
                                parseInt(job.job_type) >= 80 ? 'bg-blue-100 text-blue-800' : 
                                parseInt(job.job_type) >= 50 ? 'bg-purple-100 text-purple-800' : 
                                'bg-yellow-100 text-yellow-800'
                              : job.job_type.toLowerCase().includes('full') ? 'bg-blue-100 text-blue-800' : 
                                job.job_type.toLowerCase().includes('part') ? 'bg-purple-100 text-purple-800' : 
                                job.job_type.toLowerCase().includes('remote') ? 'bg-green-100 text-green-800' :
                                job.job_type.toLowerCase().includes('contract') ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                              {job.job_type}
                            </span>
                          )}
                        </div>
                        
                        {job.tags && Array.isArray(job.tags) && job.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {job.tags.map((tag, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                          {/* Only show date if available */}
                          {job.posted && (
                            <span className="text-gray-500 text-sm">{job.posted}</span>
                          )}
                          
                          {/* Only show salary if available */}
                          {(job.salary_min || job.salary_max) && (
                            <span className="font-medium text-gray-900">
                              {(job.salary_min && job.salary_max) 
                                ? `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}`
                                : job.salary_min 
                                  ? `€${job.salary_min.toLocaleString()}+` 
                                  : job.salary_max 
                                    ? `Up to €${job.salary_max.toLocaleString()}`
                                    : ''
                              }
                            </span>
                          )}
                        </div>
                        
                        {job.url && (
                          <div className="mt-4 text-right">
                            <span className="inline-flex items-center text-blue-600 hover:text-blue-800">
                              {t('applyNow')}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {/* Add this after your jobs list, just before the closing </div> in the Jobs List section */}
            {!loading && !error && jobs.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${
                      currentPage === 1 
                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">{t('previous')}</span>
                    &larr; {t('previous')}
                  </button>
                  
                  <span className="relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700">
                    {t('page')} {currentPage} {totalPages > 0 && `/ ${totalPages}`}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={jobs.length < jobsPerPage || (totalPages > 0 && currentPage >= totalPages)}
                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${
                      jobs.length < jobsPerPage || (totalPages > 0 && currentPage >= totalPages)
                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">{t('next')}</span>
                    {t('next')} &rarr;
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}