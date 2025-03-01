"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

// Define a type for the messages object
type TranslationMessages = Record<string, Record<string, string>>;

// This component must be a client component
export default function TranslationProvider({
  locale,
  messages,
  children
}: {
  locale: string;
  messages: TranslationMessages;
  children: ReactNode;
}) {
  // Log to verify messages are available
  console.log("TranslationProvider received messages with keys:", Object.keys(messages));
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}


/*"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

export default function TranslationProvider({
  locale,
  messages,
  children
}: {
  locale: string;
  messages: any;
  children: ReactNode;
}) {
  console.log("TranslationProvider received messages with keys:", Object.keys(messages));
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}*/