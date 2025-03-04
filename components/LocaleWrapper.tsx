"use client";

import { ReactNode } from "react";
import TranslationProvider from "@/components/TranslationProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface LocaleWrapperProps {
  locale: string;
  messages: any;
  children: ReactNode;
}

export default function LocaleWrapper({ locale, messages, children }: LocaleWrapperProps) {
  return (
    <TranslationProvider locale={locale} messages={messages} timeZone="Europe/Berlin">
      <Navbar />
      <div className="language-switcher-container absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </TranslationProvider>
  );
}