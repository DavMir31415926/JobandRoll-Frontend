// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const t = useTranslations('common');
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useUser();
  
  const isActive = (path: string) => {
    return pathname.startsWith(`/${path}`);
  };

  const handleLogout = () => {
    logout();
    // Close menus after logout
    setIsUserMenuOpen(false);
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">🌐</span>
          {t('Jopoly')}
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
          
          {/* Conditional links based on authentication state */}
          {isAuthenticated && (
            <>
              {user?.role === 'employer' && (
                <Link 
                  href="/dashboard" 
                  className={`hover:underline ${isActive('/dashboard') ? 'font-semibold' : ''}`}
                >
                  {t('dashboard')}
                </Link>
              )}
            </>
          )}
          
          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center hover:underline px-3 py-1 border border-white rounded-md"
              >
                <User size={16} className="mr-2" />
                {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || t('account')}
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              {/* User dropdown menu */}
              <div className={`absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 ${isUserMenuOpen ? 'block' : 'hidden'}`}>
                {user?.role === 'employer' && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 hover:bg-blue-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t('dashboard')}
                    </Link>
                    <Link 
                      href="/companies/create" 
                      className="block px-4 py-2 hover:bg-blue-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t('createCompany')}
                    </Link>
                    <Link 
                      href="/post-job" 
                      className="block px-4 py-2 hover:bg-blue-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t('postJob')}
                    </Link>
                  </>
                )}
                {user?.role === 'jobseeker' && (
                  <>
                    <Link 
                      href="/saved-jobs" 
                      className="block px-4 py-2 hover:bg-blue-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t('savedJobs')}
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 hover:bg-blue-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                  </>
                )}
                <div className="border-t border-gray-200 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-blue-100 text-red-600"
                >
                  <LogOut size={16} className="mr-2" />
                  {t('logout')}
                </button>
              </div>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="hover:underline px-3 py-1 border border-white rounded-md"
            >
              {t('login')}
            </Link>
          )}
          
          {/* Post Job button - only visible for non-authenticated or employers */}
          {(!isAuthenticated || (isAuthenticated && user?.role === 'employer')) && (
            <Link 
              href={isAuthenticated ? "/post-job" : "/login?redirect=/post-job"}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('postJob')}
            </Link>
          )}
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
            
            {/* Conditional Dashboard link */}
            {isAuthenticated && user?.role === 'employer' && (
              <Link href="/dashboard" className="hover:underline" onClick={() => setIsOpen(false)}>
                {t('dashboard')}
              </Link>
            )}
            
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
            
            {/* Authentication links */}
            <div className="pt-2 border-t border-blue-600">
              {isAuthenticated ? (
                <>
                  {/* User-specific links */}
                  {user?.role === 'employer' && (
                    <>
                      <Link href="/companies/create" className="block hover:underline py-1" onClick={() => setIsOpen(false)}>
                        {t('createCompany')}
                      </Link>
                      <Link href="/post-job" className="block hover:underline py-1" onClick={() => setIsOpen(false)}>
                        {t('postJob')}
                      </Link>
                    </>
                  )}
                  {user?.role === 'jobseeker' && (
                    <>
                      <Link href="/saved-jobs" className="block hover:underline py-1" onClick={() => setIsOpen(false)}>
                        {t('savedJobs')}
                      </Link>
                      <Link href="/profile" className="block hover:underline py-1" onClick={() => setIsOpen(false)}>
                        {t('profile')}
                      </Link>
                    </>
                  )}
                  
                  {/* Logout button */}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full text-left hover:underline py-1 text-red-300 mt-2"
                  >
                    <LogOut size={16} className="mr-2" />
                    {t('logout')}
                  </button>
                </>
              ) : (
                <Link href="/login" className="block w-full text-center hover:underline py-2" onClick={() => setIsOpen(false)}>
                  {t('login')}
                </Link>
              )}
              
              {/* Post Job button - only visible for non-authenticated or employers */}
              {(!isAuthenticated || (isAuthenticated && user?.role === 'employer')) && (
                <Link 
                  href={isAuthenticated ? "/post-job" : "/login?redirect=/post-job"}
                  className="block w-full text-center bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 mt-2" 
                  onClick={() => setIsOpen(false)}
                >
                  {t('postJob')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;