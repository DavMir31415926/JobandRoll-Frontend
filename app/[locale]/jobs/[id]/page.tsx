"use client";
import { useTranslations } from 'next-intl';

// Remove eslint disable since we don't need it anymore
export default function JobDetailPage({ params }: { 
  params: { 
    id: string; 
    locale: string;
  }
}) {
  const t = useTranslations('jobs');
  const jobId = params.id;
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')} - ID: {jobId}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Frontend Developer</h2>
        <p className="text-gray-600">Company XYZ • Berlin</p>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Job Description</h3>
          <p className="mt-2">
            This is a detailed description for the job with ID: {jobId}. In a real app, you would fetch this data
            from your API or database based on the job ID.
          </p>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Requirements</h3>
          <ul className="list-disc pl-5 mt-2">
            <li>3+ years of React experience</li>
            <li>TypeScript knowledge</li>
            <li>Experience with Next.js</li>
            <li>Understanding of i18n concepts</li>
          </ul>
        </div>
        <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Apply Now
        </button>
      </div>
    </main>
  );
}

/*"use client";
import { useTranslations } from 'next-intl';

interface JobDetailPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const t = useTranslations('jobs');
  const jobId = params.id;
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')} - ID: {jobId}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Frontend Developer</h2>
        <p className="text-gray-600">Company XYZ • Berlin</p>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Job Description</h3>
          <p className="mt-2">
            This is a detailed description for the job with ID: {jobId}. In a real app, you would fetch this data
            from your API or database based on the job ID.
          </p>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Requirements</h3>
          <ul className="list-disc pl-5 mt-2">
            <li>3+ years of React experience</li>
            <li>TypeScript knowledge</li>
            <li>Experience with Next.js</li>
            <li>Understanding of i18n concepts</li>
          </ul>
        </div>
        <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Apply Now
        </button>
      </div>
    </main>
  );
}*/