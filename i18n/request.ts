// i18n/request.ts
export const locales = ['en', 'de'];
export const defaultLocale = 'en';

export default function getRequestConfig() {
  return {
    locales,
    defaultLocale,
    messages: {} // Messages are handled in the layout
  };
}