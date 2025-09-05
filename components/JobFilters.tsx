'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Filter, Briefcase, Building2, GraduationCap, DollarSign, ChevronDown, ChevronUp, ChevronRight, Search, X, Square, CheckSquare, MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { geoNamesAdmin1ToDERegions, geoNamesAdmin1ToATRegions, geoNamesAdmin1ToCHRegions } from '../src/utils/geoNamesMapping';


interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

interface FiltersProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
}

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


export default function JobFilters({ onFilterChange, initialFilters = {} }: FiltersProps) {
  const t = useTranslations();
  const tJobs = useTranslations('jobs');
  const locale = useLocale();
  
  // States
  const [branches, setBranches] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [branchError, setBranchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [locationQuery, setLocationQuery] = useState(initialFilters.location || '');
  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationSuggestionsRef = useRef<HTMLUListElement>(null);
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  const [filters, setFilters] = useState({
    branch: Array.isArray(initialFilters.branch) ? initialFilters.branch : [],
    job_type: initialFilters.job_type || '',
    job_type_min: initialFilters.job_type_min || '10', 
    job_type_max: initialFilters.job_type_max || '100', 
    experience_level: initialFilters.experience_level || '',
    location: initialFilters.location || '',
    locationId: initialFilters.locationId,
    radius: initialFilters.radius || '0',
    salary_min: initialFilters.salary_min || '',
    language: initialFilters.language || 'all',
  });

  const formatLocationDisplayName = (location: Location): string => {
    if (!location) return '';
    
    // Apply corrections for known issues
    let adminLevel1 = location.admin_level1;
    
    // Get the region name based on country
    let regionName = adminLevel1;
    
    if (location.country === 'DE' && adminLevel1) {
      regionName = geoNamesAdmin1ToDERegions[adminLevel1] || adminLevel1;
    } else if (location.country === 'AT' && adminLevel1) {
      regionName = geoNamesAdmin1ToATRegions[adminLevel1] || adminLevel1;
    } else if (location.country === 'CH' && adminLevel1) {
      regionName = geoNamesAdmin1ToCHRegions[adminLevel1] || adminLevel1;
    }
    
    if (regionName) {
      return `${location.name}, ${regionName} (${location.country})`;
    }
    
    // Default format for other countries
    return `${location.name}${adminLevel1 ? `, ${adminLevel1}` : ''} (${location.country})`;
  };

  // Helper functions for dragging
const handleMinThumbDrag = (initialClientX: number) => {
  const track = document.getElementById('slider-track');
  if (!track) return;
  
  const handleMove = (clientX: number) => {
    const rect = track.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const value = Math.round((percentage * 90 + 10) / 10) * 10; // Round to nearest 10
    
    if (value <= parseInt(filters.job_type_max)) {
      handleFilterChange('job_type_min', value.toString());
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };
  
  const handleEnd = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
};

const handleMaxThumbDrag = (initialClientX: number) => {
  const track = document.getElementById('slider-track');
  if (!track) return;
  
  const handleMove = (clientX: number) => {
    const rect = track.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const value = Math.round((percentage * 90 + 10) / 10) * 10; // Round to nearest 10
    
    if (value >= parseInt(filters.job_type_min)) {
      handleFilterChange('job_type_max', value.toString());
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      e.preventDefault(); // Prevent scrolling while dragging
      handleMove(e.touches[0].clientX);
    }
  };
  
  const handleEnd = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
};
  
// Try to get translations for branch names, using the display name as fallback
const getBranchTranslation = (branchName: string) => {
    try {
      // Try to get the translation using the exact branch name as the key
      return t(`branch.${branchName}`, { fallback: branchName });
    } catch (error) {
      // If there was an error with translation, use the original name
      return branchName;
    }
  };

  // Functions for getting displayable names - use translations
const getDisplayName = (category: Category) => {
    // Use translated name instead of direct name
    return getBranchTranslation(category.name);
  };
  
  const getSubcategoryDisplayName = (subcategory: SubCategory) => {
    // Use translated name instead of direct name
    return getBranchTranslation(subcategory.name);
  };
  
  // Search results with display names
  const [searchResults, setSearchResults] = useState<{
    id: string, 
    name: string, 
    displayName: string, 
    type: 'category' | 'subcategory', 
    parentId?: string
  }[]>([]);

  // Toggle a filter section expansion
  const toggleFilterExpansion = (filterName: string) => {
    setExpandedFilters(prev => 
      prev.includes(filterName)
        ? prev.filter(name => name !== filterName)
        : [...prev, filterName]
    );
  };
  
  // Fetch branches
  useEffect(() => {
    async function fetchBranches() {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs/branches');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.branches)) {
          // Store the branches directly - they should already have properly formatted names
          setBranches(data.branches);
          
          // Auto-expand categories that have selected values
          if (filters.branch.length > 0) {
            const categoriesToExpand = new Set<string>();
            
            for (const category of data.branches) {
              // If the category name is selected, expand it
              if (filters.branch.includes(category.name)) {
                categoriesToExpand.add(category.id);
              }
              
              // If any subcategory is selected, expand the parent
              for (const subcategory of category.subcategories) {
                if (filters.branch.includes(subcategory.name)) {
                  categoriesToExpand.add(category.id);
                  break;
                }
              }
            }
            
            setExpandedCategories(Array.from(categoriesToExpand));
          }
        } else {
          setBranchError('Failed to load branch categories');
        }
      } catch (error) {
        setBranchError('Error loading branch categories');
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBranches();
  }, []);

  // Branch search functionality
  useEffect(() => {
    if (searchTerm.length >= 2 && branches.length > 0) {
      const results: {id: string, name: string, displayName: string, type: 'category' | 'subcategory', parentId?: string}[] = [];
      const searchTermLower = searchTerm.toLowerCase();
      
      branches.forEach(category => {
        // Get only the translated name for the current locale
        const translatedName = getBranchTranslation(category.name).toLowerCase();
        
        // Search only in the translated name
        if (translatedName.includes(searchTermLower)) {
          results.push({
            id: category.id,
            name: category.name,
            displayName: getBranchTranslation(category.name),
            type: 'category'
          });
        }
        
        // Search in subcategories - using translated names only
        category.subcategories.forEach(subcategory => {
          const translatedSubName = getBranchTranslation(subcategory.name).toLowerCase();
          
          if (translatedSubName.includes(searchTermLower)) {
            results.push({
              id: subcategory.id,
              name: subcategory.name,
              displayName: getBranchTranslation(subcategory.name),
              type: 'subcategory',
              parentId: category.id
            });
          }
        });
      });
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, branches]);

  // Add this with your other useEffect hooks
  useEffect(() => {
    if (!locationQuery || locationQuery.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    
    // Don't search if the query is a selected location
    if (selectedLocation && 
        `${selectedLocation.name}${selectedLocation.admin_level1 ? `, ${selectedLocation.admin_level1}` : ''} (${selectedLocation.country})` === locationQuery) {
      return;
    }
    
    const fetchLocations = async () => {
      setIsLocationLoading(true);
      try {
        const response = await fetch(`/api/locations/search?q=${encodeURIComponent(locationQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setLocationSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLocationLoading(false);
      }
    };
    
    // Debounce API calls
    const timeoutId = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [locationQuery, selectedLocation]);

  // Close location suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationSuggestionsRef.current && 
        !locationSuggestionsRef.current.contains(event.target as Node) &&
        !locationInputRef.current?.contains(event.target as Node)
      ) {
        setIsLocationFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // Handle filter changes for non-branch filters
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    console.log("Filter changed:", key, value, newFilters);
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Branch-specific functions
  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isSelected = (branchId: string) => filters.branch.includes(branchId);

  const toggleBranchSelection = (branchName: string, branchId?: string) => {
    // For filtering, we need to use the ID, not the display name
    const valueToUse = branchId || branchName;
    
    let newBranches: string[];
    
    if (isSelected(valueToUse)) {
      // Remove the branch
      newBranches = filters.branch.filter((name: string) => name !== valueToUse);
    } else {
      // Add the branch
      newBranches = [...filters.branch, valueToUse];
    }
    
    const newFilters = {
      ...filters,
      branch: newBranches
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleCategoryWithSubcategories = (category: Category) => {
    // For filtering, we need to use the ID, not the display name
    const categoryId = category.id;
    const subcategoryIds = category.subcategories.map(subcat => subcat.id);
    const allIds = [categoryId, ...subcategoryIds];
    
    // Check if all subcategories are already selected
    const allSelected = allIds.every(id => isSelected(id));
    
    let newBranches: string[];
    if (allSelected) {
      // If all are selected, remove all
      newBranches = filters.branch.filter((name: string) => !allIds.includes(name));
    } else {
      // Otherwise, add all that aren't already selected
      newBranches = [...filters.branch];
      for (const id of allIds) {
        if (!newBranches.includes(id)) {
          newBranches.push(id);
        }
      }
    }
    
    const newFilters = {
      ...filters,
      branch: newBranches
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchResultSelect = (result: {id: string, name: string, displayName: string, type: 'category' | 'subcategory', parentId?: string}) => {
    // Toggle this branch in the selection using the ID
    toggleBranchSelection(result.name, result.id);
    
    // If it's a subcategory, expand its parent category
    if (result.type === 'subcategory' && result.parentId) {
      setExpandedCategories(prev => 
        prev.includes(result.parentId!) ? prev : [...prev, result.parentId!]
      );
    }
    
    setSearchTerm('');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Function to check if all subcategories of a category are selected
  const areAllSubcategoriesSelected = (category: Category) => {
    return category.subcategories.every(subcat => isSelected(subcat.id));
  };

  // Function to check if some (but not all) subcategories are selected
  const areSomeSubcategoriesSelected = (category: Category) => {
    const selectedSubcats = category.subcategories.filter(subcat => isSelected(subcat.id));
    return selectedSubcats.length > 0 && selectedSubcats.length < category.subcategories.length;
  };

  // Render the checkbox icon based on selection state
  const renderCheckbox = (isChecked: boolean, isIndeterminate: boolean = false) => {
    if (isIndeterminate) {
      return (
        <div className="w-5 h-5 border border-blue-500 rounded flex items-center justify-center bg-white">
          <div className="w-3 h-3 bg-blue-500"></div>
        </div>
      );
    }
    
    return isChecked ? (
      <CheckSquare className="w-5 h-5 text-blue-600" />
    ) : (
      <Square className="w-5 h-5 text-gray-400" />
    );
  };

  // Add these helper functions for location
  const formatLocationName = (location: Location): string => {
    return formatLocationDisplayName(location);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocationQuery(formatLocationName(location));
    setLocationSuggestions([]);
    
    // When selecting a location, always reset radius to 0 initially
    const newFilters = { 
      ...filters, 
      location: location.name,
      locationId: location.id,
      radius: '0'
    };
    
    // Log the selection to help with debugging
    console.log(`Selected location: ${location.name} (ID: ${location.id})`);
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationClear = () => {
    setLocationQuery('');
    setSelectedLocation(null);
    setLocationSuggestions([]);
    
    const newFilters = { 
      ...filters, 
      location: '',
      locationId: undefined,
      radius: '0'
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
    
    if (locationInputRef.current) {
      locationInputRef.current.focus();
    }
  };

  // Job Types
  const jobTypes = [
    { value: '100%', label: tJobs('100%') },
    { value: '90%', label: tJobs('90%') },
    { value: '80%', label: tJobs('80%') },
    { value: '70%', label: tJobs('70%') },
    { value: '60%', label: tJobs('60%') },
    { value: '50%', label: tJobs('50%') },
    { value: '40%', label: tJobs('40%') },
    { value: '30%', label: tJobs('30%') },
    { value: '20%', label: tJobs('20%') },
    { value: '10%', label: tJobs('10%') }
  ];

  // Experience Levels
  const experienceLevels = [
    { value: 'entry', label: tJobs('entryLevel') },
    { value: 'mid', label: tJobs('midLevel') },
    { value: 'senior', label: tJobs('seniorLevel') },
    { value: 'executive', label: tJobs('executiveLevel') }
  ];

  // Salary Ranges
  const salaryRanges = [
    { value: '30000', label: '€30,000+' },
    { value: '50000', label: '€50,000+' },
    { value: '70000', label: '€70,000+' },
    { value: '100000', label: '€100,000+' },
    { value: '150000', label: '€150,000+' }
  ];

  const languages = [
    { value: 'all', label: tJobs('allLanguages') },
    { value: 'English', label: tJobs('english') },
    { value: 'German', label: tJobs('german') },
    { value: 'French', label: tJobs('french') },
    { value: 'Italian', label: tJobs('italian') }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-4">
        <Filter className="mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">{tJobs('filterJobs')}</h3>      </div>

      <div className="space-y-4">
        {/* Branch/Industry Filter - Collapsible */}
        <div className="filter-group">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => toggleFilterExpansion('branch')}
          >
            <label className="block text-sm font-medium text-gray-800 mb-1">
              <Building2 className="inline-block w-4 h-4 mr-1" />
              {tJobs('industry')}
              {filters.branch.length > 0 && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {filters.branch.length}
                </span>
              )}
            </label>
            {expandedFilters.includes('branch') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedFilters.includes('branch') && (
            <div className="mt-2 border border-gray-200 rounded p-3">
              {/* Branch loading state */}
              {loading ? (
                <div className="flex justify-center py-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : branchError ? (
                <div className="text-red-500 text-sm py-2">{branchError}</div>
              ) : (
                <div>
                  {/* Search input */}
                  <div className="mb-3">
                    <div className="relative flex items-center">
                      <Search className="absolute left-2 h-4 w-4 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={tJobs('searchIndustries')}
                        className="pl-8 pr-8 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {searchTerm && (
                        <button 
                          onClick={handleClearSearch}
                          className="absolute right-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">{tJobs('searchResults')}</div>
                      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-100">
                        {searchResults.map(result => (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleSearchResultSelect(result)}
                            className="w-full text-left p-2 text-sm hover:bg-gray-50 transition-colors flex items-center"
                          >
                              <span className="mr-2">
                                {renderCheckbox(isSelected(result.id))}
                              </span>
                              <span className="mr-2 text-xs px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                {result.type === 'category' ? tJobs('mainCategory') : tJobs('subCategory')}
                              </span>
                              <span className={isSelected(result.id) ? 'font-medium' : ''}>
                                {result.displayName}
                              </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* "All Industries" option */}
                  {!searchTerm && (
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          const newFilters = { ...filters, branch: [] };
                          setFilters(newFilters);
                          onFilterChange(newFilters);
                        }}
                        className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center ${
                          filters.branch.length === 0 ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-2">
                          {renderCheckbox(filters.branch.length === 0)}
                        </span>
                        {tJobs('allIndustries')}
                      </button>
                    </div>
                  )}
                  
                  {/* Categories list */}
                  {!searchTerm && (
                    <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                      {branches.map((category) => {
                        const isCategorySelected = isSelected(category.id);
                        const allSubsSelected = areAllSubcategoriesSelected(category);
                        const someSubsSelected = areSomeSubcategoriesSelected(category);
                        const isIndeterminate = isCategorySelected ? false : someSubsSelected;
                        const isChecked = isCategorySelected || allSubsSelected;
                        
                        return (
                          <div key={category.id} className="category">
                            <div 
                              className={`flex items-center justify-between px-3 py-2 cursor-pointer rounded transition-colors hover:bg-gray-100 ${
                                (isCategorySelected || allSubsSelected) ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div 
                                className="flex-grow text-left flex items-center"
                                onClick={() => toggleCategoryWithSubcategories(category)}
                              >
                                <span className="mr-2">
                                  {renderCheckbox(isChecked, isIndeterminate)}
                                </span>
                                <span className={isChecked ? 'font-medium text-gray-800' : 'text-gray-700'}>
                                  {getDisplayName(category)}
                                </span>
                              </div>
                              <button 
                                onClick={(e) => toggleCategory(category.id, e)}
                                className="ml-2 focus:outline-none"
                                aria-label={expandedCategories.includes(category.id) ? "Collapse" : "Expand"}
                              >
                                {expandedCategories.includes(category.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            
                            {expandedCategories.includes(category.id) && (
                              <div className="ml-4 pl-2 border-l border-gray-200 mt-1 space-y-1">
                                {category.subcategories.map((subcategory) => (
                                  <button
                                    key={subcategory.id}
                                    onClick={() => toggleBranchSelection(subcategory.name, subcategory.id)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors hover:bg-gray-100 flex items-center ${
                                      isSelected(subcategory.id) ? 'bg-blue-50' : ''
                                    }`}
                                  >
                                    <span className="mr-2">
                                      {renderCheckbox(isSelected(subcategory.id))}
                                    </span>
                                    <span className={isSelected(subcategory.id) ? 'font-medium text-gray-800' : 'text-gray-700'}>
                                      {getSubcategoryDisplayName(subcategory)}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Language Filter */}
        <div className="filter-group">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => toggleFilterExpansion('language')}
          >
            <label className="block text-sm font-medium text-gray-800 mb-1">
              <Globe className="inline-block w-4 h-4 mr-1" />
              {tJobs('language')}
              {filters.language && filters.language !== 'all' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  1
                </span>
              )}
            </label>
            {expandedFilters.includes('language') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedFilters.includes('language') && (
            <div className="mt-2">
              <select
                id="language-filter"
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value} className="text-gray-800">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Job Type Filter - Improved Range Slider */}
        <div className="filter-group">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => toggleFilterExpansion('job_type')}
          >
            <label className="block text-sm font-medium text-gray-800 mb-1">
              <Briefcase className="inline-block w-4 h-4 mr-1" />
              {tJobs('jobType')}
              {(filters.job_type_min !== '10' || filters.job_type_max !== '100') && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  1
                </span>
              )}
            </label>
            {expandedFilters.includes('job_type') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedFilters.includes('job_type') && (
            <div className="mt-4 px-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">{filters.job_type_min}%</span>
                <span className="text-sm text-gray-600">{filters.job_type_max}%</span>
              </div>
              
              <div className="mt-4 mb-6">
                <div className="relative h-7" id="slider-track">
                  {/* Track Background */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 -mt-0.5 bg-gray-200 rounded"></div>
                  
                  {/* Colored Track */}
                  <div 
                    className="absolute top-1/2 h-1 -mt-0.5 bg-blue-500 rounded"
                    style={{
                      left: `${((parseInt(filters.job_type_min) - 10) / 90) * 100}%`,
                      right: `${(100 - parseInt(filters.job_type_max)) / 90 * 100}%`
                    }}
                  ></div>
                  
                  {/* Minimum Thumb */}
                  <div
                    className="absolute w-5 h-5 top-1/2 -mt-2.5 bg-white border-2 border-blue-500 rounded-full cursor-pointer" 
                    style={{
                      left: `${((parseInt(filters.job_type_min) - 10) / 90) * 100}%`,
                      marginLeft: "-10px", // Half of the width to center it
                      // Shift slightly left when values are the same
                      transform: filters.job_type_min === filters.job_type_max ? 'translateX(-4px)' : 'translateX(0)',
                      zIndex: 10
                    }}
                    onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      handleMinThumbDrag(e.clientX);
                    }}
                    onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
                      if (e.touches.length > 0) {
                        e.preventDefault();
                        handleMinThumbDrag(e.touches[0].clientX);
                      }
                    }}
                  >
                    <div className="absolute inset-0 m-auto w-1 h-1 bg-blue-500 rounded-full"></div>
                  </div>

                  {/* Maximum Thumb */}
                  <div
                    className="absolute w-5 h-5 top-1/2 -mt-2.5 bg-white border-2 border-blue-500 rounded-full cursor-pointer" 
                    style={{
                      left: `${((parseInt(filters.job_type_max) - 10) / 90) * 100}%`,
                      marginLeft: "-10px", // Half of the width to center it
                      // Shift slightly right when values are the same
                      transform: filters.job_type_min === filters.job_type_max ? 'translateX(4px)' : 'translateX(0)',
                      zIndex: 10
                    }}
                    onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      handleMaxThumbDrag(e.clientX);
                    }}
                    onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
                      if (e.touches.length > 0) {
                        e.preventDefault();
                        handleMaxThumbDrag(e.touches[0].clientX);
                      }
                    }}
                  >
                    <div className="absolute inset-0 m-auto w-1 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                
                {/* Value markers */}
                <div className="flex justify-between mt-1 px-2.5">
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
                    <div 
                      key={value} 
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => {
                        // When clicking directly on a marker, set the nearest handle
                        const distToMin = Math.abs(value - parseInt(filters.job_type_min));
                        const distToMax = Math.abs(value - parseInt(filters.job_type_max));
                        
                        if (distToMin <= distToMax) {
                          // Set minimum if it's not greater than max
                          if (value <= parseInt(filters.job_type_max)) {
                            handleFilterChange('job_type_min', value.toString());
                          }
                        } else {
                          // Set maximum if it's not less than min
                          if (value >= parseInt(filters.job_type_min)) {
                            handleFilterChange('job_type_max', value.toString());
                          }
                        }
                      }}
                    >
                      <div className="h-2 w-0.5 bg-gray-300"></div>
                      <span className="text-xs text-gray-500 mt-1">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Experience Level Filter */}
        <div className="filter-group">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => toggleFilterExpansion('experience_level')}
          >
            <label className="block text-sm font-medium text-gray-800 mb-1">
              <GraduationCap className="inline-block w-4 h-4 mr-1" />
              {tJobs('experienceLevel')}
              {filters.experience_level && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  1
                </span>
              )}
            </label>
            {expandedFilters.includes('experience_level') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedFilters.includes('experience_level') && (
            <div className="mt-2">
              <select
                id="experience-filter"
                value={filters.experience_level}
                onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="" className="text-gray-800">{tJobs('allExperience')}</option>
                {experienceLevels.map((level) => (
                  <option key={level.value} value={level.value} className="text-gray-800">
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="filter-group">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => toggleFilterExpansion('location')}
          >
            <label className="block text-sm font-medium text-gray-800 mb-1">
              <MapPin className="inline-block w-4 h-4 mr-1" />
              {tJobs('location')}
              {(filters.location || filters.locationId) && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  1
                </span>
              )}
            </label>
            {expandedFilters.includes('location') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedFilters.includes('location') && (
            <div className="mt-2">
              <div className="relative">
                <input
                  ref={locationInputRef}
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onFocus={() => setIsLocationFocused(true)}
                  placeholder={tJobs('locationPlaceholder')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {isLocationLoading && (
                  <div className="absolute right-2 top-2.5 text-gray-400">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                  </div>
                )}
                
                {locationQuery && !isLocationLoading && (
                  <button 
                    onClick={handleLocationClear}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {locationSuggestions.length > 0 && isLocationFocused && (
                <ul 
                  ref={locationSuggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto"
                >
                  {locationSuggestions.map((location) => (
                    <li
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-gray-600">
                        {location.country === 'DE' || location.country === 'AT' 
                          ? formatLocationDisplayName(location).split(', ')[1] 
                          : location.admin_level1 ? `${location.admin_level1}, ${location.country}` : location.country}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Radius selector - Add after location input */}
          {selectedLocation && (
            <div className="mt-2">
              <label className="block text-xs text-gray-600 mb-1">{tJobs('radius') || 'Radius (km)'}</label>
              <select
                value={filters.radius}
                onChange={(e) => {
                  // Log the change to help with debugging
                  console.log(`Changing radius to ${e.target.value}km`);
                  handleFilterChange('radius', e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">{tJobs('exactLocation') || 'Exact location only'}</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="15">15 km</option>
                <option value="20">20 km</option>
                <option value="25">25 km</option>
                <option value="30">30 km</option>
                <option value="40">40 km</option>
                <option value="50">50 km</option>
                <option value="60">60 km</option>
                <option value="70">70 km</option>
                <option value="80">80 km</option>
                <option value="90">90 km</option>
                <option value="100">100 km</option>
              </select>
            </div>
          )}
        </div>

        {/* Salary Filter */}
        <div className="filter-group">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => toggleFilterExpansion('salary_min')}
          >
            <label className="block text-sm font-medium text-gray-800 mb-1">
              <DollarSign className="inline-block w-4 h-4 mr-1" />
              {tJobs('minimumSalary')}
              {filters.salary_min && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  1
                </span>
              )}
            </label>
            {expandedFilters.includes('salary_min') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedFilters.includes('salary_min') && (
            <div className="mt-2">
              <select
                id="salary-filter"
                value={filters.salary_min}
                onChange={(e) => handleFilterChange('salary_min', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="" className="text-gray-800">{tJobs('anySalary')}</option>
                {salaryRanges.map((range) => (
                  <option key={range.value} value={range.value} className="text-gray-800">
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Filter Actions */}
        <div className="flex justify-between pt-4">
          <motion.button
            type="button"
            onClick={() => {
              const clearedFilters = {
                branch: [],
                job_type: '',
                job_type_min: '10',  // Add this line
                job_type_max: '100', // Add this line
                experience_level: '',
                location: '',
                locationId: undefined,
                radius: '0',
                salary_min: '',
                language: 'all',
              };
              setFilters(clearedFilters);
              onFilterChange(clearedFilters);
            }}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tJobs('clearFilters')}
          </motion.button>
          
          <motion.button
            type="button"
            onClick={() => onFilterChange(filters)}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tJobs('applyFilters')}
          </motion.button>
        </div>
      </div>
    </div>
  );
}