// components/CompanySearch.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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

export default function CompanySearch() {
  const locale = useLocale();
  const t = useTranslations('companies');
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/${locale}/companies?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setCompanies(data.companies);
      setSearched(true);
    } catch (error) {
      console.error('Error searching companies:', error);
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

      {searched && !loading && companies.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">{t('noResults')}</p>
          <p className="mt-2 text-gray-500">{t('tryDifferentSearch')}</p>
        </div>
      )}

      {!loading && companies.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">{t('results', { count: companies.length })}</h3>
          
          {companies.map((company) => (
            <motion.div
              key={company.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/${locale}/companies/${company.id}`} className="block p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{company.name}</h4>
                    <div className="flex items-center mt-2 text-gray-600">
                      <Building2 size={16} className="mr-1" />
                      <span className="mr-4">{company.industry}</span>
                      <MapPin size={16} className="mr-1" />
                      <span>{company.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-1" />
                    <span>{company.employees}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-600">{company.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}