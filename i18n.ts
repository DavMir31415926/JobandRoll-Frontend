// i18n.ts
export const locales = ['en', 'de', 'fr', 'it'];
export const defaultLocale = 'en';

export default async function getRequestConfig({ locale }: { locale?: string }) {
  const currentLocale = locale || defaultLocale;
  
  // Load messages dynamically like in i18n/request.ts
  const messages = (await import(`./messages/${currentLocale}.json`)).default;
  
  return {
    locale: currentLocale,
    messages
  };
}