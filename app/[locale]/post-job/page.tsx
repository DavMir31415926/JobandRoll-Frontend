"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

export default function PostJobPage() {
  const t = useTranslations('postJob');
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading } = useUser();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    branch: '',
    job_type: '100%',
    experience_level: '',
    salary_min: '',
    salary_max: '',
    language: 'Englisch',
  });
  
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(true); // ADD THIS LINE
  
  // Redirect if not authenticated or not an employer
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && user?.role !== 'employer') {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);
  
  // Load user's companies
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserCompanies();
    }
  }, [isAuthenticated, user]);
  
  const fetchUserCompanies = async () => {
    try {
      setCompaniesLoading(true); // ADD THIS LINE
      const response = await fetch('/api/user/companies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      
      const data = await response.json();
      setCompanies(data.companies);
      
      // Auto-select the first company if available
      if (data.companies.length > 0) {
        setSelectedCompany(data.companies[0].id);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setCompaniesLoading(false); // ADD THIS LINE
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany) {
      setError(t('selectCompany') || 'Please select a company');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          company_id: selectedCompany,
          // Convert salary strings to numbers if provided
          salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
          salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to post job');
      }
      
      // Redirect to the new job page
      router.push(`/jobs/${data.job.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // If loading or not authenticated, show loading state
  if (isLoading || !isAuthenticated) {
    return (
      <main className="container mx-auto p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">{t('loading') || "Loading..."}</p>
        </div>
      </main>
    );
  }
  
  // ADD THIS: Show loading while companies are being fetched
  if (companiesLoading) {
    return (
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">{t('loadingCompanies') || "Loading companies..."}</p>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {companies.length === 0 ? (
          <div className="text-center py-6">
            <p className="mb-4 text-gray-700">{t('noCompanies') || "You don't have any companies yet. Please create a company first."}</p>
            <a 
              href="/companies/create" 
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {t('createCompany') || "Create Company"}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="company">
                {t('selectCompany') || "Select Company"}
              </label>
              <select
                id="company"
                value={selectedCompany || ''}
                onChange={(e) => setSelectedCompany(Number(e.target.value))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">{t('selectCompany') || "Select a company"}</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="title">
                {t('jobTitle')}
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="location">
                  {t('location')}
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="branch">
                  {t('industry') || "Industry/Branch"}
                </label>
                <input
                  type="text"
                  id="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="job_type">
                  {t('employmentType') || "Employment Type"}
                </label>
                <select
                  id="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="100%">100%</option>
                  <option value="90%">90%</option>
                  <option value="80%">80%</option>
                  <option value="70%">70%</option>
                  <option value="60%">60%</option>
                  <option value="50%">50%</option>
                  <option value="40%">40%</option>
                  <option value="30%">30%</option>
                  <option value="20%">20%</option>
                  <option value="10%">10%</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="experience_level">
                  {t('experienceLevel') || "Experience Level"}
                </label>
                <select
                  id="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">{t('selectExperience') || "Select Experience Level"}</option>
                  <option value="Entry Level">{t('entryLevel') || "Entry Level"}</option>
                  <option value="Mid Level">{t('midLevel') || "Mid Level"}</option>
                  <option value="Senior">{t('senior') || "Senior"}</option>
                  <option value="Executive">{t('executive') || "Executive"}</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="salary_min">
                  {t('minSalary') || "Minimum Salary (€)"}
                </label>
                <input
                  type="number"
                  id="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="salary_max">
                  {t('maxSalary') || "Maximum Salary (€)"}
                </label>
                <input
                  type="number"
                  id="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="language">
                {t('language') || "Language"}
              </label>
              <select
                id="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Englisch">{t('english') || "English"}</option>
                <option value="German">{t('german') || "German"}</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="description">
                {t('description')}
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={6}
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="requirements">
                {t('requirements') || "Requirements"}
              </label>
              <textarea
                id="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={4}
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="benefits">
                {t('benefits') || "Benefits"}
              </label>
              <textarea
                id="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={4}
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (t('posting') || "Posting...") : (t('postJob') || "Post Job")}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}