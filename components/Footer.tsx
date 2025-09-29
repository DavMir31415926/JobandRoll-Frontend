// components/Footer.tsx
"use client";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';

const Footer = () => {
  const t = useTranslations('common');
  
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('Jopoly')}</h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              {t('footerTagline')}
            </p>
          </div>
          
          {/* Company Links */}
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
            &copy; {new Date().getFullYear()} Jopoly. {t('allRightsReserved')}
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <Link href="/contact" className="text-gray-400 hover:text-white flex items-center">
              <Mail size={16} className="mr-2" />
              contact@jopoly.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;