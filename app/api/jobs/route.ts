// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/app/utils/auth';

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

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    
    // Add debug logging
    console.log('Frontend API received job data:', body);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
    const response = await fetch(`${backendUrl}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    // Add more debug logging
    console.log('Backend response status:', response.status);
    console.log('Backend response data:', data);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to create job' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}