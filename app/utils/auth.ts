import { NextRequest } from 'next/server';

export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // If no Authorization header, check cookies
  const cookies = request.cookies;
  const tokenCookie = cookies.get('token');
  
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}