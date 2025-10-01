"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, MapPin, Briefcase } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  location: string;
  job_type?: string;
  posted?: string;
  description?: string;
}

interface Company {
  id: number;
  name: string;
}

export default function CompanyJobsPage({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const t = useTranslations('jobs');
  const tCompanies = useTranslations('companies');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const companyId = parseInt(params.id);
        
        // Fetch jobs for this company
        const response = await fetch(`/api/jobs?company_id=${companyId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract jobs and company info
        if (Array.isArray(data)) {
          setJobs(data);
          if (data.length > 0 && data[0].company_name) {
            setCompany({ id: companyId, name: data[0].company_name });
          }
        } else if (data.jobs) {
          setJobs(data.jobs);
          if (data.jobs.length > 0 && data.jobs[0].company_name) {
            setCompany({ id: companyId, name: data.jobs[0].company_name });
          }
        }
        
        setError(null);
      } catch (error) {
        console.error('Error loading company jobs:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <Link href={`/${locale}/companies/${params.id}`} className="mt-4 inline-block text-blue-600 hover:underline">
            {tCompanies('backToCompany')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}/companies/${params.id}`} className="text-blue-600 hover:underline mb-4 inline-block">
            ← {tCompanies('backToCompany')}
          </Link>
          {company && (
            <h1 className="text-3xl font-bold mb-2">{tCompanies('openPositionsAt')}: {company.name}</h1>
          )}
          <p className="text-gray-600">{jobs.length} {t('results')}</p>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">{t('noResults')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/${locale}/jobs/${job.id}`} className="block p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    {job.location && (
                      <>
                        <MapPin size={16} className="mr-1" />
                        <span className="mr-4">{job.location}</span>
                      </>
                    )}
                    {job.job_type && (
                      <>
                        <Briefcase size={16} className="mr-1" />
                        <span>{job.job_type}</span>
                      </>
                    )}
                  </div>
                  
                  {job.description && (
                    <p className="text-gray-700 line-clamp-2">{job.description}</p>
                  )}
                  
                  {job.posted && (
                    <p className="text-gray-500 text-sm mt-4">{job.posted}</p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}