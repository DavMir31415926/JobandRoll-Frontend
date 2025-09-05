// app/api/jobs/search/route.ts
// Enhanced implementation that correctly handles total count and pagination

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
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
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
    
    params.set('page', page);
    params.set('limit', limit);

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
    let totalCount = apiResponse.total || 0;
    
    // Log debug info
    console.log(`DETAILED JOB DATA: Got ${jobs.length} jobs on page ${page}, total: ${totalCount}`);
    if (jobs.length > 0) {
      console.log('Sample job:', jobs[0]);
    }
    
    // Filter by language if needed 
    if (language !== 'all') {
      console.log(`Filtering for language match: "${language}"`);
      const beforeCount = jobs.length;
      const beforeTotal = totalCount;
      
      jobs = jobs.filter(job => job.language === language);
      
      // If we filtered the results, we need to adjust the total count proportionally
      // This is an approximation since we don't know the exact total after language filtering
      // For a more accurate count, the backend should handle language filtering
      if (beforeCount > 0) {
        const filterRatio = jobs.length / beforeCount;
        totalCount = Math.round(beforeTotal * filterRatio);
      }
      
      console.log(`After language filter: ${jobs.length} jobs (filtered out ${beforeCount - jobs.length})`);
      console.log(`Estimated total after language filter: ${totalCount}`);
    }
    
    // Return the jobs with proper pagination info
    return NextResponse.json({
      success: true,
      jobs: jobs,
      count: jobs.length, // Jobs on this page
      total: totalCount, // Total jobs matching the search across all pages
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / parseInt(limit))
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