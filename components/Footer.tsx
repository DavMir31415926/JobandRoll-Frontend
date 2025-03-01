// components/Footer.tsx
"use client";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const t = useTranslations('common');
  
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('jobAndRoll')}</h3>
            <p className="text-gray-400 mb-4">
              {t('footerTagline')}
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" className="text-gray-400 hover:text-white">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* For Job Seekers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('forJobSeekers')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-white">
                  {t('browseJobs')}
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-400 hover:text-white">
                  {t('companies')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white">
                  {t('dashboard')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white">
                  {t('createAccount')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('forEmployers')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/post-job" className="text-gray-400 hover:text-white">
                  {t('postJob')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-400 hover:text-white">
                  {t('resources')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('company')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} JobAndRoll. {t('allRightsReserved')}
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <Link href="/contact" className="text-gray-400 hover:text-white flex items-center">
              <Mail size={16} className="mr-2" />
              contact@jobandroll.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;