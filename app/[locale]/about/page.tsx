"use client";
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Heart, Users, Target } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function AboutPage() {
  const t = useTranslations('about');
  
  const [heroRef, heroIsVisible] = useScrollAnimation();
  const [missionRef, missionIsVisible] = useScrollAnimation();
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroIsVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            >
              {t('title')}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-700 mb-8 leading-relaxed"
            >
              {t('heroSubtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Founder & Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={missionRef}
            initial="hidden"
            animate={missionIsVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="max-w-6xl mx-auto"
          >
            {/* Founder Story */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 mb-16 border border-blue-100"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center">
                  {t('founderSectionTitle')}
                </h2>
                <div className="text-lg text-gray-700 leading-relaxed space-y-4">
                  <p>
                    {t('founderStory')}
                  </p>
                  <p>
                    {t('founderEducation')}
                  </p>
                  <div className="bg-white rounded-lg p-6 mt-6 border-l-4 border-blue-500">
                    <p className="italic text-gray-800 text-xl">
                      "{t('founderQuote')}"
                    </p>
                    <p className="text-gray-600 mt-2">- David Mirkovic, Founder</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mission Values */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
                {t('ourMissionTitle')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  variants={itemVariants}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('value1Title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('value1Desc')}
                  </p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('value2Title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('value2Desc')}
                  </p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('value3Title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('value3Desc')}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Team Vision */}
            <motion.div 
              variants={itemVariants}
              className="text-center mt-16"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {t('visionTitle')}
                </h3>
                <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                  {t('visionStatement')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function useScrollAnimation(): [React.RefObject<HTMLDivElement>, boolean] {
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

  return [ref as React.RefObject<HTMLDivElement>, isVisible];
}