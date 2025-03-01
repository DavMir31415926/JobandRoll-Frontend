"use client";
import { useTranslations } from 'next-intl';

export default function CompaniesPage() {
  const t = useTranslations('companies');
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <p className="mb-8">{t('description')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Company XYZ</h2>
          <p className="mt-2">Technology company specializing in web development...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Company ABC</h2>
          <p className="mt-2">Software development company focused on enterprise solutions...</p>
        </div>
      </div>
    </main>
  );
}