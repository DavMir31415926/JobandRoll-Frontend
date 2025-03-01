"use client";
import { useTranslations } from 'next-intl';

export default function PostJobPage() {
  const t = useTranslations('postJob');
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">{t('jobTitle')}</label>
            <input type="text" id="title" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="company">{t('company')}</label>
            <input type="text" id="company" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="location">{t('location')}</label>
            <input type="text" id="location" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">{t('description')}</label>
            <textarea id="description" className="w-full p-2 border rounded" rows={6}></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            {t('submit')}
          </button>
        </form>
      </div>
    </main>
  );
}