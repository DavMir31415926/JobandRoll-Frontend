"use client";
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('ourMission')}</h2>
        <p className="text-lg mb-4">
          {t('missionText')}
        </p>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('ourStory')}</h2>
        <p className="text-lg mb-4">
          {t('storyText')}
        </p>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('ourTeam')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">{t('teamMember1Name')}</h3>
            <p className="text-blue-600">{t('teamMember1Role')}</p>
            <p className="mt-3">
              {t('teamMember1Bio')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">{t('teamMember2Name')}</h3>
            <p className="text-blue-600">{t('teamMember2Role')}</p>
            <p className="mt-3">
              {t('teamMember2Bio')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">{t('teamMember3Name')}</h3>
            <p className="text-blue-600">{t('teamMember3Role')}</p>
            <p className="mt-3">
              {t('teamMember3Bio')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}