// app/api/jobs/search/route.ts
// Simplified implementation that correctly handles radius search

import { NextRequest, NextResponse } from 'next/server';
import { branchHierarchy } from '../branches/data';

// Define the Job interface to match your data structure
interface Job {
  id: number;
  title: string;
  location: string;
  branch: string;
  url: string;
  company_id: number;
  source: string;
  user_id: number;
  description?: string;
  requirements?: string;
  benefits?: string;
  salary_min?: number;
  salary_max?: number;
  job_type?: string;
  experience_level?: string;
  created_at?: string;
  language?: string;
  verified?: boolean;
  [key: string]: any;
}

// Helper function to normalize text (for case insensitive matching)
function normalizeText(text: string): string {
  return (text || '').toLowerCase().trim();
}

// Build a mapping of branch names to their parent categories
function buildBranchHierarchyMap() {
  const parentMap: Record<string, string> = {};
  const childrenMap: Record<string, string[]> = {};
  
  for (const category of branchHierarchy) {
    childrenMap[category.id] = category.subcategories.map(sub => sub.id);
    
    for (const subcategory of category.subcategories) {
      parentMap[subcategory.id] = category.id;
    }
  }
  
  return { parentMap, childrenMap };
}

// Function to check if branches match
function branchMatches(jobBranch: string, filterBranch: string): boolean {
  return normalizeText(jobBranch) === normalizeText(filterBranch);
}

export async function GET(request: NextRequest) {
  try {
    // Get all search parameters
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'Englisch';
    const query = searchParams.get('q') || '';
    const branches = searchParams.getAll('branch');
    const job_type = searchParams.get('job_type') || '';
    const job_type_min = searchParams.get('job_type_min');
    const job_type_max = searchParams.get('job_type_max');
    const experience_level = searchParams.get('experience_level') || '';
    const location = searchParams.get('location') || '';
    const locationId = searchParams.get('locationId');
    const salary_min = searchParams.get('salary_min') || '';
    
    // Create a copy of all parameters to send to backend
    const params = new URLSearchParams(searchParams.toString());
    
    // Make sure radius is properly included if present
    const radiusParam = searchParams.get('radius');
    if (radiusParam && parseInt(radiusParam) > 0) {
      console.log(`Processing radius search with ${radiusParam}km around location ${location} (ID: ${locationId})`);
      params.append('radius', radiusParam);
    }
    
    // Build the backend URL with all parameters
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
    const apiUrl = `${backendUrl}/api/jobs/search?${params.toString()}`;
    console.log('Calling backend API:', apiUrl);
    
    // Make the API call
    const response = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`API returned status code ${response.status}`);
    }
    
    // Get the response data
    const apiResponse = await response.json();
    let jobs: Job[] = apiResponse.jobs || [];
    
    // Log debug info
    console.log(`DETAILED JOB DATA: Got ${jobs.length} total jobs`);
    if (jobs.length > 0) {
      console.log('Sample job:', jobs[0]);
    }
    
    // Filter by language if needed 
    if (language !== 'all') {
      console.log(`Filtering for language match: "${language}"`);
      const beforeCount = jobs.length;
      jobs = jobs.filter(job => job.language === language);
      console.log(`After language filter: ${jobs.length} jobs (filtered out ${beforeCount - jobs.length})`);
    }
    
    // Return the jobs
    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs: jobs
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error searching jobs' 
      },
      { status: 500 }
    );
  }
}