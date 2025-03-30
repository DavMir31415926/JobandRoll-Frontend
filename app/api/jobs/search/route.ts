import { NextRequest, NextResponse } from 'next/server';
import { branchHierarchy } from '../branches/data';

// Define the Job interface to match your actual data structure from Railway
interface Job {
  // Required fields (obligatory)
  id: number;
  title: string;
  location: string;
  branch: string;
  url: string;
  company_id: number;
  source: string;
  user_id: number;
  
  // Optional fields
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
  
  // For any additional properties that might be added in the future
  [key: string]: any;
}

// Helper function to normalize branch names (for case insensitive matching)
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

// Function to check if a branch matches another branch
function branchMatches(jobBranch: string, filterBranch: string): boolean {
  // Direct match (case insensitive)
  if (normalizeText(jobBranch) === normalizeText(filterBranch)) {
    return true;
  }
  
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'Englisch';
    const query = searchParams.get('q') || '';
    const branches = searchParams.getAll('branch'); // Get all branches as array
    const job_type = searchParams.get('job_type') || '';
    const experience_level = searchParams.get('experience_level') || '';
    const location = searchParams.get('location') || '';
    const salary_min = searchParams.get('salary_min') || '';
    
    // Build hierarchy maps
    const { parentMap, childrenMap } = buildBranchHierarchyMap();
    
    // For debugging
    console.log(`Filtering by branches: ${branches.join(', ')} (language: ${language})`);
    
    // Fetch jobs from your Railway API
    // Build the URL for your Railway API with language parameter
    // Fetch all jobs from your Railway API and filter them here
    const apiUrl = `https://jobandroll-backend-production.up.railway.app/api/jobs?language=all`;
    console.log('Fetching jobs from API:', apiUrl);

    // Fetch jobs from your Railway API
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
        
    if (!response.ok) {
      throw new Error(`API returned status code ${response.status}`);
    }
    
    const apiResponse = await response.json();
    let jobs: Job[] = apiResponse.jobs || []; // Adjust this based on your API's response structure+
    
    // Add detailed job language diagnostics
    console.log(`DETAILED JOB DATA: Got ${jobs.length} total jobs`);
    console.log('Job language breakdown:');
    const languageCounts = jobs.reduce((counts: any, job: any) => {
      const lang = job.language || 'undefined';
      counts[lang] = (counts[lang] || 0) + 1;
      return counts;
    }, {});
    console.log(languageCounts);

    // Log a few sample jobs with their languages
    console.log('Sample jobs with languages:');
    jobs.slice(0, 3).forEach((job: any) => {
      console.log(`Job ID ${job.id}, Title: "${job.title}", Language: "${job.language}"`);
    });

    console.log('Raw API response structure:', Object.keys(apiResponse));
  console.log('Jobs array length from API:', jobs.length);
  if (jobs.length > 0) {
    console.log('Sample job with full details:', jobs[0]);
  }

// Filter by language with detailed logging
if (language !== 'all') {
  console.log(`Filtering for EXACT language match: "${language}"`);
  
  // Log before filtering
  console.log(`Before filter: ${jobs.length} jobs`);
  
  // Filter with explicit case-sensitive equality and logging
  const beforeCount = jobs.length;
  jobs = jobs.filter(job => {
    const jobLang = job.language;
    const matches = jobLang === language;
    // Only log for the first few jobs to avoid console spam
    if (job.id < 10) {
      console.log(`Job ID ${job.id}: language="${jobLang}" matches="${matches}" (comparing with "${language}")`);
    }
    return matches;
  });
  
  // Log after filtering
  console.log(`After language filter: ${jobs.length} jobs remain (filtered out ${beforeCount - jobs.length})`);
}

    // Debug log to see jobs by locale
    console.log(`Total jobs from external API: ${jobs.length}`);
    console.log(`Jobs with language="de": ${jobs.filter(job => job.language === 'German').length}`);
    console.log(`Jobs with language="en": ${jobs.filter(job => job.language === 'Englisch').length}`);
    console.log('First few jobs:', jobs.slice(0, 3)); // Log first 3 jobs to inspect structure
    
    // Apply filters
    let filteredJobs: Job[] = [...jobs];
    
    // Filter by search query
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      filteredJobs = filteredJobs.filter((job) => {
        const searchableText = `${job.title} ${job.description || ''} ${job.location || ''} ${job.branch || ''}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });
    }
    
    // Filter by branches
    if (branches.length > 0) {
      filteredJobs = filteredJobs.filter((job) => {
        // Skip jobs without branch
        if (!job.branch) return false;
        
        // Check each selected branch
        for (const selectedBranch of branches) {
          // 1. Direct match
          if (branchMatches(job.branch, selectedBranch)) {
            return true;
          }
          
          // 2. If a parent category is selected, include jobs from subcategories
          const childBranches = childrenMap[selectedBranch] || [];
          if (childBranches.length > 0) {
            if (childBranches.some(childBranch => branchMatches(job.branch, childBranch))) {
              return true;
            }
          }
          
          // 3. If a subcategory is selected, also include jobs from the parent category
          const parentBranch = parentMap[selectedBranch];
          if (parentBranch && branchMatches(job.branch, parentBranch)) {
            return true;
          }
        }
        
        return false;
      });
    }
    
    // Filter by job type
    // Get job type range parameters
    const job_type_min = searchParams.get('job_type_min');
    const job_type_max = searchParams.get('job_type_max');

    // Filter by job type (exact match or range)
    if (job_type) {
      // Exact job type match
      filteredJobs = filteredJobs.filter((job) => 
        job.job_type && job.job_type.toLowerCase() === job_type.toLowerCase()
      );
    } else if (job_type_min || job_type_max) {
      // Job type range filtering
      console.log(`Filtering jobs by percentage range: ${job_type_min || '10'}% - ${job_type_max || '100'}%`);
      
      filteredJobs = filteredJobs.filter((job) => {
        // If job doesn't have job_type, include it in results 
        // (per your requirement to show jobs without job_type specified)
        if (!job.job_type) return true;
        
        // Extract the percentage from job_type (remove the % sign and convert to number)
        const jobPercentage = parseInt(job.job_type.replace('%', ''));
        if (isNaN(jobPercentage)) return true; // If not a valid percentage, include it
        
        // Check if job percentage is within the specified range
        const minPercentage = job_type_min ? parseInt(job_type_min) : 10;
        const maxPercentage = job_type_max ? parseInt(job_type_max) : 100;
        
        // Return true if job percentage is within range
        return jobPercentage >= minPercentage && jobPercentage <= maxPercentage;
      });
    }
    
    // Filter by experience level
    if (experience_level) {
      filteredJobs = filteredJobs.filter((job) => 
        job.experience_level && job.experience_level.toLowerCase() === experience_level.toLowerCase()
      );
    }
    
    // Filter by location
    if (location) {
      filteredJobs = filteredJobs.filter((job) => 
        job.location && job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Filter by minimum salary
    if (salary_min) {
      const minSalary = parseInt(salary_min);
      filteredJobs = filteredJobs.filter((job) => 
        (job.salary_min && job.salary_min >= minSalary) || 
        (job.salary_max && job.salary_max >= minSalary)
      );
    }

    // Sort jobs so that jobs matching the filter criteria exactly come first,
    // followed by jobs with no job_type specification
    if (job_type_min || job_type_max || job_type) {
      console.log('Sorting jobs: prioritizing exact matches before unspecified job types');
      
      // Create a custom sorting function
      filteredJobs.sort((a, b) => {
        // Case 1: If job A has job_type and job B doesn't, A comes first
        if (a.job_type && !b.job_type) return -1;
        
        // Case 2: If job B has job_type and job A doesn't, B comes first
        if (!a.job_type && b.job_type) return 1;
        
        // Case 3: Both have job_type or both don't have job_type
        // In this case, sort by creation date (newest first)
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    }

    // Return the filtered and sorted jobs
    return NextResponse.json({
      success: true,
      count: filteredJobs.length,
      jobs: filteredJobs
    });

    // Return the filtered jobs
    return NextResponse.json({
      success: true,
      count: filteredJobs.length,
      jobs: filteredJobs
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