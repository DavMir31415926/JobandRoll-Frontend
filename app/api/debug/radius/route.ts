// app/api/debug/radius/route.ts
// This is a helper route to test if our backend is correctly handling radius searches

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get('locationId') || '';
    const radius = searchParams.get('radius') || '0';
    
    if (!locationId) {
      return NextResponse.json({ error: 'locationId is required' }, { status: 400 });
    }
    
    console.log(`Testing radius search: ${radius}km around location ID ${locationId}`);
    
    // Make a direct call to the backend locations endpoint
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
    const locationsUrl = `${backendUrl}/api/locations/radius/${locationId}/${radius}`;
    
    console.log(`Fetching locations in radius from: ${locationsUrl}`);
    
    const locationsResponse = await fetch(locationsUrl);
    
    if (!locationsResponse.ok) {
      throw new Error(`Locations API returned status code ${locationsResponse.status}`);
    }
    
    const locationsData = await locationsResponse.json();
    
    // Now make a search request with these locations
    const locations = locationsData.locations || [];
    
    console.log(`Found ${locations.length} locations in ${radius}km radius`);
    
    if (locations.length > 0) {
      // Extract location names for the job search
      const locationNames = locations.map((loc: any) => loc.name).join(',');
      
      // Make a job search request with these locations
      const jobsUrl = `${backendUrl}/api/jobs/search?radius_search=true&locations=${encodeURIComponent(locationNames)}`;
      
      console.log(`Searching jobs with locations: ${jobsUrl}`);
      
      const jobsResponse = await fetch(jobsUrl);
      
      if (!jobsResponse.ok) {
        throw new Error(`Jobs API returned status code ${jobsResponse.status}`);
      }
      
      const jobsData = await jobsResponse.json();
      
      // Return the combined debug information
      return NextResponse.json({
        success: true,
        radius: radius,
        sourceLocationId: locationId,
        locationsFound: locations.length,
        locations: locations.map((loc: any) => ({ 
          id: loc.id, 
          name: loc.name,
          distance: loc.distance 
        })),
        jobsFound: jobsData.jobs?.length || 0,
        jobs: jobsData.jobs || []
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No locations found in radius",
        radius: radius,
        sourceLocationId: locationId
      });
    }
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}