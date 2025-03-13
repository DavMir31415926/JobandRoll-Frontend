// app/api/[locale]/companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { locales } from '@/i18n/request';

// Define a type for company data
interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: string;
  description: string;
}

// Type for the companies data object
type CompaniesData = {
  [key in 'en' | 'de']: Company[];
};

// Mock company data - in a real application, this would come from a database
const companiesData: CompaniesData = {
  en: [
    { id: 1, name: "TechCorp", industry: "Technology", location: "Berlin", employees: "50-200", description: "Innovative tech solutions" },
    { id: 2, name: "DesignStudio", industry: "Design", location: "Remote", employees: "10-50", description: "Creative design agency" },
    { id: 3, name: "StartupXYZ", industry: "Software", location: "Munich", employees: "10-50", description: "Next-gen software solutions" },
    { id: 4, name: "ServerPro", industry: "Cloud Services", location: "Hamburg", employees: "50-200", description: "Enterprise cloud infrastructure" }
  ],
  de: [
    { id: 1, name: "TechCorp", industry: "Technologie", location: "Berlin", employees: "50-200", description: "Innovative Technologielösungen" },
    { id: 2, name: "DesignStudio", industry: "Design", location: "Remote", employees: "10-50", description: "Kreative Designagentur" },
    { id: 3, name: "StartupXYZ", industry: "Software", location: "München", employees: "10-50", description: "Next-Gen Softwarelösungen" },
    { id: 4, name: "ServerPro", industry: "Cloud-Dienste", location: "Hamburg", employees: "50-200", description: "Enterprise-Cloud-Infrastruktur" }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  const { locale } = params;
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('query')?.toLowerCase() || '';
  
  // Validate locale
  if (!locales.includes(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }
  
  // Get companies for the specified locale
  const companies = locale === 'de' ? companiesData.de : companiesData.en;
  
  // Filter companies based on search query if provided
  const filteredCompanies = query 
    ? companies.filter((company) => 
        company.name.toLowerCase().includes(query) || 
        company.industry.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query) ||
        company.description.toLowerCase().includes(query)
      )
    : companies;
  
  return NextResponse.json({
    locale,
    companies: filteredCompanies,
    totalCompanies: filteredCompanies.length,
    query: query || null
  });
}