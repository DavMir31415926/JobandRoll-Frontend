'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronRight, ChevronUp, Search, X, Square, CheckSquare, Filter } from 'lucide-react';

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

interface BranchFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const BranchFilter: React.FC<BranchFilterProps> = ({ value = [], onChange }) => {
  const t = useTranslations();
  const tJobs = useTranslations('jobs');
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [branches, setBranches] = useState<Category[]>([]);
  const [translatedBranches, setTranslatedBranches] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{id: string, name: string, type: 'category' | 'subcategory', parentId?: string}[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Function to translate branch name using the exact branch name as the key
const translateBranchName = (branchName: string) => {
    return t(`branch.${branchName}`, { fallback: branchName });
  };

  // This function should be properly translating the branch names
  const createTranslatedBranches = (originalBranches: Category[]): Category[] => {
    return originalBranches.map(category => ({
      id: category.id,
      name: translateBranchName(category.id),
      subcategories: category.subcategories.map(subcategory => ({
        id: subcategory.id,
        name: translateBranchName(subcategory.id)
      }))
    }));
  };

  useEffect(() => {
    async function fetchBranches() {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs/branches');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.branches)) {
          setBranches(data.branches);
          
          // Create translated version of branches
          const translated = createTranslatedBranches(data.branches);
          setTranslatedBranches(translated);
          
          // Auto-expand categories that have selected values
          if (value.length > 0) {
            const categoriesToExpand = new Set<string>();
            
            for (const category of data.branches) {
              // If the category name is selected, expand it
              if (value.includes(category.name)) {
                categoriesToExpand.add(category.id);
              }
              
              // If any subcategory is selected, expand the parent
              for (const subcategory of category.subcategories) {
                if (value.includes(subcategory.name)) {
                  categoriesToExpand.add(category.id);
                  break;
                }
              }
            }
            
            setExpandedCategories(Array.from(categoriesToExpand));
          }
        } else {
          setError('Failed to load branch categories');
        }
      } catch (error) {
        setError('Error loading branch categories');
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBranches();
  }, []);

  // First, find where searchResults is being generated
  useEffect(() => {
    if (searchTerm.length >= 2 && branches.length > 0) {
      const results: {
        id: string;
        name: string;
        type: 'category' | 'subcategory';
        parentId?: string;
      }[] = [];
      
      const searchTermLower = searchTerm.toLowerCase();
      
      // Search through the original branches and their translations
      branches.forEach(category => {
        // Get both original and translated names
        const originalName = category.id;
        const translatedName = translateBranchName(category.id);
        
        // Check if either name contains the search term
        if (originalName.toLowerCase().includes(searchTermLower) || 
            translatedName.toLowerCase().includes(searchTermLower)) {
          results.push({
            id: category.id,
            name: translatedName, // Use the translated name for display
            type: 'category'
          });
        }
        
        // Search through subcategories
        category.subcategories.forEach(subcategory => {
          const originalSubName = subcategory.id;
          const translatedSubName = translateBranchName(subcategory.id);
          
          // Check if either name contains the search term
          if (originalSubName.toLowerCase().includes(searchTermLower) || 
              translatedSubName.toLowerCase().includes(searchTermLower)) {
            results.push({
              id: subcategory.id,
              name: translatedSubName, // Use the translated name for display
              type: 'subcategory',
              parentId: category.id
            });
          }
        });
      });
      
      console.log('Search term:', searchTermLower);
      console.log('Search results:', results.map(r => r.name));
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, branches, translateBranchName]);

  // Toggle the filter visibility
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isSelected = (branchName: string) => value.includes(branchName);

  const toggleBranchSelection = (branchName: string) => {
    if (isSelected(branchName)) {
      // Remove the branch
      onChange(value.filter(name => name !== branchName));
    } else {
      // Add the branch
      onChange([...value, branchName]);
    }
  };

  const toggleCategoryWithSubcategories = (category: Category) => {
    const allNames = [category.name, ...category.subcategories.map(subcat => subcat.name)];
    
    // Check if all subcategories are already selected
    const allSelected = allNames.every(name => isSelected(name));
    
    if (allSelected) {
      // If all are selected, remove all
      onChange(value.filter(name => !allNames.includes(name)));
    } else {
      // Otherwise, add all that aren't already selected
      const newValue = [...value];
      for (const name of allNames) {
        if (!newValue.includes(name)) {
          newValue.push(name);
        }
      }
      onChange(newValue);
    }
  };

  const handleSearchResultSelect = (result: {id: string, name: string, type: 'category' | 'subcategory', parentId?: string}) => {
    // Toggle this branch in the selection
    toggleBranchSelection(result.name);
    
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

  const handleClearSelection = () => {
    onChange([]);
  };

  // Function to check if all subcategories of a category are selected
  const areAllSubcategoriesSelected = (category: Category) => {
    return category.subcategories.every(subcat => isSelected(subcat.name));
  };

  // Function to check if some (but not all) subcategories are selected
  const areSomeSubcategoriesSelected = (category: Category) => {
    const selectedSubcats = category.subcategories.filter(subcat => isSelected(subcat.name));
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

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">{tJobs('loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Header with expand/collapse toggle */}
      <div 
        className="p-4 flex justify-between items-center cursor-pointer border-b"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <Filter className="mr-2 text-blue-600" />
          <h3 className="font-semibold">{tJobs('industry')}</h3>
          {value.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {value.length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="p-4">
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

          {/* Current selection summary */}
          {value.length > 0 && (
            <div className="mb-3 flex items-center justify-between bg-blue-50 p-2 rounded-md">
              <span className="text-sm text-blue-700 font-medium">
                {tJobs('branchesSelected', { count: value.length })}
              </span>
              <button 
                onClick={handleClearSelection}
                className="text-blue-500 hover:text-blue-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

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
                      {renderCheckbox(isSelected(result.name))}
                    </span>
                    <span className="mr-2 text-xs px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                      {result.type === 'category' ? tJobs('mainCategory') : tJobs('subCategory')}
                    </span>
                    <span className={isSelected(result.name) ? 'font-medium' : ''}>
                      {result.name}
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
                onClick={handleClearSelection}
                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center ${
                  value.length === 0 ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">
                  {renderCheckbox(value.length === 0)}
                </span>
                {tJobs('allIndustries')}
              </button>
            </div>
          )}
          
          {/* Categories list */}
          {!searchTerm && (
            <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
              {translatedBranches.map((category) => {
                const isCategorySelected = isSelected(category.name);
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
                        <span className={isChecked ? 'font-medium' : ''}>
                          {category.name}
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
                            onClick={() => toggleBranchSelection(subcategory.name)}
                            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors hover:bg-gray-100 flex items-center ${
                              isSelected(subcategory.name) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <span className="mr-2">
                              {renderCheckbox(isSelected(subcategory.name))}
                            </span>
                            <span className={isSelected(subcategory.name) ? 'font-medium' : ''}>
                              {subcategory.name}
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
  );
};

export default BranchFilter;