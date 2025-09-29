"use client";
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Users, Mail, FileText } from 'lucide-react';

export default function PrivacyPage() {
  const t = useTranslations('privacy');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  const sections = [
    {
      icon: FileText,
      title: t('section1Title'),
      content: t('section1Content')
    },
    {
      icon: Eye,
      title: t('section2Title'), 
      content: t('section2Content')
    },
    {
      icon: Users,
      title: t('section3Title'),
      content: t('section3Content')
    },
    {
      icon: Lock,
      title: t('section4Title'),
      content: t('section4Content')
    },
    {
      icon: Shield,
      title: t('section5Title'),
      content: t('section5Content')
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {t('subtitle')}
            </p>
            <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full text-sm text-blue-700 border border-blue-200">
              <FileText className="h-4 w-4 mr-2" />
              {t('lastUpdated')}: {new Date().toLocaleDateString()}
            </div>
          </motion.div>

          {/* Quick Overview */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">{t('quickOverviewTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6" />
                </div>
                <p className="font-medium">{t('overview1')}</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <p className="font-medium">{t('overview2')}</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="font-medium">{t('overview3')}</p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-start">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <section.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                      {section.title}
                    </h2>
                    <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-800 rounded-2xl p-8 text-white text-center mt-12"
          >
            <Mail className="h-12 w-12 mx-auto mb-4 text-blue-400" />
            <h2 className="text-2xl font-bold mb-4">{t('contactTitle')}</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('contactContent')}
            </p>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 max-w-md mx-auto">
              <a 
                href="mailto:contact@jopoly.com" 
                className="text-blue-400 font-semibold text-lg hover:text-blue-300 transition-colors"
              >
                contact@jopoly.com
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}