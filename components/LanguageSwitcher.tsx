// components/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    // Create the new path with the selected locale
    const currentPath = pathname;
    // Remove the locale prefix from the current path
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '');
    // Create new path with new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };
  
  return (
    <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-md">
      <Globe size={18} className="text-blue-600 mr-1" />
      <select 
        onChange={handleChange} 
        value={locale} 
        className="bg-transparent border-none font-medium text-blue-800 text-sm cursor-pointer focus:outline-none"
        aria-label="Select language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === 'en' ? '🇬🇧 English' : '🇩🇪 Deutsch'}
          </option>
        ))}
      </select>
    </div>
  );
}



/*'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
  
    const currentPath = pathname;
    
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '');
    
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };
  
  return (
    <select 
      onChange={handleChange} 
      value={locale} 
      className="language-selector"
      aria-label="Select language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc === 'en' ? '🇬🇧 English' : '🇩🇪 Deutsch'}
        </option>
      ))}
    </select>
  );
}*/
