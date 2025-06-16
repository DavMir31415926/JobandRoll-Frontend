"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

export default function CreateCompanyPage() {
  const t = useTranslations('companies');
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    description: '',
    website: '',
    size: '1-10',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Redirect if not authenticated or not an employer
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && user?.role !== 'employer') {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create company');
      }
      
      // Redirect to the company page
      router.push(`/companies/${data.company.id}`);
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
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('createCompany') || "Create Company"}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              {t('companyName') || "Company Name"}
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="industry">
                {t('industry') || "Industry"}
              </label>
              <input
                type="text"
                id="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="location">
                {t('location') || "Location"}
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="website">
                {t('website') || "Website"}
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="size">
                {t('companySize') || "Company Size"}
              </label>
              <select
                id="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              {t('description') || "Description"}
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
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (t('creating') || "Creating...") : (t('createCompany') || "Create Company")}
          </button>
        </form>
      </div>
    </main>
  );
}