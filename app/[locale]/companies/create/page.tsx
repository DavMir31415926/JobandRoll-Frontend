"use client";
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import LocationFilter from '../../../../components/LocationFilter';

export default function CreateCompanyPage() {
  const t = useTranslations('companies');
  const tBranch = useTranslations('branch');
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    industries: [] as string[], // Array of industries
    locations: [] as string[],  // Array of locations  
    description: '',
    website: '',
    size: '1-10',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [branchOptions, setBranchOptions] = useState<Array<{id: string, name: string, isSubcategory: boolean}>>([]);
  const [branchLoading, setBranchLoading] = useState(true);
  
  // Redirect if not authenticated or not an employer
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && user?.role !== 'employer') {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Add this translation hook for branches

// Update the useEffect to use translations
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
            name: tBranch(category.id) || category.name, // Use translation
            isSubcategory: false 
          });
          // Add subcategories with translation
          category.subcategories.forEach((sub: any) => {
            options.push({ 
              id: sub.id, 
              name: tBranch(sub.id) || sub.name, // Use translation
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
}, [tBranch]); // Add tBranch as dependency
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Add this mapping object after your imports
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

  // Helper function to format location name
  const formatLocationForDisplay = (locationName: string): string => {
    // Parse the location string like "Hallwang, 05 (AT)"
    const parts = locationName.split(', ');
    if (parts.length >= 2) {
      const cityName = parts[0];
      const regionAndCountry = parts[1]; // "05 (AT)"
      
      // Extract region code and country
      const match = regionAndCountry.match(/^(\d+)\s*\((\w+)\)$/);
      if (match) {
        const regionCode = match[1];
        const country = match[2];
        
        let regionName = regionCode;
        
        // Map region code to region name based on country
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
    
    // Return original if parsing fails
    return locationName;
  };

  const handleLocationSelect = useCallback((location: any) => {
    if (location) {      
      setFormData(prev => {
        const locationName = location.name;
        const newLocations = prev.locations.includes(locationName) 
          ? prev.locations.filter(loc => loc !== locationName) // Remove if already exists (toggle)
          : [...prev.locations, locationName]; // Add new location
        return {...prev, locations: newLocations};
      });
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.industries.length === 0) {
      setError('Please select at least one industry');
      return;
    }
    
    if (formData.locations.length === 0) {
      setError('Please select at least one location');
      return;
    }

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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
    <div className="container mx-auto p-8">      
      <h1 className="text-3xl font-bold mb-4 text-gray-700">{t('createCompany') || "Create Company"}</h1>
      
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
              className="w-full p-2 border rounded text-gray-700"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Industry Selection */}
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
                              ? prev.industries.filter(id => id !== option.id) // Remove if already selected
                              : [...prev.industries, option.id]; // Add if not selected
                            return {...prev, industries: newIndustries};
                          });
                        }}
                        className={`
                          px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0
                          ${isSelected 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'hover:bg-gray-50 text-gray-700'
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
            
            {/* Location Selection */}
            <div className="mb-4">
              <LocationFilter
                onLocationSelect={handleLocationSelect}
                // selectedLocation={selectedLocation} // REMOVE THIS LINE
                placeholder={t('location') || "Enter company location..."}
                regionMappings={{
                  DE: geoNamesAdmin1ToDERegions,
                  AT: geoNamesAdmin1ToATRegions,
                  CH: geoNamesAdmin1ToCHRegions
                }}
                clearAfterSelect={true}
              />
              
              {/* Show selected locations */}
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
                className="w-full p-2 border rounded text-gray-700"
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
                className="w-full p-2 border rounded text-gray-700"
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
              className="w-full p-2 border rounded text-gray-700"
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
    </div>
    </main>
  );
}