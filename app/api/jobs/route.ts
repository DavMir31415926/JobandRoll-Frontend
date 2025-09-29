// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/app/utils/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  
  // If there's a search query, return an error
  const query = searchParams.get('q');
  if (query && query.trim()) {
    return NextResponse.json(
      { error: 'Search queries should use /api/jobs/search endpoint' },
      { status: 400 }
    );
  }
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
    
    // CRITICAL FIX: Forward ALL parameters from the request
    const backendParams = new URLSearchParams();
    
    // Copy every parameter from the incoming request
    for (const [key, value] of searchParams.entries()) {
      backendParams.append(key, value);
    }
    
    const apiUrl = `${backendUrl}/api/jobs/search?${backendParams.toString()}`;
    console.log('Calling backend with URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    
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