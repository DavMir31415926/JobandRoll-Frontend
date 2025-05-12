'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  postal_code: string | null;
  admin_level1: string | null;
  admin_level2: string | null;
  country: string;
  latitude: number;
  longitude: number;
}

interface LocationFilterProps {
  onLocationSelect: (location: Location | null) => void;
  selectedLocation?: Location | null;
  className?: string;
  placeholder?: string;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ 
  onLocationSelect, 
  selectedLocation = null,
  className = '',
  placeholder = 'Enter location...'
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  
  // Set initial display value if a location is already selected
  useEffect(() => {
    if (selectedLocation) {
      setQuery(formatLocationName(selectedLocation));
    }
  }, [selectedLocation]);
  
  // Fetch location suggestions when user types
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    // Don't search if the query is already a formatted location
    if (selectedLocation && formatLocationName(selectedLocation) === query) {
      return;
    }
    
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce API calls
    const timeoutId = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [query, selectedLocation]);
  
  // Format location name for display
  const formatLocationName = (location: Location): string => {
    return `${location.name}${location.admin_level1 ? `, ${location.admin_level1}` : ''} (${location.country})`;
  };
  
  // Handle location selection
  const handleSelect = (location: Location) => {
    onLocationSelect(location);
    setQuery(formatLocationName(location));
    setSuggestions([]);
  };
  
  // Handle clearing the selection
  const handleClear = () => {
    setQuery('');
    onLocationSelect(null);
    setSuggestions([]);
    inputRef.current?.focus();
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className={`location-filter relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {isLoading && (
          <div className="absolute right-2 top-2.5 text-gray-400">
            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          </div>
        )}
        
        {query && !isLoading && (
          <button 
            onClick={handleClear}
            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {suggestions.length > 0 && isFocused && (
        <ul 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((location) => (
            <li
            key={location.id}
            onClick={() => onLocationSelect(location)}
            className="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
            >
            <div className="font-medium">
                {location.name.split(' ')[0]} {/* Show only the city name without codes */}
            </div>
            <div className="text-sm text-gray-600">
                {location.admin_level1 && <span className="mr-1">{location.admin_level1},</span>}
                <span>{location.country}</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                {!location.admin_level2 && location.admin_level1 ? "State/Bundesland" : "City"}
                </span>
            </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationFilter;

