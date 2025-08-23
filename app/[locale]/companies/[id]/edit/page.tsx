"use client";
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LocationFilter from '../../../../../components/LocationFilter';

// Location mapping (same as create page)
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

const geoNamesAdmin1ToCHRegions: Record<string, string> = {};

// Helper function to format location name
const formatLocationForDisplay = (locationInput: string | any): string => {
  let locationName: string;
  
  if (typeof locationInput === 'object' && locationInput.name) {
    const location = locationInput;
    locationName = `${location.name}${location.admin_level1 ? `, ${location.admin_level1}` : ''} (${location.country})`;
  } else {
    locationName = locationInput as string;
  }
  
  const parts = locationName.split(', ');
  if (parts.length >= 2) {
    const cityName = parts[0];
    const regionAndCountry = parts[1];
    
    const match = regionAndCountry.match(/^(\d+)\s*\((\w+)\)$/);
    if (match) {
      const regionCode = match[1];
      const country = match[2];
      
      let regionName = regionCode;
      
      if (country === 'DE' && geoNamesAdmin1ToDERegions[regionCode]) {
        regionName = geoNamesAdmin1ToDERegions[regionCode];
      } else if (country === 'AT' && geoNamesAdmin1ToATRegions[regionCode]) {
        regionName = geoNamesAdmin1ToATRegions[regionCode];
      } else if (country === 'CH' && geoNamesAdmin1ToCHRegions[regionCode]) {
        regionName = geoNamesAdmin1ToCHRegions[regionCode];
      }
      
      return `${cityName}, ${regionName} (${country})`;
    }
  }
  
  return locationName;
};

export default function EditCompanyPage() {
  const t = useTranslations('companies');
  const tBranch = useTranslations('branch');
  const router = useRouter();
  const params = useParams();
  const { user, token } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    industries: [] as string[],
    locations: [] as string[],
    description: '',
    website: '',
    size: '1-10',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [branchOptions, setBranchOptions] = useState<Array<{id: string, name: string, isSubcategory: boolean}>>([]);
  const [branchLoading, setBranchLoading] = useState(true);

  // Load company data
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setDataLoading(true);
        const response = await fetch(`/api/companies/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch company');
        }
        
        const data = await response.json();
        const company = data.company;
        
        setFormData({
          name: company.name || '',
          industries: company.industries || [],
          locations: company.locations || [],
          description: company.description || '',
          website: company.website || '',
          size: company.size || '1-10',
        });
      } catch (error) {
        console.error('Error fetching company:', error);
        setError('Failed to load company data');
      } finally {
        setDataLoading(false);
      }
    };

    if (params.id && token) {
      fetchCompany();
    }
  }, [params.id, token]);

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
            options.push({ 
              id: category.id, 
              name: tBranch(category.id) || category.name,
              isSubcategory: false 
            });
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

  const handleLocationSelect = useCallback((location: any) => {
    if (location) {
      const formattedLocationName = formatLocationForDisplay(location.name);
      
      setFormData(prev => {
        const newLocations = prev.locations.includes(formattedLocationName) 
          ? prev.locations.filter(loc => loc !== formattedLocationName)
          : [...prev.locations, formattedLocationName];
        return {...prev, locations: newLocations};
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.industries.length === 0) {
      setError(t('selectIndustry') || 'Please select at least one industry');
      return;
    }
    
    if (formData.locations.length === 0) {
      setError(t('selectLocation') || 'Please select at least one location');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/companies/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update company');
      }
      
      router.push(`/companies/${params.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
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
    <ProtectedRoute>
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">{t('editCompany') || 'Edit Company'}</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                {t('name') || "Company Name"} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Industry selection */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                {t('industry') || "Industry"} *
              </label>
              {branchLoading ? (
                <div className="w-full p-2 border rounded bg-gray-50">Loading industries...</div>
              ) : (
                <div className="w-full border rounded max-h-32 overflow-y-auto bg-white">
                  {branchOptions.map((option) => {
                    const isSelected = formData.industries.includes(option.id);
                    return (
                      <div
                        key={option.id}
                        onClick={() => {
                          setFormData(prev => {
                            const newIndustries = prev.industries.includes(option.id)
                              ? prev.industries.filter(id => id !== option.id)
                              : [...prev.industries, option.id];
                            return {...prev, industries: newIndustries};
                          });
                        }}
                        className={`
                          px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0
                          ${isSelected 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'hover:bg-gray-50'
                          }
                          ${option.isSubcategory ? 'pl-8' : 'font-semibold'}
                        `}
                        style={{
                          paddingLeft: option.isSubcategory ? '2rem' : '0.75rem',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {option.isSubcategory ? `└── ${option.name}` : option.name}
                          </span>
                          {isSelected && (
                            <span className="text-blue-600 font-bold">✓</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Click to select/deselect industries. Selected: {formData.industries.length}
              </p>
            </div>

            {/* Location selection */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                {t('location') || "Location"} *
              </label>
              <LocationFilter
                onLocationSelect={handleLocationSelect}
                placeholder={t('location') || "Enter company location..."}
                regionMappings={{
                  DE: geoNamesAdmin1ToDERegions,
                  AT: geoNamesAdmin1ToATRegions,
                  CH: geoNamesAdmin1ToCHRegions
                }}
                clearAfterSelect={true}
              />
              
              {formData.locations.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Selected locations:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.locations.map((location, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {formatLocationForDisplay(location)}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev, 
                              locations: prev.locations.filter(loc => loc !== location)
                            }));
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Website and Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="website">
                  {t('website') || "Website"}
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="size">
                  {t('size') || "Company Size"} *
                </label>
                <select
                  id="size"
                  name="size"
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
            
            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="description">
                {t('description') || "Description"} *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={6}
                required
              ></textarea>
            </div>
            
            {/* Submit buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? t('updating') || "Updating..." : t('updateCompany') || "Update Company"}
              </button>
              
              <button
                type="button"
                onClick={() => router.push(`/companies/${params.id}`)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                {t('cancel') || "Cancel"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}