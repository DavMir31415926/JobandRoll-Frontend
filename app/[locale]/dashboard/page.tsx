"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">{t('applicationsTitle')}</h2>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-500 mt-1">{t('activeApplicationsText')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">{t('savedJobsTitle')}</h2>
          <p className="text-3xl font-bold text-blue-600">8</p>
          <p className="text-sm text-gray-500 mt-1">{t('savedJobsText')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">{t('profileViewsTitle')}</h2>
          <p className="text-3xl font-bold text-blue-600">24</p>
          <p className="text-sm text-gray-500 mt-1">{t('lastThirtyDaysText')}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('recentApplicationsTitle')}</h2>
          <Link href="/applications" className="text-blue-600 hover:underline">{t('viewAllLink')}</Link>
        </div>
        
        <div className="divide-y">
          <div className="py-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Frontend Developer</h3>
                <p className="text-sm text-gray-600">Company XYZ • Berlin</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {t('inReview')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('appliedOn')}: 12 Feb 2025</p>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">React Developer</h3>
                <p className="text-sm text-gray-600">Company ABC • Remote</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {t('interviewed')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('appliedOn')}: 5 Feb 2025</p>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">UI/UX Designer</h3>
                <p className="text-sm text-gray-600">Company DEF • Munich</p>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                {t('rejected')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('appliedOn')}: 28 Jan 2025</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('recommendedJobsTitle')}</h2>
          <Link href="/jobs" className="text-blue-600 hover:underline">{t('browseMoreLink')}</Link>
        </div>
        
        <div className="space-y-4">
          <div className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium">Senior Frontend Developer</h3>
            <p className="text-sm text-gray-600">Company GHI • Berlin</p>
            <p className="text-sm mt-2">5+ years experience with React, TypeScript, and modern frontend frameworks...</p>
            <p className="text-sm text-gray-500 mt-2">{t('postedOn')}: 2 days ago</p>
          </div>
          
          <div className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium">Full Stack Engineer</h3>
            <p className="text-sm text-gray-600">Company JKL • Remote</p>
            <p className="text-sm mt-2">Experience with Node.js, React, and cloud services...</p>
            <p className="text-sm text-gray-500 mt-2">{t('postedOn')}: 3 days ago</p>
          </div>
        </div>
      </div>
    </main>
  );
}