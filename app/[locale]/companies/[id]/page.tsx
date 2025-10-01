// app/[locale]/companies/[id]/page.tsx
"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Users, Briefcase, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: string;
  description: string;
  website?: string;
  founded?: string;
}



export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const t = useTranslations('companies');
  const tBase = useTranslations();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translateBranchName = (branchName: string) => {
    return tBase(`branch.${branchName}`, { fallback: branchName });
  };
  
 // In your app/[locale]/companies/[id]/page.tsx, update the useEffect:
useEffect(() => {
  async function loadCompany() {
    try {
      setLoading(true);
      const response = await fetch(`/api/companies?locale=${locale}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      const companyId = parseInt(params.id);
      const foundCompany = data.companies.find((c: Company) => c.id === companyId);
      
      if (foundCompany) {
        setCompany(foundCompany);
        setError(null);
      } else {
        setError(t('companyNotFound') || 'Company not found');
      }
    } catch (error) {
      console.error('Error loading company:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }
  
  loadCompany();
}, [locale, params.id, t]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">{t('loading') || "Loading company..."}</p>
        </div>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">{error || t('companyNotFound') || "Company not found"}</p>
          <Link href={`/${locale}/companies`} className="mt-4 inline-block text-blue-600 hover:underline">
            {t('backToCompanies') || "Back to companies"}
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
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <Building2 size={18} className="mr-1" />
                  <span className="mr-4">{translateBranchName(company.industry)}</span>
                  <MapPin size={18} className="mr-1" />
                  <span>{company.location}</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Users size={18} className="mr-1" />
                <span>{company.employees}</span>
              </div>
            </div>
            
            <div className="mb-6 flex flex-wrap gap-6 text-gray-600">
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600">
                  <Globe size={18} className="mr-2" />
                  <span>{t('website')}</span>
                </a>
              )}
              
              {company.founded && (
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span>{t('founded')}: {company.founded}</span>
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('about')}</h2>
              <p className="text-gray-700">
                {company.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Briefcase size={20} className="mr-2" />
              {t('openPositions')}
            </h2>
            
            <Link
              href={`/${locale}/companies/${company.id}/jobs`}
              className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t('viewJobs')}
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}