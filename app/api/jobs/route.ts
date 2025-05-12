// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const locale = searchParams.get('locale') || 'en';
  const query = searchParams.get('query') || '';
  const branch = searchParams.getAll('branch');
  const job_type = searchParams.get('job_type') || '';
  const job_type_min = searchParams.get('job_type_min') || '';
  const job_type_max = searchParams.get('job_type_max') || '';
  const experience_level = searchParams.get('experience_level') || '';
  const location = searchParams.get('location') || '';
  const locationId = searchParams.get('locationId') || '';
  const radius = searchParams.get('radius') || '0'; // Add radius parameter
  const salary_min = searchParams.get('salary_min') || '';
  const language = searchParams.get('language') || 'all';
  
  try {
    // Prepare query parameters to send to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
    
    // Build the URL with all filter parameters
    const urlParams = new URLSearchParams();
    if (query) urlParams.append('q', query);
    if (locale) urlParams.append('locale', locale);
    if (language && language !== 'all') urlParams.append('language', language);
    
    // Add branch parameters (multiple possible)
    branch.forEach(b => urlParams.append('branch', b));
    
    // Add other filter parameters
    if (job_type) urlParams.append('job_type', job_type);
    if (job_type_min) urlParams.append('job_type_min', job_type_min);
    if (job_type_max) urlParams.append('job_type_max', job_type_max);
    if (experience_level) urlParams.append('experience_level', experience_level);
    if (salary_min) urlParams.append('salary_min', salary_min);
    
    // Handle location parameters with radius
    if (locationId && radius && parseInt(radius) > 0) {
      console.log(`Adding radius parameter: ${radius}km around location ID ${locationId}`);
      
      // Simply forward both parameters to your backend
      urlParams.append('locationId', locationId);
      urlParams.append('radius', radius);
    } else if (locationId) {
      // Normal location search by ID
      urlParams.append('locationId', locationId);
    } else if (location) {
      // Text-based location search
      urlParams.append('location', location);
    }
    
    // Build the final URL
    const apiUrl = `${backendUrl}/api/jobs/search?${urlParams.toString()}`;
    console.log('Calling backend API:', apiUrl);
    
    // Fetch from backend
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    // Forward the response
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