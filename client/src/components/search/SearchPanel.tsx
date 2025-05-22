import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Calendar, Map, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SearchResults } from './SearchResults';
import { formatDate } from '@/lib/utils';
import { SearchParams, SearchResult, executeSearch } from '@/lib/search';
import { useToast } from '@/hooks/use-toast';

interface SearchPanelProps {
  onClose?: () => void;
  onResultSelect?: (result: SearchResult) => void;
  onResultAddToGraph?: (result: SearchResult) => void;
  onResultViewOnMap?: (result: SearchResult) => void;
}

export function SearchPanel({ 
  onClose, 
  onResultSelect = () => {}, 
  onResultAddToGraph = () => {},
  onResultViewOnMap = () => {}
}: SearchPanelProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    start?: Date;
    end?: Date;
  }>({});
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'coastal erosion Norfolk',
    'hurricane funding Virginia Beach',
    'sea level rise Hampton',
    'environmental impact Chesapeake'
  ]);
  const localities = [
    'Norfolk', 'Virginia Beach', 'Hampton', 'Newport News', 
    'Chesapeake', 'Portsmouth', 'Suffolk'
  ];
  const documentTypes = [
    'Research Paper', 'Patent', 'Engineering Drawing', 'Schematic', 
    'Funding Report', 'Environmental Assessment'
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Construct search parameters
      const params: SearchParams = {
        query: searchQuery,
        filters: {
          documentType: selectedFilters,
          localities: selectedLocalities,
          dateRange: dateRange
        }
      };
      
      // Execute search
      const response = await executeSearch(params);
      setSearchResults(response.results);
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev].slice(0, 10));
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'An error occurred while searching. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const toggleLocality = (locality: string) => {
    setSelectedLocalities(prev => 
      prev.includes(locality) 
        ? prev.filter(l => l !== locality) 
        : [...prev, locality]
    );
  };

  // Mock search results for demonstration
  useEffect(() => {
    // This would be replaced with actual data in production
    const mockResults: SearchResult[] = [
      {
        id: 1,
        title: 'Sea Level Rise Impacts on Norfolk Naval Station',
        type: 'Research Paper',
        authors: ['Dr. Sarah Johnson', 'Prof. Robert Chen'],
        publishedDate: '2024-03-15',
        snippet: 'This study examines the potential impacts of sea level rise on the Norfolk Naval Station infrastructure through 2050, including detailed assessment of vulnerable systems and proposed mitigation strategies.',
        relevanceScore: 0.92,
        localities: ['Norfolk', 'Hampton Roads']
      },
      {
        id: 2,
        title: 'Advanced Coastal Barrier System Patent',
        type: 'Patent',
        authors: ['Coastal Engineering Solutions, Inc.'],
        publishedDate: '2023-11-02',
        snippet: 'A modular, deployable coastal barrier system designed specifically for the geological conditions of Hampton Roads region, featuring innovative wave dissipation technology.',
        relevanceScore: 0.85,
        localities: ['Virginia Beach', 'Norfolk', 'Hampton']
      },
      {
        id: 3,
        title: 'Hampton Roads Interconnected Drainage Assessment',
        type: 'Engineering Drawing',
        authors: ['Metropolitan Water Authority'],
        publishedDate: '2024-01-20',
        snippet: 'Technical specifications and schematics for the proposed regional interconnected drainage system connecting Portsmouth, Norfolk, and Chesapeake municipal water management.',
        relevanceScore: 0.78,
        localities: ['Portsmouth', 'Norfolk', 'Chesapeake']
      },
      {
        id: 4,
        title: 'Climate Resilience Funding Allocation 2024-2026',
        type: 'Funding Report',
        authors: ['Hampton Roads Regional Council', 'Virginia Coastal Authority'],
        publishedDate: '2024-02-28',
        snippet: 'Detailed breakdown of allocated state and federal funding for climate resilience projects across Hampton Roads localities, with project timelines and expected outcomes.',
        relevanceScore: 0.88,
        localities: ['Norfolk', 'Virginia Beach', 'Hampton', 'Newport News', 'Portsmouth', 'Suffolk', 'Chesapeake']
      }
    ];
    
    if (searchQuery && !isSearching) {
      setSearchResults(mockResults);
    }
  }, [searchQuery, isSearching]);

  return (
    <motion.div 
      className="flex flex-col h-full border rounded-md overflow-hidden"
      style={{ 
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-panel)'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="text-base font-medium text-text-primary">Document Search</div>
        {onClose && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X size={16} />
          </Button>
        )}
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-grow overflow-hidden">
        <Tabs defaultValue="search" className="flex flex-col flex-grow">
          <TabsList className="mx-4 mt-2 justify-start">
            <TabsTrigger value="search" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Search size={14} className="mr-1" />
              Search
            </TabsTrigger>
            <TabsTrigger value="filters" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Filter size={14} className="mr-1" />
              Filters
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Database size={14} className="mr-1" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="flex-grow flex flex-col overflow-hidden p-0">
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for documents, patents, research papers..."
                  className="pl-10 pr-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={clearSearch}
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
              
              {/* Filter pills */}
              {(selectedFilters.length > 0 || selectedLocalities.length > 0 || dateRange.start || dateRange.end) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedFilters.map(filter => (
                    <Badge key={filter} variant="secondary" className="text-xs pl-2 h-6">
                      {filter}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => toggleFilter(filter)}
                      >
                        <X size={10} />
                      </Button>
                    </Badge>
                  ))}
                  
                  {selectedLocalities.map(locality => (
                    <Badge key={locality} variant="secondary" className="text-xs pl-2 h-6">
                      <Map size={10} className="mr-1" />
                      {locality}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => toggleLocality(locality)}
                      >
                        <X size={10} />
                      </Button>
                    </Badge>
                  ))}
                  
                  {dateRange.start && (
                    <Badge variant="secondary" className="text-xs pl-2 h-6">
                      <Calendar size={10} className="mr-1" />
                      From: {formatDate(dateRange.start)}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setDateRange(prev => ({ ...prev, start: undefined }))}
                      >
                        <X size={10} />
                      </Button>
                    </Badge>
                  )}
                  
                  {dateRange.end && (
                    <Badge variant="secondary" className="text-xs pl-2 h-6">
                      <Calendar size={10} className="mr-1" />
                      To: {formatDate(dateRange.end)}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setDateRange(prev => ({ ...prev, end: undefined }))}
                      >
                        <X size={10} />
                      </Button>
                    </Badge>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => {
                      setSelectedFilters([]);
                      setSelectedLocalities([]);
                      setDateRange({});
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              )}
              
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleSearch}
                  className="h-8"
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
            
            {/* Search Results */}
            <div className="flex-grow overflow-hidden p-4">
              <SearchResults 
                results={searchResults}
                onResultSelect={onResultSelect}
                onResultAddToGraph={onResultAddToGraph}
                onResultViewOnMap={onResultViewOnMap}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="filters" className="p-4 overflow-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Document Type</h3>
                <div className="flex flex-wrap gap-2">
                  {documentTypes.map(type => (
                    <Badge
                      key={type}
                      variant={selectedFilters.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFilter(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Locality</h3>
                <div className="flex flex-wrap gap-2">
                  {localities.map(locality => (
                    <Badge
                      key={locality}
                      variant={selectedLocalities.includes(locality) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleLocality(locality)}
                    >
                      <Map size={12} className="mr-1" />
                      {locality}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Date Range</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-9"
                        >
                          <Calendar size={16} className="mr-2" />
                          {dateRange.start ? formatDate(dateRange.start) : 'Start Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateRange.start}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-9"
                        >
                          <Calendar size={16} className="mr-2" />
                          {dateRange.end ? formatDate(dateRange.end) : 'End Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateRange.end}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => {
                    setSelectedFilters([]);
                    setSelectedLocalities([]);
                    setDateRange({});
                  }}
                >
                  Reset
                </Button>
                <Button onClick={() => handleSearch()}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="p-4 overflow-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
                <div className="space-y-2">
                  {recentSearches.map((query, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 border rounded-md cursor-pointer hover:bg-bg-alt hover:border-primary"
                      style={{ borderColor: 'var(--border-color)' }}
                      onClick={() => {
                        setSearchQuery(query);
                        setSearchResults([]);
                      }}
                    >
                      <div className="flex items-center">
                        <Search size={14} className="mr-2 text-text-secondary" />
                        <span>{query}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecentSearches(prev => prev.filter((_, i) => i !== idx));
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Saved Searches</h3>
                <div className="p-4 border rounded-md text-center text-text-secondary">
                  No saved searches yet
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}