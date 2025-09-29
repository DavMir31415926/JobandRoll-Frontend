"use client";
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Lightbulb, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  
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

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('suggestionsTitle')}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t('suggestionsDesc')}
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <HelpCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('questionsTitle')}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t('questionsDesc')}
              </p>
            </motion.div>
          </div>

          {/* Main Contact Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('getInTouchTitle')}
            </h2>
            
            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
              {t('getInTouchDesc')}
            </p>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-white border-opacity-30">
              <div className="flex items-center justify-center space-x-3">
                <Mail className="h-6 w-6" />
                <a 
                  href="mailto:contact@jopoly.com" 
                  className="text-2xl font-semibold hover:text-blue-200 transition-colors duration-300"
                >
                  contact@jopoly.com
                </a>
              </div>
            </div>
            
            <p className="mt-6 text-lg opacity-90">
              {t('responseTime')}
            </p>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {t('feedbackTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('feedbackDesc')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}