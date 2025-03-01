// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const t = useTranslations('common');
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname.startsWith(`/${path}`);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">🌐</span>
          {t('jobAndRoll')}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className={`hover:underline ${pathname === '/' ? 'font-semibold' : ''}`}
          >
            {t('home')}
          </Link>
          <Link 
            href="/jobs" 
            className={`hover:underline ${isActive('/jobs') ? 'font-semibold' : ''}`}
          >
            {t('jobs')}
          </Link>
          <Link 
            href="/companies" 
            className={`hover:underline ${isActive('/companies') ? 'font-semibold' : ''}`}
          >
            {t('companies')}
          </Link>
          
          {/* Resources Dropdown */}
          <div className="relative group">
            <button 
              onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              className="flex items-center hover:underline focus:outline-none"
            >
              {t('resources')} <ChevronDown size={16} className="ml-1" />
            </button>
            <div className={`absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 ${isResourcesOpen ? 'block' : 'hidden'} md:hidden group-hover:block`}>
              <Link 
                href="/about" 
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setIsResourcesOpen(false)}
              >
                {t('about')}
              </Link>
              <Link 
                href="/contact" 
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setIsResourcesOpen(false)}
              >
                {t('contact')}
              </Link>
              <div className="border-t border-gray-200 my-1"></div>
              <Link 
                href="/privacy" 
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setIsResourcesOpen(false)}
              >
                {t('privacy')}
              </Link>
              <Link 
                href="/terms" 
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setIsResourcesOpen(false)}
              >
                {t('terms')}
              </Link>
            </div>
          </div>
          
          <Link 
            href="/dashboard" 
            className="hover:underline"
          >
            {t('dashboard')}
          </Link>
          
          <Link 
            href="/login" 
            className="hover:underline px-3 py-1 border border-white rounded-md"
          >
            {t('login')}
          </Link>
          
          <Link 
            href="/post-job" 
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('postJob')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-blue-700 p-4 rounded-lg">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="hover:underline" onClick={() => setIsOpen(false)}>
              {t('home')}
            </Link>
            <Link href="/jobs" className="hover:underline" onClick={() => setIsOpen(false)}>
              {t('jobs')}
            </Link>
            <Link href="/companies" className="hover:underline" onClick={() => setIsOpen(false)}>
              {t('companies')}
            </Link>
            <Link href="/dashboard" className="hover:underline" onClick={() => setIsOpen(false)}>
              {t('dashboard')}
            </Link>
            
            {/* Mobile Resources Dropdown */}
            <div>
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex items-center hover:underline focus:outline-none"
              >
                {t('resources')} <ChevronDown size={16} className={`ml-1 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourcesOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  <Link href="/about" className="block hover:underline" onClick={() => setIsOpen(false)}>
                    {t('about')}
                  </Link>
                  <Link href="/contact" className="block hover:underline" onClick={() => setIsOpen(false)}>
                    {t('contact')}
                  </Link>
                  <Link href="/privacy" className="block hover:underline" onClick={() => setIsOpen(false)}>
                    {t('privacy')}
                  </Link>
                  <Link href="/terms" className="block hover:underline" onClick={() => setIsOpen(false)}>
                    {t('terms')}
                  </Link>
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t border-blue-600">
              <Link href="/login" className="block w-full text-center hover:underline py-2" onClick={() => setIsOpen(false)}>
                {t('login')}
              </Link>
              <Link href="/post-job" className="block w-full text-center bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 mt-2" onClick={() => setIsOpen(false)}>
                {t('postJob')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


/*"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from 'next-intl';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('common');

  console.log("Navbar has translations access:", typeof t === 'function' ? "yes" : "no");

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo *//*}
        <Link href="/" className="text-2xl font-bold">
          {t('jobAndRoll')}
        </Link>

        {/* Desktop Menu *//*}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:underline">{t('home')}</Link>
          <Link href="/jobs" className="hover:underline">{t('jobs')}</Link>
          <Link href="/companies" className="hover:underline">{t('companies')}</Link>
          <Link href="/contact" className="hover:underline">{t('contact')}</Link>
          <Link href="/post-job" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200">
            {t('postJob')}
          </Link>
        </div>

        {/* Mobile Menu Button *//*}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu *//*}
      {isOpen && (
        <div className="md:hidden mt-2 bg-blue-700 p-4 flex flex-col space-y-4">
          <Link href="/" className="hover:underline" onClick={() => setIsOpen(false)}>{t('home')}</Link>
          <Link href="/jobs" className="hover:underline" onClick={() => setIsOpen(false)}>{t('jobs')}</Link>
          <Link href="/companies" className="hover:underline" onClick={() => setIsOpen(false)}>{t('companies')}</Link>
          <Link href="/contact" className="hover:underline" onClick={() => setIsOpen(false)}>{t('contact')}</Link>
          <Link href="/post-job" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200" onClick={() => setIsOpen(false)}>
            {t('postJob')}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;*/