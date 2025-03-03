// app/[locale]/page.tsx
"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Search, Briefcase, Building2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

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

// Custom hook for scroll animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

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

// Number counter animation
function CounterAnimation({ end, duration = 2 }) {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <div ref={ref}>{isVisible ? count.toLocaleString() : "0"}</div>;
}

export default function HomePage() {
  const t = useTranslations('home');
  
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [jobsRef, jobsVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();
  
  return (
    <>
      {/* Hero Section - With animated entry */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 relative overflow-hidden">
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
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              {t('title')}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light"
            >
              {t('subtitle')}
            </motion.p>
            
            {/* Animated Search Bar */}
            <motion.div
              variants={itemVariants}
              className="max-w-2xl mx-auto flex bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-blue-400/20"
            >
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full px-6 py-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-all duration-300"
                />
              </div>
              <motion.button 
                className="bg-blue-500 text-white px-6 py-5 hover:bg-blue-600 transition-all duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={20} className="mr-2" />
                <span>Search</span>
              </motion.button>
            </motion.div>
            
            {/* Animated Stats Cards */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
            >
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-lg shadow-lg transform transition-all duration-300"
              >
                <div className="text-4xl font-bold mb-2">
                  <CounterAnimation end={10000} />+
                </div>
                <div className="text-blue-100">{t('availableJobs')}</div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-lg shadow-lg transform transition-all duration-300"
              >
                <div className="text-4xl font-bold mb-2">
                  <CounterAnimation end={5000} />+
                </div>
                <div className="text-blue-100">{t('companies')}</div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-lg shadow-lg transform transition-all duration-300"
              >
                <div className="text-4xl font-bold mb-2">
                  <CounterAnimation end={1000000} />+
                </div>
                <div className="text-blue-100">{t('users')}</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section - With scroll animations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 40 }}
            animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">{t('howItWorks')}</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-16">Find your dream job in just a few simple steps</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            ref={featuresRef}
            initial="hidden"
            animate={featuresVisible ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              className="bg-white p-8 rounded-lg shadow-md text-center group transition-all duration-300 border border-gray-100"
            >
              <motion.div 
                className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Search size={28} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">{t('featureOne')}</h3>
              <p className="text-gray-600">{t('featureOneDesc')}</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              className="bg-white p-8 rounded-lg shadow-md text-center group transition-all duration-300 border border-gray-100"
            >
              <motion.div 
                className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300"
                whileHover={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Users size={28} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">{t('featureTwo')}</h3>
              <p className="text-gray-600">{t('featureTwoDesc')}</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              className="bg-white p-8 rounded-lg shadow-md text-center group transition-all duration-300 border border-gray-100"
            >
              <motion.div 
                className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300"
                whileHover={{ y: [0, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Briefcase size={28} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">{t('featureThree')}</h3>
              <p className="text-gray-600">{t('featureThreeDesc')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Jobs Section - With scroll animations and card interactions */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            ref={jobsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={jobsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-between items-center mb-12"
          >
            <h2 className="text-3xl font-bold">{t('featuredJobs')}</h2>
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                href="/jobs" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
              >
                {t('viewAllJobs')} 
                <motion.span 
                  className="ml-1"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            ref={jobsRef}
            initial="hidden"
            animate={jobsVisible ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {/* Featured Job Cards - With tilt effect */}
            {[1, 2, 3].map((job, index) => (
              <motion.div 
                key={job}
                variants={itemVariants}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  rotateY: [-1, 1],
                  rotateX: [1, -1]
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="border rounded-lg overflow-hidden shadow-md bg-white relative group cursor-pointer"
              >
                {/* Left accent border - different color per job category */}
                <motion.div 
                  className={`absolute left-0 top-0 w-1 h-full ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-green-500'
                  }`}
                  initial={{ height: "0%" }}
                  whileInView={{ height: "100%" }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />
                
                <div className="p-6 pl-8">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className={`${
                        index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-purple-100' : 'bg-green-100'
                      } w-14 h-14 rounded-md flex items-center justify-center transition-transform duration-300`}
                    >
                      <Building2 size={24} className={`${
                        index === 0 ? 'text-blue-600' : index === 1 ? 'text-purple-600' : 'text-green-600'
                      }`} />
                    </motion.div>
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`text-sm font-medium ${
                        index === 0 ? 'text-blue-600 bg-blue-50' : 
                        index === 1 ? 'text-purple-600 bg-purple-50' : 
                        'text-green-600 bg-green-50'
                      } px-3 py-1 rounded-full`}
                    >
                      {index === 0 ? 'Full-time' : index === 1 ? 'Part-time' : 'Contract'}
                    </motion.span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {index === 0 ? 'Frontend Developer' : index === 1 ? 'UX Designer' : 'Product Manager'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {index === 0 ? 'Company XYZ • Berlin' : index === 1 ? 'Agency ABC • Remote' : 'Startup DEF • Paris'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {index === 0 ? (
                      <>
                        <motion.span whileHover={{ scale: 1.1 }} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">React</motion.span>
                        <motion.span whileHover={{ scale: 1.1 }} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">TypeScript</motion.span>
                        <motion.span whileHover={{ scale: 1.1 }} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Next.js</motion.span>
                      </>
                    ) : index === 1 ? (
                      <>
                        <motion.span whileHover={{ scale: 1.1 }} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Figma</motion.span>
                        <motion.span whileHover={{ scale: 1.1 }} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Adobe XD</motion.span>
                        <motion.span whileHover={{ scale: 1.1 }} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">UI/UX</motion.span>
                      </>
                    ) : (
                      <>
                        <motion.span whileHover={{ scale: 1.1 }} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Agile</motion.span>
                        <motion.span whileHover={{ scale: 1.1 }} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Scrum</motion.span>
                        <motion.span whileHover={{ scale: 1.1 }} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Product</motion.span>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-gray-500 text-sm">
                      {index === 0 ? '2 days ago' : index === 1 ? '5 days ago' : 'Just now'}
                    </span>
                    <span className="font-medium">
                      {index === 0 ? '€50-70k' : index === 1 ? '€40-55k' : '€70-90k'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section - With scroll animations and button interactions */}
      <motion.section 
        className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 relative overflow-hidden"
        ref={ctaRef}
        initial={{ opacity: 0 }}
        animate={ctaVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Animated wave divider */}
        <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
          <motion.svg 
            preserveAspectRatio="none" 
            viewBox="0 0 1200 120" 
            xmlns="http://www.w3.org/2000/svg" 
            style={{ width: '100%', height: '100px', transform: 'rotate(180deg)', fill: '#f9fafb' }}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </motion.svg>
        </div>

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-400 opacity-10"
              style={{ 
                width: Math.random() * 100 + 50, 
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={ctaVisible ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6">{t('readyToStart')}</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">{t('readyToStartDesc')}</p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/jobs" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg inline-block"
                >
                  {t('findJobs')}
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/post-job" 
                  className="bg-blue-800 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-lg border border-blue-500 inline-block"
                >
                  {t('postJob')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}