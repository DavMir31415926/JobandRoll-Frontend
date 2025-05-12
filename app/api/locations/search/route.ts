// app/api/locations/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define an interface for location objects
interface Location {
  id: number;
  name: string;
  country: string;
  admin_level1?: string | null;
  admin_level2?: string | null;
  postal_code?: string | null;
  latitude?: number;
  longitude?: number;
  population?: number;
  [key: string]: any; // Allow for additional properties
}

// Calculate Levenshtein distance between two strings
function levenshteinDistance(a: string, b: string): number {
  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    
    // Forward the request to your backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
    const response = await fetch(`${backendUrl}/api/locations/search?q=${encodeURIComponent(q)}`);
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    // Get the results from the backend
    let locations: Location[] = await response.json();
    
    // If no exact matches found and the query has at least 3 characters,
    // try fuzzy matching if the backend returned less than 5 results
    if (locations.length < 5 && q.length >= 3) {
      // Get more potential matches to perform fuzzy matching
      const fuzzyResponse = await fetch(`${backendUrl}/api/locations/search?q=${encodeURIComponent(q.substring(0, 3))}`);
      
      if (fuzzyResponse.ok) {
        const fuzzyLocations: Location[] = await fuzzyResponse.json();
        
        // Calculate Levenshtein distance for each location
        fuzzyLocations.forEach(loc => {
          // Similarity score: lower is better
          loc.similarity = levenshteinDistance(q.toLowerCase(), loc.name.toLowerCase());
        });
        
        // Filter to only include locations with reasonable similarity
        // Adjust the threshold as needed
        const maxDistance = Math.max(2, Math.floor(q.length / 3));
        const similarLocations = fuzzyLocations.filter(loc => 
          loc.similarity <= maxDistance && 
          !locations.some(existingLoc => existingLoc.id === loc.id)
        );
        
        // Add the similar locations to our result set
        locations = [...locations, ...similarLocations];
      }
    }
    
    // Sort the locations by population if they have this field
    // If not, we'll use a predefined list of major cities to prioritize
    const majorCities = [
      "Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", 
      "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Vienna", "Zurich"
    ];
    
    // Convert query to lowercase for case-insensitive comparison
    const qLower = q.toLowerCase();
    
    // Sort locations
    locations.sort((a: Location, b: Location) => {
      // If location name exactly matches the search query, prioritize it
      const aExactMatch = a.name.toLowerCase() === qLower;
      const bExactMatch = b.name.toLowerCase() === qLower;
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      // If we have similarity scores from fuzzy matching, use them
      if (a.similarity !== undefined && b.similarity !== undefined) {
        return a.similarity - b.similarity;
      } else if (a.similarity !== undefined) {
        return -1; // Prioritize fuzzy matches over non-matches
      } else if (b.similarity !== undefined) {
        return 1;
      }
      
      // If location is a known major city, prioritize it
      const aIsMajor = majorCities.some(city => 
        a.name.toLowerCase() === city.toLowerCase());
      const bIsMajor = majorCities.some(city => 
        b.name.toLowerCase() === city.toLowerCase());
      
      if (aIsMajor && !bIsMajor) return -1;
      if (!aIsMajor && bIsMajor) return 1;
      
      // If the location has population data, use that
      if (a.population && b.population) {
        return b.population - a.population;
      }
      
      // If only one location has population
      if (a.population && !b.population) return -1;
      if (!a.population && b.population) return 1;
      
      // Default to alphabetical sorting
      return a.name.localeCompare(b.name);
    });
    
    // Return the sorted locations
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}