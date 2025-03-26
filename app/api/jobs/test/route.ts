import { NextRequest, NextResponse } from 'next/server';

// Define the Job interface to match your data structure
interface Job {
  id: number;
  title: string;
  locale?: string;
  // Add other job properties as needed
  [key: string]: any; // Allow for other properties
}

export async function GET(request: NextRequest) {
  try {
    // Raw fetch from the external API
    const response = await fetch('https://jobandroll-backend-production.up.railway.app/api/jobs', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    // Log information about the jobs
    console.log(`Total jobs: ${data.jobs?.length || 0}`);
    
    if (data.jobs) {
      const deJobs = data.jobs.filter((job: Job) => job.locale === 'de');
      const enJobs = data.jobs.filter((job: Job) => job.locale === 'en');
      console.log(`Jobs with locale="de": ${deJobs.length}`);
      console.log(`Jobs with locale="en": ${enJobs.length}`);
      
      // Log the first German job if it exists
      if (deJobs.length > 0) {
        console.log('First German job:', deJobs[0]);
      }
    }
    
    // Return the raw data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}