"use client";
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// Animation variants for team section
const teamContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const teamItemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Enhanced team section
export default function AboutPage() {
  const t = useTranslations('about');
  
  const founders = [
    {
      name: t('founder1Name'), // "Leopold Schlemmer"
      role: t('founder1Role'), // "Co-founder & CEO"
      bio: t('founder1Bio'), // Biography text
      quote: t('founder1Quote'), // Quote text
      image: "/images/team/leopold.PNG"
    },
    {
      name: t('founder2Name'), // "David Mirkovic"
      role: t('founder2Role'), // "Co-founder & CTO"
      bio: t('founder2Bio'), // Biography text
      quote: t('founder2Quote'), // Quote text
      image: "/images/team/david.PNG"
    }
  ];
  
  // Refs for scroll animations
  const [teamRef, teamIsVisible] = useScrollAnimation();
  
  return (
    <div className="bg-white">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={teamRef}
            initial="hidden"
            animate={teamIsVisible ? "visible" : "hidden"}
            variants={teamContainerVariants}
            className="max-w-6xl mx-auto"
          >
            <motion.h2 
              variants={teamItemVariants}
              className="text-3xl md:text-4xl font-bold mb-3 text-center"
            >
              {t('title')}
            </motion.h2>
            
            <motion.p 
              variants={teamItemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-16"
            >
              {t('teamDescription')}
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              {founders.map((founder, index) => (
                <motion.div 
                  key={index}
                  variants={teamItemVariants}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-8">
                      <div className="rounded-full border-4 border-white/40 shadow-lg w-36 h-36 overflow-hidden transform transition-transform duration-500 hover:scale-105">
                        <img 
                          src={founder.image} 
                          alt={founder.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 p-8">
                      <div className="flex items-center mb-3">
                        <h3 className="text-2xl font-bold text-gray-800">{founder.name}</h3>
                        <div className="h-px bg-blue-500 flex-grow ml-4"></div>
                      </div>
                      <p className="text-blue-600 font-medium mb-4 text-lg">{founder.role}</p>
                      <p className="text-gray-600 mb-6 leading-relaxed">{founder.bio}</p>
                      <div className="italic text-gray-700 border-l-4 border-blue-500 pl-4 text-lg">
                        "{founder.quote}"
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              variants={teamItemVariants}
              className="text-center"
            >
              <div className="bg-blue-50 rounded-xl p-8 max-w-3xl mx-auto mb-10">
                <p className="text-lg text-gray-700 leading-relaxed">
                 {t('teamFooter')}
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
  const ref = useRef<HTMLDivElement>(null); // Add proper typing here
  
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