// components/LocalizedApiData.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

interface ApiResponse {
  locale: string;
  message: string;
  serverTime: string;
  translationSample: string;
}

export default function LocalizedApiData() {
  const locale = useLocale();
  const t = useTranslations('common');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/${locale}/example`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const apiData = await response.json();
        setData(apiData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [locale]); // Re-fetch when locale changes

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{t('apiDataTitle') || 'API Data'}</h2>
      
      {loading && (
        <div className="text-blue-600 animate-pulse">
          {t('loading') || 'Loading...'}
        </div>
      )}
      
      {error && (
        <div className="text-red-600">
          {t('error') || 'Error'}: {error}
        </div>
      )}
      
      {data && (
        <div className="space-y-2">
          <p><span className="font-semibold">{t('locale') || 'Locale'}:</span> {data.locale}</p>
          <p><span className="font-semibold">{t('message') || 'Message'}:</span> {data.message}</p>
          <p><span className="font-semibold">{t('serverTime') || 'Server Time'}:</span> {data.serverTime}</p>
          <p><span className="font-semibold">{t('translationSample') || 'Translation Sample'}:</span> {data.translationSample}</p>
        </div>
      )}
    </div>
  );
}