"use client";
import { useTranslations } from 'next-intl';

export default function JobsPage() {
  const t = useTranslations('jobs');
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <p className="mb-8">Browse our available positions</p>
      
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Frontend Developer</h2>
          <p className="text-gray-600">Company XYZ • Berlin</p>
          <p className="mt-2">Frontend developer position with React experience...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Backend Developer</h2>
          <p className="text-gray-600">Company ABC • Munich</p>
          <p className="mt-2">Backend developer position with Node.js experience...</p>
        </div>
      </div>
    </main>
  );
}