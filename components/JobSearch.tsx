// components/JobSearch.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Search, Briefcase, Building2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  tags: string[];
  posted: string;
}

export default function JobSearch() {
  const locale = useLocale();
  const t = useTranslations('jobs');
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    
    try {
      // FIXED: Use the enhanced search route instead of basic jobs route
      const searchParams = new URLSearchParams({
        q: query,
        language: 'all',
        limit: '50',
        page: '1'
      });
      
      const response = await fetch(`/api/jobs/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data.jobs || []);
      setSearched(true);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
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
        </div>
      </form>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">{t('searching')}</p>
        </div>
      )}

      {searched && !loading && jobs.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">{t('noResults')}</p>
          <p className="mt-2 text-gray-500">{t('tryDifferentSearch')}</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">{t('results', { count: jobs.length })}</h3>
          
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/${locale}/jobs/${job.id}`} className="block p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{job.title}</h4>
                    <div className="flex items-center mt-2 text-gray-600">
                      <Building2 size={16} className="mr-1" />
                      <span className="mr-4">{job.company}</span>
                      <MapPin size={16} className="mr-1" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.type.includes('Full') ? 'bg-blue-100 text-blue-800' : 
                    job.type.includes('Part') ? 'bg-purple-100 text-purple-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {job.type}
                  </span>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags?.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-gray-500 text-sm">{job.posted}</span>
                  <span className="font-medium text-gray-900">{job.salary}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}