"use client";
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">{t('name')}</label>
            <input type="text" id="name" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">{t('email')}</label>
            <input type="email" id="email" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="message">{t('message')}</label>
            <textarea id="message" className="w-full p-2 border rounded" rows={4}></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            {t('send')}
          </button>
        </form>
      </div>
    </main>
  );
}