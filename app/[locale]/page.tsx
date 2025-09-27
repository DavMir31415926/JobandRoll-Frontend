// app/[locale]/page.tsx
"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Search, Briefcase, Building2, ArrowRight, Check, Gift, MapPin, Users } from 'lucide-react';
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
      {/* Hero Section - With animated entry and improved gradient */}
      <section className="relative overflow-hidden">
        {/* Top half with enhanced gradient background */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20 md:py-32 lg:py-40 relative overflow-hidden">
          {/* Enhanced decorative background pattern */}
          <motion.div 
            className="absolute inset-0 opacity-20" 
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='10' r='1'/%3E%3Ccircle cx='10' cy='50' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          
          {/* Additional floating elements for visual appeal */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => {
              const seed = i + 1;
              const size = 40 + (seed * 11) % 60;
              const left = `${(seed * 13) % 90 + 5}%`;
              const top = `${(seed * 17) % 80 + 10}%`;
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white opacity-10"
                  style={{ 
                    width: size,
                    height: size,
                    left,
                    top
                  }}
                  animate={{
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 8 + (seed % 6),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: seed % 4
                  }}
                />
              );
            })}
          </div>

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
                className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-medium mb-10 border border-white border-opacity-30"
              >
                <Gift className="mr-2 h-5 w-5" />
                <span>{t('completelyFree') || "100% Free for Job Seekers and Employers"}</span>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90"
              >
                {t('siteExplanation') || "Connecting people from all walks of life with great opportunities across Switzerland"}
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Overlapping cards section with improved spacing */}
        <div className="container mx-auto px-4 -mt-20 md:-mt-24 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Job Seeker Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 group border border-gray-100"
            >
              <div className="relative overflow-hidden h-48">
                <Image 
                  src="/images/job-seeker.jpg" 
                  alt="Happy job seeker" 
                  fill 
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">{t('lookingForJob') || "Looking for a job?"}</h2>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{t('jobSeekerText') || "Find your perfect position with our intuitive job search platform - for everyone, in every field."}</p>
                
                <Link href="/jobs">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-blue-600 text-white py-4 px-6 rounded-lg inline-flex items-center font-medium shadow-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    {t('findJobs') || "Find Jobs"}
                    <ArrowRight size={20} className="ml-2" />
                  </motion.div>
                </Link>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 mt-0.5">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('jobSeekerFeature1') || "Opportunities in all fields - from retail to tech, hospitality to finance"}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 mt-0.5">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('jobSeekerFeature2') || "Powerful filters to find exactly what you're looking for"}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 mt-0.5">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('jobSeekerFeature3') || "Location-based search across all Swiss regions"}</p>
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
              className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 group border border-gray-100"
            >
              <div className="relative overflow-hidden h-48">
                <Image 
                  src="/images/employer.jpg" 
                  alt="Happy employer" 
                  fill 
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">{t('lookingToHire') || "Looking to hire?"}</h2>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{t('employerText') || "Connect with great people without the outrageous fees that other platforms charge."}</p>
                
                <Link href="/post-job">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-purple-600 text-white py-4 px-6 rounded-lg inline-flex items-center font-medium shadow-lg hover:bg-purple-700 transition-colors duration-300"
                  >
                    {t('postJob') || "Post a Job"}
                    <ArrowRight size={20} className="ml-2" />
                  </motion.div>
                </Link>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3 mt-0.5">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('employerFeature1') || "Reach qualified candidates without paying excessive fees"}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3 mt-0.5">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600">{t('employerFeature2') || "Simple, straightforward job posting process"}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3 mt-0.5">
                      <Check size={14} />
                    </div>
                    <p className="text-gray-600 font-semibold">{t('employerFeature3') || "Completely free - no hidden costs, ever"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Free Service Highlight Section with improved background flow */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={freeRef}
            initial={{ opacity: 0, y: 40 }}
            animate={freeVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100 relative overflow-hidden shadow-lg">
              {/* Enhanced background decoration */}
              <div className="absolute right-0 bottom-0 opacity-10">
                <svg width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="125" cy="125" r="120" stroke="url(#paint0_linear)" strokeWidth="10"/>
                  <circle cx="125" cy="125" r="80" stroke="url(#paint1_linear)" strokeWidth="6"/>
                  <circle cx="125" cy="125" r="40" stroke="url(#paint2_linear)" strokeWidth="4"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="5" y1="5" x2="245" y2="245" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6"/>
                      <stop offset="1" stopColor="#8B5CF6"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="45" y1="45" x2="205" y2="205" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366F1"/>
                      <stop offset="1" stopColor="#A855F7"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear" x1="85" y1="85" x2="165" y2="165" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8B5CF6"/>
                      <stop offset="1" stopColor="#EC4899"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:mr-8">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-blue-100 shadow-md">
                      <img 
                        src="/images/free-service.jpg" 
                        alt="Free job posting service" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                      {t('freeServiceTitle') || "Completely Free, Forever"}
                    </h2>
                    <div className="mb-6 inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                      <Gift className="mr-2 h-4 w-4" />
                      <span>{t('noHiddenFees') || "No fees, no subscriptions, no limits"}</span>
                    </div>
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                      {t('freeServiceDesc1') || "Job hunting and hiring shouldn't cost a fortune. Unlike other platforms that charge excessive fees, we believe connecting people with opportunities should be accessible to everyone."}
                    </p>
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                      {t('freeServiceDesc2') || "Post unlimited jobs, search with powerful filters, and connect with great people - all without spending a single Rappen."}
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                      <p className="text-gray-800 font-medium text-sm">
                        {t('fairnessMessage') || "We believe the outrageous pricing of major job portals is completely unnecessary. Great connections happen when barriers are removed, not when they're monetized."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section - With improved contrast and design */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 40 }}
            animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{t('whyChooseJopoly') || "Why Choose Jopoly"}</h2>
            <p className="text-gray-700 text-lg mb-16 leading-relaxed">
              {t('whyChooseJopolyDesc') || "We've built a platform that puts people first, not profits. Here's what makes us different"}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('feature1Title') || "Smart Search"}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('feature1Desc') || "Our intelligent search connects you with relevant opportunities across all industries and skill levels, from entry-level to executive positions."}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('feature2Title') || "Location Precision"}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('feature2Desc') || "Find opportunities within your preferred distance across all Swiss cantons, from Zurich to Geneva, Basel to Lugano."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Enhanced with better background flow */}
      <motion.section 
        className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20 relative overflow-hidden"
        ref={ctaRef}
        initial={{ opacity: 0 }}
        animate={ctaVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div key="cta-particles-container">
            {Array.from({ length: 12 }).map((_, i) => {
              const seed = i + 1;
              const width = 60 + (seed * 17) % 120;
              const height = 60 + (seed * 23) % 120;
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
                    y: [0, -150, 0],
                    x: [0, 50, 0],
                    opacity: [0.05, 0.15, 0.05],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 15 + (seed % 10),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: seed % 6
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('readyToStart') || "Ready to Get Started?"}</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('readyToStartDesc') || "Join thousands of people across Switzerland who've found their perfect match on our platform - without paying a single Rappen."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/jobs" 
                  className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg inline-block text-lg"
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
                  className="bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-800 transition-colors shadow-lg border-2 border-purple-500 inline-block text-lg"
                >
                  {t('postJob') || "Post a Job"}
                </Link>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={ctaVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full text-sm border border-white border-opacity-30"
            >
              <Gift size={16} className="mr-2" />
              <span>{t('absolutelyFree') || "No tricks, no fees, completely free for everyone!"}</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}