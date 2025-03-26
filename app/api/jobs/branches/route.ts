import { NextRequest, NextResponse } from 'next/server';
import { branchHierarchy, getAllBranchNames } from './data';

// Function to create localized branch hierarchy
function getLocalizedBranchHierarchy(locale: string) {
  // Return the original branch hierarchy structure
  // The translation of names will happen on the client side
  return branchHierarchy;
}

export async function GET(request: NextRequest) {
  try {
    // Get the locale parameter if provided
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'Englisch';
    console.log(`LANGUAGE FILTER DEBUG: Received language parameter value: "${language}"`);
    const format = searchParams.get('format') || 'hierarchical';
    
    console.log('Next.js API route called with language:', language);
    console.log('All search params:', Object.fromEntries(searchParams.entries()));

    // Get the localized branch hierarchy
    const localizedBranches = getLocalizedBranchHierarchy(language);
    
    // Return the branches in the requested format
    if (format === 'flat') {
      return NextResponse.json({
        success: true,
        branches: getAllBranchNames()
      });
    } else {
      return NextResponse.json({
        success: true,
        branches: localizedBranches
      });
    }
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}