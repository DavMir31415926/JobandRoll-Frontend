import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/app/utils/auth';

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
    const response = await fetch(`${backendUrl}/api/user/jobs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch jobs' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}