// app/[locale]/jobs/[id]/page.tsx
"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Briefcase, Building2, MapPin, Calendar, ExternalLink } from 'lucide-react';
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
  url: string;
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const t = useTranslations('jobs');
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

// In your app/[locale]/jobs/[id]/page.tsx, update the useEffect with proper typing:
useEffect(() => {
  async function loadJob() {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs?locale=${locale}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      const jobId = parseInt(params.id);
      const foundJob = data.jobs.find((j: Job) => j.id === jobId);
      
      if (foundJob) {
        setJob(foundJob);
        setError(null);
      } else {
        setError(t('jobNotFound') || 'Job not found');
      }
    } catch (error) {
      console.error('Error loading job:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }
  
  loadJob();
}, [locale, params.id, t]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">{t('loading') || "Loading job..."}</p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">{error || t('jobNotFound') || "Job not found"}</p>
          <Link href={`/${locale}/jobs`} className="mt-4 inline-block text-blue-600 hover:underline">
            {t('backToJobs') || "Back to jobs"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Building2 size={18} className="mr-1" />
                <span className="mr-4">{job.company}</span>
                <MapPin size={18} className="mr-1" />
                <span>{job.location}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end">
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                job.type.includes('Full') ? 'bg-blue-100 text-blue-800' : 
                job.type.includes('Part') ? 'bg-purple-100 text-purple-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {job.type}
              </span>
              <div className="mt-2 text-gray-600 flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{job.posted}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {job.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{t('salary')}</h2>
              <span className="text-2xl font-bold text-gray-900">{job.salary}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-100">
            <p className="text-gray-700 mb-4">
              {t('redirectInfo') || "This job listing is hosted on the company's website. Click the button below to view the full job description and apply."}
            </p>
            
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {t('viewOriginal') || "View Original Job Posting"}
              <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
          
          <div className="mt-8 flex justify-between">
            <Link 
              href={`/${locale}/jobs`}
              className="text-blue-600 hover:underline flex items-center"
            >
              <span className="mr-1">←</span>
              {t('backToJobs') || "Back to jobs"}
            </Link>
            
            <Link 
              href={`/${locale}/companies/${job.company.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-blue-600 hover:underline"
            >
              {t('viewCompany') || "View Company"}
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}