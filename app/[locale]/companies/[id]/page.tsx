"use client";
import { useTranslations } from 'next-intl';

// Remove eslint disable since we don't need it anymore
export default function CompanyDetailPage({ params }: { 
  params: { 
    id: string; 
    locale: string;
  }
}) {
  const t = useTranslations('companies');
  const companyId = params.id;
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')} - ID: {companyId}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <div className="bg-gray-200 w-20 h-20 rounded-lg mr-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-500">{companyId.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Company {companyId}</h2>
            <p className="text-gray-600">Berlin, Germany</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold">About the Company</h3>
          <p className="mt-2">
            This is a detailed description for the company with ID: {companyId}. In a real app, you would fetch this data
            from your API or database based on the company ID.
          </p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Open Positions</h3>
          <div className="mt-2 space-y-3">
            <div className="border p-3 rounded hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Frontend Developer</h4>
              <p className="text-sm text-gray-600">Berlin • Full-time</p>
            </div>
            <div className="border p-3 rounded hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Backend Developer</h4>
              <p className="text-sm text-gray-600">Remote • Full-time</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Company Benefits</h3>
          <ul className="list-disc pl-5 mt-2">
            <li>Flexible working hours</li>
            <li>Remote work options</li>
            <li>Competitive salary</li>
            <li>Professional development budget</li>
          </ul>
        </div>
      </div>
    </main>
  );
}


/*
"use client";
import { useTranslations } from 'next-intl';

interface CompanyDetailPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const t = useTranslations('companies');
  const companyId = params.id;
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')} - ID: {companyId}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <div className="bg-gray-200 w-20 h-20 rounded-lg mr-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-500">{companyId.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Company {companyId}</h2>
            <p className="text-gray-600">Berlin, Germany</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold">About the Company</h3>
          <p className="mt-2">
            This is a detailed description for the company with ID: {companyId}. In a real app, you would fetch this data
            from your API or database based on the company ID.
          </p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Open Positions</h3>
          <div className="mt-2 space-y-3">
            <div className="border p-3 rounded hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Frontend Developer</h4>
              <p className="text-sm text-gray-600">Berlin • Full-time</p>
            </div>
            <div className="border p-3 rounded hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Backend Developer</h4>
              <p className="text-sm text-gray-600">Remote • Full-time</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Company Benefits</h3>
          <ul className="list-disc pl-5 mt-2">
            <li>Flexible working hours</li>
            <li>Remote work options</li>
            <li>Competitive salary</li>
            <li>Professional development budget</li>
          </ul>
        </div>
      </div>
    </main>
  );
}*/