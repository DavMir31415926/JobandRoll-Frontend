"use client";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

// Define a type for the messages object
type TranslationMessages = Record<string, Record<string, string>>;

// This component must be a client component
export default function TranslationProvider({
  locale,
  messages,
  children,
  timeZone = "Europe/Berlin"  // Add default timeZone parameter
}: {
  locale: string;
  messages: TranslationMessages;
  children: ReactNode;
  timeZone?: string;  // Make it optional with a type
}) {
  // Log to verify messages are available
  console.log("TranslationProvider received messages with keys:", Object.keys(messages));
  
  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages}
      timeZone={timeZone}  // Pass the timeZone to NextIntlClientProvider
    >
      {children}
    </NextIntlClientProvider>
  );
}