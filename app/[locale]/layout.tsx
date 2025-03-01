// app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Add this
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TranslationProvider from "@/components/TranslationProvider";

// Direct static imports
import enMessages from '../../messages/en.json';
import deMessages from '../../messages/de.json';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface RootLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  // Extract locale
  if (!locales.includes(params.locale)) notFound();
  
  // Select the right message file
  const messages = params.locale === 'en' ? enMessages : deMessages;
  
  return (
    <html lang={params.locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen">
        <TranslationProvider locale={params.locale} messages={messages}>
          <Navbar />
          <div className="language-switcher-container absolute top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </TranslationProvider>
      </body>
    </html>
  );
}



/*
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TranslationProvider from "@/components/TranslationProvider";


import enMessages from '../../messages/en.json';
import deMessages from '../../messages/de.json';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface RootLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({ children, params }: RootLayoutProps) {

  if (!locales.includes(params.locale)) notFound();
  

  const messages = params.locale === 'en' ? enMessages : deMessages;
  
  return (
    <html lang={params.locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <TranslationProvider locale={params.locale} messages={messages}>
          <Navbar />
          <LanguageSwitcher />
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}*/