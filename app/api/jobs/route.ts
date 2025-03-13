// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { locales } from '@/i18n/request';

// Define a type for job data
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  tags: string[];
  posted: string;
  url: string;
}

// Mock job data - in a real application, this would come from a database
const jobsData = {
  en: [
    { id: 1, title: "Frontend Developer", company: "TechCorp", location: "Berlin", salary: "€50-70k", type: "Full-time", tags: ["React", "TypeScript", "Next.js"], posted: "2 days ago", url: "https://example.com/jobs/frontend-developer" },
    { id: 2, title: "UX Designer", company: "DesignStudio", location: "Remote", salary: "€40-55k", type: "Part-time", tags: ["Figma", "UI/UX", "Adobe XD"], posted: "5 days ago", url: "https://example.com/jobs/ux-designer" },
    { id: 3, title: "Product Manager", company: "StartupXYZ", location: "Munich", salary: "€70-90k", type: "Full-time", tags: ["Agile", "Scrum", "Product"], posted: "1 day ago", url: "https://example.com/jobs/product-manager" },
    { id: 4, title: "Backend Developer", company: "ServerPro", location: "Hamburg", salary: "€60-80k", type: "Full-time", tags: ["Node.js", "Python", "MongoDB"], posted: "3 days ago", url: "https://example.com/jobs/backend-developer" }
  ],
  de: [
    { id: 1, title: "Frontend-Entwickler", company: "TechCorp", location: "Berlin", salary: "€50-70k", type: "Vollzeit", tags: ["React", "TypeScript", "Next.js"], posted: "vor 2 Tagen", url: "https://example.com/jobs/frontend-entwickler" },
    { id: 2, title: "UX-Designer", company: "DesignStudio", location: "Remote", salary: "€40-55k", type: "Teilzeit", tags: ["Figma", "UI/UX", "Adobe XD"], posted: "vor 5 Tagen", url: "https://example.com/jobs/ux-designer" },
    { id: 3, title: "Produktmanager", company: "StartupXYZ", location: "München", salary: "€70-90k", type: "Vollzeit", tags: ["Agile", "Scrum", "Produkt"], posted: "vor 1 Tag", url: "https://example.com/jobs/produktmanager" },
    { id: 4, title: "Backend-Entwickler", company: "ServerPro", location: "Hamburg", salary: "€60-80k", type: "Vollzeit", tags: ["Node.js", "Python", "MongoDB"], posted: "vor 3 Tagen", url: "https://example.com/jobs/backend-entwickler" }
  ]
};

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const locale = searchParams.get('locale') || 'en';
    const query = searchParams.get('query')?.toLowerCase() || '';
    
    try {
      // Instead of using mock data, fetch from your actual backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
      
      // Pass the locale and query to your backend
      const response = await fetch(
        `${backendUrl}/api/jobs?locale=${locale}${query ? `&query=${encodeURIComponent(query)}` : ''}`
      );
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }
      
      // Forward the response from your backend
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