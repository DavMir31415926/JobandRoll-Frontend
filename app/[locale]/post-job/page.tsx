"use client";
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import LocationFilter from '../../../components/LocationFilter';

export default function PostJobPage() {
  const t = useTranslations('postJob');
  const tBranch = useTranslations('branch');
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading } = useUser();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyDescription: '', // NEW: Company description field
    requirements: '',
    benefits: '',
    location: '', // Will store single location
    branch: '', // Will store single industry
    job_type: '100%',
    experience_level: '',
    salary_min: '',
    salary_max: '',
    language: 'English',
    contact_email: '',
  });
  
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  
  // Industry/Branch selection state
  const [branchOptions, setBranchOptions] = useState<Array<{id: string, name: string, isSubcategory: boolean}>>([]);
  const [branchLoading, setBranchLoading] = useState(true);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  
  // Location selection state
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  
  // Mapping for location display (same as in CreateCompanyPage)
  const geoNamesAdmin1ToDERegions: Record<string, string> = {
    '01': 'Baden-Württemberg', '1': 'Baden-Württemberg',
    '02': 'Bayern', '2': 'Bayern',
    '16': 'Berlin',
    '11': 'Brandenburg',
    '03': 'Bremen', '3': 'Bremen',
    '04': 'Hamburg', '4': 'Hamburg',
    '05': 'Hessen', '5': 'Hessen',
    '12': 'Mecklenburg-Vorpommern',
    '06': 'Niedersachsen', '6': 'Niedersachsen',
    '07': 'Nordrhein-Westfalen', '7': 'Nordrhein-Westfalen',
    '08': 'Rheinland-Pfalz', '8': 'Rheinland-Pfalz',
    '09': 'Saarland', '9': 'Saarland',
    '13': 'Sachsen',
    '14': 'Sachsen-Anhalt',
    '10': 'Schleswig-Holstein',
    '15': 'Thüringen'
  };

  const geoNamesAdmin1ToATRegions: Record<string, string> = {
    '1': 'Burgenland', '01': 'Burgenland',
    '2': 'Kärnten', '02': 'Kärnten',
    '3': 'Niederösterreich', '03': 'Niederösterreich',
    '4': 'Oberösterreich', '04': 'Oberösterreich',
    '5': 'Salzburg', '05': 'Salzburg',
    '6': 'Steiermark', '06': 'Steiermark',
    '7': 'Tirol', '07': 'Tirol',
    '8': 'Vorarlberg', '08': 'Vorarlberg',
    '9': 'Wien', '09': 'Wien'
  };

  const geoNamesAdmin1ToCHRegions: Record<string, string> = {
    // Add Swiss regions if needed
  };
  
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

  // Load branch options
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchLoading(true);
        const response = await fetch('/api/jobs/branches');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.branches)) {
          const options: Array<{id: string, name: string, isSubcategory: boolean}> = [];
          data.branches.forEach((category: any) => {
            // Add main category with translation
            options.push({ 
              id: category.id, 
              name: tBranch(category.id) || category.name,
              isSubcategory: false 
            });
            // Add subcategories with translation
            category.subcategories.forEach((sub: any) => {
              options.push({ 
                id: sub.id, 
                name: tBranch(sub.id) || sub.name,
                isSubcategory: true 
              });
            });
          });
          setBranchOptions(options);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setBranchLoading(false);
      }
    };
    
    fetchBranches();
  }, [tBranch]);
  
  const fetchUserCompanies = async () => {
    try {
      setCompaniesLoading(true);
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
      setCompaniesLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle location selection (single location for jobs)
  const handleLocationSelect = useCallback((location: any) => {
    if (location) {
      setSelectedLocation(location);
      setFormData(prev => ({...prev, location: location.name}));
    }
  }, []);

  // Handle branch selection (single industry for jobs)
  const handleBranchSelect = (branchId: string) => {
    const selected = branchOptions.find(option => option.id === branchId);
    if (selected) {
      setFormData(prev => ({...prev, branch: branchId}));
      setShowBranchDropdown(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany) {
      setError(t('selectCompany') || 'Please select a company');
      return;
    }
    
    if (!formData.branch) {
      setError('Please select an industry');
      return;
    }
    
    if (!formData.location) {
      setError('Please select a location');
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
  
  // Show loading while companies are being fetched
  if (companiesLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="container mx-auto p-8">      
        <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">{t('loading') || "Loading..."}</p>
          </div>
        </div>
      </div>
      </main>
    );
  }
  
  // Get selected branch display name
  const getSelectedBranchName = () => {
    const selected = branchOptions.find(option => option.id === formData.branch);
    return selected ? selected.name : 'Select Industry';
  };
  
  return (
  <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
    <div className="container mx-auto p-8">      
      <h1 className="text-3xl font-bold mb-4 text-gray-700">{t('title')}</h1>
      
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
                className="w-full p-2 border rounded text-gray-700"
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
                className="w-full p-2 border rounded text-gray-700"
                required
              />
            </div>

            {/* NEW: Company Description Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="companyDescription">
                {t('companyDescription') || "Company Description"}
              </label>
              <textarea
                id="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-700"
                rows={3}
                placeholder={t('companyDescriptionPlaceholder') || "Describe your company to potential candidates..."}
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  {t('location')} *
                </label>
                <LocationFilter
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                  placeholder={t('location') || "Enter job location..."}
                  regionMappings={{
                    DE: geoNamesAdmin1ToDERegions,
                    AT: geoNamesAdmin1ToATRegions,
                    CH: geoNamesAdmin1ToCHRegions
                  }}
                  clearAfterSelect={false} // For jobs, keep the location displayed
                />
              </div>
              
              {/* Industry Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  {t('industry') || "Industry"} *
                </label>
                {branchLoading ? (
                  <div className="w-full p-2 border rounded bg-gray-50">Loading industries...</div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                      className="w-full p-2 border rounded text-left bg-white flex items-center justify-between"
                    >
                      <span className={formData.branch ? 'text-gray-800' : 'text-gray-500'}>
                        {formData.branch ? getSelectedBranchName() : (t('selectIndustry') || 'Select Industry')}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showBranchDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                        {branchOptions.map((option) => (
                          <div
                            key={option.id}
                            onClick={() => handleBranchSelect(option.id)}
                            className={`
                              px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50
                              ${option.isSubcategory ? 'pl-8' : 'font-semibold'}
                              ${formData.branch === option.id ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}
                            `}
                            style={{
                              paddingLeft: option.isSubcategory ? '2rem' : '0.75rem',
                            }}
                          >
                            {option.isSubcategory ? `└── ${option.name}` : option.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                  className="w-full p-2 border rounded text-gray-700"
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
                  className="w-full p-2 border rounded text-gray-700"
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
                  className="w-full p-2 border rounded text-gray-700"
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
                  className="w-full p-2 border rounded text-gray-700"
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
                className="w-full p-2 border rounded text-gray-700"
                required
              >
                <option value="English">{t('english') || "English"}</option>
                <option value="German">{t('german') || "German"}</option>
                <option value="French">{t('french') || "French"}</option>
                <option value="Italian">{t('italian') || "Italian"}</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="contact_email">
                {t('contactEmail') || "Contact Email"}
              </label>
              <input
                type="email"
                id="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-700"
                placeholder="jobs@company.com"
              />
            </div>
                        
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="description">
                {t('description') || "Job Description"}
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-700"
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
                className="w-full p-2 border rounded text-gray-700"
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
                className="w-full p-2 border rounded text-gray-700"
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
    </div>
    </main>
  );
}