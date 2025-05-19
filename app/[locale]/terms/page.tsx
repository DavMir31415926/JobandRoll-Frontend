"use client";
import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('terms');
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="prose max-w-none">
          <p className="mb-4">{t('lastUpdated')}: February 1, 2025</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">{t('section1Title')}</h2>
          <p className="mb-4">{t('section1Content')}</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">{t('section2Title')}</h2>
          <p className="mb-4">{t('section2Content')}</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">{t('section3Title')}</h2>
          <p className="mb-4">{t('section3Content')}</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">{t('section4Title')}</h2>
          <p className="mb-4">{t('section4Content')}</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">{t('section5Title')}</h2>
          <p className="mb-4">{t('section5Content')}</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">{t('contactTitle')}</h2>
          <p className="mb-4">{t('contactContent')}</p>
          <p>Email: support@jopoly.com</p>
        </div>
      </div>
    </main>
  );
}