// i18n/request.ts
export const locales = ['en', 'de'];
export const defaultLocale = 'en';

export default async function getRequestConfig({ locale }: { locale?: string }) {
  // Explicitly return locale to satisfy the warning
  return {
    locale: locale || defaultLocale,
    messages: {} // Messages will be loaded in layout component
  };
}