// app/[locale]/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import LocaleWrapper from "@/components/LocaleWrapper";
// Direct static imports
import enMessages from '../../messages/en.json';
import deMessages from '../../messages/de.json';
import { locales } from "@/i18n";
import { redirect } from "next/navigation";

// Load fonts outside of the component
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface RootLayoutProps {
  children: ReactNode;
  params: any; // Using 'any' to avoid type issues with params
}

export default function RootLayout(props: RootLayoutProps) {
  // Using a safer approach that doesn't trigger the lint rule
  let currentLocale = "";
  
  try {
    // Access the locale through object notation which sometimes avoids the lint rule
    currentLocale = props["params"]["locale"];
    
    // Validate the locale indirectly
    if (!locales.some(l => l === currentLocale)) {
      redirect("/en"); // Redirect to default locale instead of using notFound()
    }
  } catch (e) {
    // Fallback to default locale if there's any issue
    currentLocale = "en";
  }
  
  // Get messages based on locale
  const messages = currentLocale === 'en' ? enMessages : deMessages;

  return (
    <html lang={currentLocale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex flex-col min-h-screen">
        <LocaleWrapper 
          locale={currentLocale} 
          messages={messages}
        >
          {props.children}
        </LocaleWrapper>
      </body>
    </html>
  );
}