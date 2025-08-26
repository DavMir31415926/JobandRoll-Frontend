"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import { 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Globe,
  Calendar,
  Edit,
  ExternalLink,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function JobDetailPage() {
  const t = useTranslations('postJob');
  const tBranch = useTranslations('branch');
  const tCommon = useTranslations('common');
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  
  const [job, setJob] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Job not found');
            return;
          }
          throw new Error('Failed to fetch job');
        }
        
        const data = await response.json();
        setJob(data.job);
        
        // Fetch company details if company_id exists
        if (data.job.company_id) {
          const companyResponse = await fetch(`/api/companies/${data.job.company_id}`);
          if (companyResponse.ok) {
            const companyData = await companyResponse.json();
            setCompany(companyData.company);
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="container mx-auto p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">{t('loading') || 'Loading job details...'}</p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="container mx-auto p-8">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => router.push('/jobs')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </main>
    );
  }

  // Check if current user owns this job (for showing edit button)
  const isOwner = user && job.user_id && user.id === job.user_id;

  // Translate experience levels
  const translateExperienceLevel = (level: string) => {
    const levelKey = level.replace(' ', '');
    return t(`experienceLevels.${level}`) || level;
  };

  const formatSalary = (min: number, max: number) => {
    if (min && max) {
      return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
    } else if (min) {
      return `From €${min.toLocaleString()}`;
    } else if (max) {
      return `Up to €${max.toLocaleString()}`;
    }
    return null;
  };

  return (
    <main className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
              {company && (
                <div className="flex items-center text-gray-600 mb-2">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="text-lg font-semibold">{company.name}</span>
                </div>
              )}
            </div>
            
            {/* Edit button for job owner */}
            {isOwner && (
              <Link
                href={`/jobs/${job.id}/edit`}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                {t('editJob') || 'Edit Job'}
              </Link>
            )}
          </div>

          {/* Job Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{job.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>{tBranch(job.branch) || job.branch}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{job.job_type}</span>
            </div>
            
            {job.experience_level && (
              <div className="flex items-center text-gray-600">
                <span className="w-4 h-4 mr-2">📊</span>
                <span>{translateExperienceLevel(job.experience_level)}</span>
              </div>
            )}
          </div>

          {/* Salary */}
          {(job.salary_min || job.salary_max) && (
            <div className="flex items-center text-gray-600 mb-4">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="font-semibold">{formatSalary(job.salary_min, job.salary_max)}</span>
            </div>
          )}

          {/* Language */}
          {job.language && (
            <div className="flex items-center text-gray-600 mb-4">
              <Globe className="w-4 h-4 mr-2" />
              <span>{t(`languages.${job.language}`) || job.language}</span>
            </div>
          )}

          {/* Posted Date */}
          {job.created_at && (
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{t('posted') || 'Posted'} {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Company Description */}
        {job.company_description && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">{t('aboutTheCompany') || 'About the Company'}</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.company_description}</p>
          </div>
        )}

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">{t('jobDescription') || 'Job Description'}</h2>
          <div className="text-gray-700 whitespace-pre-wrap">{job.description}</div>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">{t('requirements') || 'Requirements'}</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{job.requirements}</div>
          </div>
        )}

        {/* Benefits */}
        {job.benefits && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">{t('benefits') || 'Benefits'}</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{job.benefits}</div>
          </div>
        )}

        {/* Company Details */}
        {company && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">{t('companyDetails') || 'Company Details'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  <strong>{t('industry') || 'Industry'}:</strong> {tBranch(company.industry) || company.industry}
                </p>
                <p className="text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  <strong>{t('location') || 'Location'}:</strong> {company.location}
                </p>
              </div>
              {company.description && (
                <div>
                  <p className="text-gray-700">{company.description}</p>
                </div>
              )}
            </div>
            
            {company.website && (
              <div className="mt-4">
                <a 
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('visitCompanyWebsite') || 'Visit Company Website'}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Apply Button */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          {job.contact_email ? (
            <a
              href={`mailto:${job.contact_email}?subject=Application for ${job.title}&body=Dear Hiring Manager,%0D%0A%0D%0AI am interested in applying for the ${job.title} position at ${company?.name || 'your company'}.%0D%0A%0D%0APlease find my application details below.%0D%0A%0D%0ABest regards`}
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              <Mail className="w-4 h-4 mr-2" />
              {t('applyViaEmail') || 'Apply via Email'}
            </a>
          ) : job.url ? (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('applyNow') || 'Apply Now'}
            </a>
          ) : (
            <p className="text-gray-600">{t('contactCompanyDirectly') || 'Contact the company directly to apply for this position.'}</p>
          )}
        </div>

        {/* Back to Jobs */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/jobs')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {t('backToJobs') || '← Back to All Jobs'}
          </button>
        </div>
      </div>
    </main>
  );
}