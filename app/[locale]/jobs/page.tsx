// app/[locale]/jobs/page.tsx
"use client";
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Search, Briefcase, Building2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  company_name?: string;  // Made optional
  company_id?: number;    // Made optional
  location: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  job_type?: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  tags?: string[];
  posted?: string;        // Added this for post date
  url?: string;
  company_logo?: string;
}

export default function JobsPage() {
  const locale = useLocale();
  const t = useTranslations('jobs');
  
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load all jobs on initial page load
    async function loadJobs() {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs?locale=${locale}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Handle different possible data structures
        let jobsData: Job[] = [];
        
        if (Array.isArray(data)) {
          jobsData = data;
        } else if (data && Array.isArray(data.jobs)) {
          jobsData = data.jobs;
        } else if (data && typeof data === 'object') {
          // Log more details to help debug
          console.log('Response keys:', Object.keys(data));
          
          // Try to find an array in the response
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`Found array in key: ${key}`);
              jobsData = data[key];
              break;
            }
          }
        }
        
        console.log('Jobs data:', jobsData);
        
        // Add this line - examine the first job object if available
        if (jobsData.length > 0) {
          console.log('Example job object:', jobsData[0]);
        }
        
        setJobs(jobsData || []);
        setError(null);
      } catch (error) {
        console.error('Error loading jobs:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    loadJobs();
  }, [locale]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs?locale=${locale}${query ? `&query=${encodeURIComponent(query)}` : ''}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search Response:', data);
      
      // Handle different possible data structures
      let jobsData: Job[] = [];
      
      if (Array.isArray(data)) {
        jobsData = data;
      } else if (data && Array.isArray(data.jobs)) {
        jobsData = data.jobs;
      } else if (data && typeof data === 'object') {
        // Try to find an array in the response
        for (const key in data) {
          if (Array.isArray(data[key])) {
            jobsData = data[key];
            break;
          }
        }
      }
      
      setJobs(jobsData || []);
      setError(null);
    } catch (error) {
      console.error('Error searching jobs:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
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
      
      {/* Filters Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h2 className="text-xl font-semibold">{t('filter')}</h2>
          <div className="flex gap-4 flex-wrap">
            <select className="bg-white border border-gray-300 rounded-md px-4 py-2">
              <option value="">{t('location')}</option>
              <option value="berlin">Berlin</option>
              <option value="munich">Munich</option>
              <option value="hamburg">Hamburg</option>
              <option value="remote">Remote</option>
            </select>
            
            <select className="bg-white border border-gray-300 rounded-md px-4 py-2">
              <option value="">{t('jobType')}</option>
              <option value="fullTime">{t('fullTime')}</option>
              <option value="partTime">{t('partTime')}</option>
              <option value="contract">{t('contract')}</option>
            </select>
          </div>
        </div>
      </div>
      
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
        <div className="max-w-4xl mx-auto">
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
                        <Building2 size={16} className="mr-1" />
                        <span className="mr-4 font-medium text-blue-600">
                          {job.company_id ? (
                            <Link href={`/${locale}/companies/${job.company_id}`} className="hover:underline">
                              {job.company_name || t('companyNotSpecified')}
                            </Link>
                          ) : (
                            job.company_name || t('companyNotSpecified')
                          )}
                        </span>
                        <MapPin size={16} className="mr-1" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.job_type && typeof job.job_type === 'string' ? (
                        job.job_type.toLowerCase().includes('full') ? 'bg-blue-100 text-blue-800' : 
                        job.job_type.toLowerCase().includes('part') ? 'bg-purple-100 text-purple-800' : 
                        'bg-green-100 text-green-800'
                      ) : 'bg-gray-100 text-gray-600'
                    }`}>
                      {job.job_type || t('typeNotSpecified')}
                    </span>
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
                    <span className="text-gray-500 text-sm">{job.posted || t('dateNotSpecified')}</span>
                    <span className="font-medium text-gray-900">
                      {(job.salary_min && job.salary_max) ? 
                        `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}` : 
                        t('salaryNotSpecified')}
                    </span>
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
    </main>
  );
}