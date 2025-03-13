// app/api/companies/route.ts
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

// Mock company data - in a real application, this would come from a database
const companiesData = {
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

// app/api/companies/route.ts
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const locale = searchParams.get('locale') || 'en';
    const query = searchParams.get('query')?.toLowerCase() || '';
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
      
      const response = await fetch(
        `${backendUrl}/api/companies?locale=${locale}${query ? `&query=${encodeURIComponent(query)}` : ''}`
      );
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching from backend:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data from backend' },
        { status: 500 }
      );
    }
  }