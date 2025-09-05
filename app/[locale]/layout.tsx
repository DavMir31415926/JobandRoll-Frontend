// app/[locale]/layout.tsx - UPDATED
import { ReactNode } from "react";
import LocaleWrapper from "@/components/LocaleWrapper";
// Direct static imports
import enMessages from '../../messages/en.json';
import deMessages from '../../messages/de.json';
import frMessages from '../../messages/fr.json';
import itMessages from '../../messages/it.json';
import { locales } from "@/i18n";
import { redirect } from "next/navigation";

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface RootLayoutProps {
  children: ReactNode;
  params: any;
}

export default function LocaleLayout(props: RootLayoutProps) {
  let currentLocale = "";
  
  try {
    currentLocale = props["params"]["locale"];
    
    if (!locales.some(l => l === currentLocale)) {
      redirect("/en");
    }
  } catch (e) {
    currentLocale = "en";
  }
  
  // Get messages based on locale
  const getMessages = (locale: string) => {
    switch (locale) {
      case 'en': return enMessages;
      case 'de': return deMessages;
      case 'fr': return frMessages;
      case 'it': return itMessages;
      default: return enMessages;
    }
  };

  const messages = getMessages(currentLocale);

  return (
    <LocaleWrapper 
      locale={currentLocale} 
      messages={messages}
    >
      {props.children}
    </LocaleWrapper>
  );
}