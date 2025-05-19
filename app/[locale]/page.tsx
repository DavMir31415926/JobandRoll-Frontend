// app/[locale]/page.tsx
"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Search, Briefcase, Building2, ArrowRight, Check, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Custom hook for scroll animations with correct typing
function useScrollAnimation(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
}

export default function HomePage() {
  // Specify the type for the translations to avoid TypeScript errors
  const t = useTranslations('home') as {
    (key: string, params?: Record<string, string>): string;
    rich: (key: string, params?: Record<string, string>) => React.ReactNode;
  };
  
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [freeRef, freeVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();
  
  return (
    <>
      {/* Hero Section - With animated entry */}
      <section className="relative overflow-hidden">
        {/* Top half with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 md:py-32 lg:py-40 relative overflow-hidden">
          {/* Decorative background pattern with subtle parallax */}
          <motion.div 
            className="absolute inset-0 opacity-10" 
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                Jopoly
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto font-light"
              >
                {t('welcomeMessage') || "Your journey to the perfect workplace begins here"}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="inline-flex items-center bg-white bg-opacity-20 px-6 py-3 rounded-full text-lg font-medium mb-10"
              >
                <Gift className="mr-2 h-5 w-5" />
                <span>{t('completelyFree') || "100% Free for Job Seekers and Employers"}</span>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90"
              >
                {t('siteExplanation') || "Connecting talented professionals with innovative employers across Switzerland, Germany, and Austria"}
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Overlapping cards section */}
        <div className="container mx-auto px-4 -mt-20 md:-mt-24 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Job Seeker Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 group"
            >
              <div className="relative overflow-hidden h-48">
                <Image 
                  src="/images/job-seeker.jpg" 
                  alt="Happy job seeker" 
                  fill 
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">{t('lookingForJob') || "Looking for a job?"}</h2>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-600 mb-6 text-lg">{t('jobSeekerText') || "Find your dream position in top companies with our intuitive job search platform."}</p>
                
                <Link href="/jobs">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-blue-600 text-white py-4 px-6 rounded-lg inline-flex items-center font-medium shadow-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    {t('findJobs') || "Find Jobs"}
                    <ArrowRight size={20} className="ml-2" />
                  </motion.div>
                </Link>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('jobSeekerFeature1') || "Thousands of quality jobs in tech, finance, and more"}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('jobSeekerFeature2') || "Powerful filters to find the perfect match"}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('jobSeekerFeature3') || "Location-based search with radius options"}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Employer Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 group"
            >
              <div className="relative overflow-hidden h-48">
                <Image 
                  src="/images/employer.jpg" 
                  alt="Happy employer" 
                  fill 
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">{t('lookingToHire') || "Looking to hire?"}</h2>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-600 mb-6 text-lg">{t('employerText') || "Attract top talent by posting your job openings on our platform - completely free of charge."}</p>
                
                <Link href="/post-job">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-purple-600 text-white py-4 px-6 rounded-lg inline-flex items-center font-medium shadow-md hover:bg-purple-700 transition-colors duration-300"
                  >
                    {t('postJob') || "Post a Job"}
                    <ArrowRight size={20} className="ml-2" />
                  </motion.div>
                </Link>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('employerFeature1') || "Reach a wide audience of qualified candidates"}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('employerFeature2') || "Simple job posting process"}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600 font-semibold">{t('employerFeature3') || "Completely free, no hidden fees ever"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Free Service Highlight Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={freeRef}
            initial={{ opacity: 0, y: 40 }}
            animate={freeVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute right-0 bottom-0 opacity-20">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M196 100C196 152.467 152.467 196 100 196C47.5329 196 4 152.467 4 100C4 47.5329 47.5329 4 100 4C152.467 4 196 47.5329 196 100Z" stroke="url(#paint0_linear)" strokeWidth="8"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="4" y1="4" x2="196" y2="196" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6"/>
                      <stop offset="1" stopColor="#8B5CF6"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:mr-8">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-blue-100">
                      <img 
                        src="/images/free-service.jpg" 
                        alt="Free job posting service" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">
                      {t('freeServiceTitle') || "100% Free, Forever"}
                    </h2>
                    <div className="mb-6 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      <Gift className="mr-2 h-4 w-4" />
                      <span>{t('noHiddenFees') || "No hidden fees, no subscriptions, no limits"}</span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {t('freeServiceDesc1') || "Unlike other job platforms, Jopoly is completely free for both job seekers and employers. We believe that connecting talent with opportunity shouldn't come with a price tag."}
                    </p>
                    <p className="text-gray-700">
                      {t('freeServiceDesc2') || "Post as many jobs as you need, search with powerful filters, and connect with the right people - all without spending a cent."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section - With scroll animations */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 40 }}
            animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('whyChooseJopoly') || "Why Choose Jopoly"}</h2>
            <p className="text-gray-600 text-lg mb-16">
              {t('whyChooseJopolyDesc') || "We've reimagined the job search experience to make it more efficient, transparent, and tailored to your needs"}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('feature1Title') || "Smart Search"}</h3>
              <p className="text-gray-600">
                {t('feature1Desc') || "Our intelligent search algorithm connects you with the most relevant opportunities based on your skills and preferences."}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('feature2Title') || "Location Precision"}</h3>
              <p className="text-gray-600">
                {t('feature2Desc') || "Find jobs within your preferred radius, making commute planning easier and opening up more opportunities."}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('feature3Title') || "Verified Listings"}</h3>
              <p className="text-gray-600">
                {t('feature3Desc') || "We verify all job postings to ensure you're applying to legitimate opportunities from real companies."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - With scroll animations and button interactions */}
      <motion.section 
        className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20 relative overflow-hidden"
        ref={ctaRef}
        initial={{ opacity: 0 }}
        animate={ctaVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Use a key to ensure consistent rendering */}
          <div key="particles-container">
            {Array.from({ length: 10 }).map((_, i) => {
              // Use a seed-based approach instead of pure random
              const seed = i + 1;
              // Generate "random" but consistent values based on the seed
              const width = 50 + (seed * 17) % 100;
              const height = 50 + (seed * 23) % 100;
              const left = `${(seed * 7) % 100}%`;
              const top = `${(seed * 13) % 100}%`;
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white opacity-10"
                  style={{ 
                    width,
                    height,
                    left,
                    top
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 10 + (seed % 10),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: seed % 5
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={ctaVisible ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6">{t('readyToStart') || "Ready to Transform Your Career?"}</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">
              {t('readyToStartDesc') || "Whether you're looking for your next opportunity or searching for top talent, Jopoly is here to help you succeed."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/jobs" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg inline-block"
                >
                  {t('findJobs') || "Find Jobs"}
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/post-job" 
                  className="bg-purple-700 text-white px-8 py-4 rounded-lg font-medium hover:bg-purple-800 transition-colors shadow-lg border border-purple-500 inline-block"
                >
                  {t('postJob') || "Post a Job"}
                </Link>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={ctaVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 inline-flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm"
            >
              <Gift size={16} className="mr-2" />
              <span>{t('absolutelyFree') || "100% free for everyone, no hidden fees!"}</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}