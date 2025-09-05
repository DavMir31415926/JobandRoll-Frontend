// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'de', 'fr', 'it'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Load messages dynamically
  const messages = (await import(`../messages/${locale}.json`)).default;
  
  return {
    messages,
    timeZone: 'Europe/Berlin'
  };
});