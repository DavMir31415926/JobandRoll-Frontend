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
  
  const getLanguageLabel = (loc: string) => {
    switch (loc) {
      case 'en': return '🇬🇧 English';
      case 'de': return '🇩🇪 Deutsch';
      case 'fr': return '🇫🇷 Français';
      case 'it': return '🇮🇹 Italiano';
      default: return loc;
    }
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
            {getLanguageLabel(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}