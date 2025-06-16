import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/app/utils/auth';

// Add this GET method to handle company listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const locale = searchParams.get('locale') || 'en';
    const query = searchParams.get('query')?.toLowerCase() || '';
    
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
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    );
  }
}

// The POST method we added earlier
export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
    const response = await fetch(`${backendUrl}/api/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to create company' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}