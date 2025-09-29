// app/api/jobs/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Log to debug
    console.log('Frontend /api/jobs/search received params:', Object.fromEntries(searchParams.entries()));
    
    // Build backend URL - explicitly preserve ALL parameters
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
    const backendSearchParams = new URLSearchParams();
    
    // Copy ALL parameters from the incoming request
    for (const [key, value] of searchParams.entries()) {
      backendSearchParams.append(key, value);
    }
    
    const apiUrl = `${backendUrl}/api/jobs/search?${backendSearchParams.toString()}`;
    console.log('Forwarding to backend:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Log what we're returning
    console.log(`Returning ${data.count} jobs, page ${data.page}, total ${data.total}`);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}