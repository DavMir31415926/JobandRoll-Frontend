// app/[locale]/page.tsx
"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Search, Briefcase, Building2, Users } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('home');
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">{t('subtitle')}</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="flex-grow">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full px-6 py-4 text-gray-700 focus:outline-none"
              />
            </div>
            <button className="bg-blue-500 text-white px-6 py-4 hover:bg-blue-600 transition-colors">
              <Search size={20} />
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="bg-blue-700 bg-opacity-50 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">{t('availableJobs')}</div>
            </div>
            <div className="bg-blue-700 bg-opacity-50 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">{t('companies')}</div>
            </div>
            <div className="bg-blue-700 bg-opacity-50 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">{t('users')}</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('howItWorks')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('featureOne')}</h3>
              <p className="text-gray-600">{t('featureOneDesc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('featureTwo')}</h3>
              <p className="text-gray-600">{t('featureTwoDesc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('featureThree')}</h3>
              <p className="text-gray-600">{t('featureThreeDesc')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Jobs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t('featuredJobs')}</h2>
            <Link href="/jobs" className="text-blue-600 hover:underline">
              {t('viewAllJobs')} →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Job Cards */}
            {[1, 2, 3].map((job) => (
              <div key={job} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gray-200 w-12 h-12 rounded-md flex items-center justify-center">
                      <Building2 size={24} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      Full-time
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Frontend Developer</h3>
                  <p className="text-gray-600 mb-4">Company XYZ • Berlin</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">React</span>
                    <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">TypeScript</span>
                    <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Next.js</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-500 text-sm">2 days ago</span>
                    <span className="font-medium">€50-70k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('readyToStart')}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">{t('readyToStartDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/jobs" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {t('findJobs')}
            </Link>
            <Link 
              href="/post-job" 
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              {t('postJob')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}


/*"use client";
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');
  
  return (
    <main className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl">{t('subtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Search Jobs</h2>
          <p>Find the perfect job opportunity matching your skills and preferences.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Create Profile</h2>
          <p>Create your professional profile to showcase your experience and skills.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Apply Easily</h2>
          <p>Apply to multiple jobs with just a few clicks and track your applications.</p>
        </div>
      </div>
    </main>
  );
}*/