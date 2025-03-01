"use client";
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('settings');
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-white p-4 rounded-lg shadow-md">
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="#profile" className="block p-2 bg-blue-50 text-blue-600 rounded font-medium">
                  {t('profileSettings')}
                </a>
              </li>
              <li>
                <a href="#account" className="block p-2 hover:bg-gray-100 rounded">
                  {t('accountSettings')}
                </a>
              </li>
              <li>
                <a href="#privacy" className="block p-2 hover:bg-gray-100 rounded">
                  {t('privacySettings')}
                </a>
              </li>
              <li>
                <a href="#notifications" className="block p-2 hover:bg-gray-100 rounded">
                  {t('notificationSettings')}
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main content */}
        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <section id="profile" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{t('profileSettings')}</h2>
            
            <div className="flex items-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mr-6 flex items-center justify-center text-gray-500">
                <span className="text-2xl">JD</span>
              </div>
              <div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  {t('uploadPhoto')}
                </button>
                <p className="text-sm text-gray-500 mt-1">{t('photoRequirements')}</p>
              </div>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('firstName')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    defaultValue="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('lastName')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    defaultValue="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('headline')}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue="Senior Frontend Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('bio')}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue="Frontend developer with 5 years of experience..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('location')}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue="Berlin, Germany"
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {t('saveChanges')}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}