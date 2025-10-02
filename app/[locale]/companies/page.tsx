"use client";
import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Search, Building2, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: string;
  description: string;
}

export default function CompaniesPage() {
  const locale = useLocale();
  const t = useTranslations('companies');
  const tBranch = useTranslations('branch');
  
  const [query, setQuery] = useState('');
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load all companies on initial page load
    async function loadCompanies() {
      try {
        setLoading(true);
        const response = await fetch(`/api/companies?locale=${locale}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setAllCompanies(data.companies);
        setError(null);
      } catch (error) {
        console.error('Error loading companies:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    loadCompanies();
  }, [locale]);

  // Client-side filtering - happens instantly as user types
  const filteredCompanies = useMemo(() => {
    if (!query.trim()) {
      return allCompanies; // Show all companies if no search query
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return allCompanies.filter(company => 
      company.name.toLowerCase().includes(searchTerm)
    );
  }, [allCompanies, query]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{t('title')}</h1>
        </motion.div>
        
        {/* Search Form - Now just updates state, no form submission needed */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder') || "Search for companies..."}
              className="flex-grow px-6 py-4 focus:outline-none text-gray-700"
            />
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center pointer-events-none">
              <Search size={20} />
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-700">{t('loading') || "Loading companies..."}</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-600">{t('error') || "Error"}: {error}</p>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredCompanies.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-700">{t('noResults') || "No companies found matching your search"}</p>
            <p className="mt-2 text-gray-600">{t('tryDifferentSearch') || "Try different keywords or browse all companies"}</p>
          </div>
        )}
        
        {/* Companies List */}
        {!loading && !error && filteredCompanies.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              {filteredCompanies.length} {t('results', { count: filteredCompanies.length }) || "companies found"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCompanies.map((company) => (
              <motion.div
                key={company.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  {/* Company header - Make this a link */}
                  <Link 
                    href={`/${locale}/companies/${company.id}`} 
                    className="block mb-4 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{company.name}</h4>
                        <div className="flex items-center mt-2 text-gray-600">
                          <Building2 size={16} className="mr-1" />
                          <span className="mr-4">{tBranch(company.industry) || company.industry}</span>
                          <MapPin size={16} className="mr-1" />
                          <span>{company.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-1" />
                        <span>{company.employees}</span>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Company description - NOT a link */}
                  <div className="mt-4">
                    <p className="text-gray-600">{company.description}</p>
                  </div>
                  
                  {/* View Jobs button - separate link */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link 
                      href={`/${locale}/companies/${company.id}/jobs`}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
                    >
                      {t('viewJobs')}
                      <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}