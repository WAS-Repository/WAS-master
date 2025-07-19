import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Filter, Globe, Layers, Pin, Navigation, Box, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EnhancedMapView from '../visualization/EnhancedMapView';
import ThreeDTemporalViewSimple from '../visualization/ThreeDTemporalViewSimple';

interface GeographicSearchProps {
  onLocationSelect?: (location: any) => void;
  onDataSelect?: (data: any) => void;
}

interface SearchResult {
  id: string;
  title: string;
  location: string;
  type: 'research' | 'document' | 'dataset' | 'infrastructure';
  coordinates: [number, number];
  relevance: number;
  snippet: string;
  metadata: {
    source: string;
    date: string;
    category: string;
  };
}

const sampleResults: SearchResult[] = [
  {
    id: '1',
    title: 'Global Sea Level Rise Impact Study',
    location: 'Miami, FL',
    type: 'research',
    coordinates: [-80.1918, 25.7617],
    relevance: 0.95,
    snippet: 'Comprehensive analysis of sea level rise impacts on coastal infrastructure and communities worldwide...',
    metadata: {
      source: 'International Climate Research Institute',
      date: '2023-08-15',
      category: 'Climate Science'
    }
  },
  {
    id: '2',
    title: 'Coastal Port Environmental Assessment',
    location: 'San Francisco, CA',
    type: 'document',
    coordinates: [-122.4194, 37.7749],
    relevance: 0.87,
    snippet: 'Environmental impact assessment for major port operations and surrounding marine ecosystem...',
    metadata: {
      source: 'Pacific Environmental Research Center',
      date: '2023-11-02',
      category: 'Environmental'
    }
  },
  {
    id: '3',
    title: 'Atlantic Coast Erosion Data',
    location: 'Boston, MA',
    type: 'dataset',
    coordinates: [-71.0589, 42.3601],
    relevance: 0.82,
    snippet: 'Historical coastal erosion measurements and predictive modeling data for Atlantic coastline...',
    metadata: {
      source: 'National Coastal Research Program',
      date: '2024-01-10',
      category: 'Coastal Management'
    }
  },
  {
    id: '4',
    title: 'International Bridge Infrastructure Analysis',
    location: 'New York, NY',
    type: 'infrastructure',
    coordinates: [-74.0060, 40.7128],
    relevance: 0.78,
    snippet: 'Traffic flow analysis and infrastructure assessment for major bridge systems worldwide...',
    metadata: {
      source: 'Global Transportation Research Institute',
      date: '2023-12-05',
      category: 'Transportation'
    }
  }
];

export default function GeographicSearch({ onLocationSelect, onDataSelect }: GeographicSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'map' | '3d'>('map');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = sampleResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.location.toLowerCase().includes(query.toLowerCase()) ||
        result.snippet.toLowerCase().includes(query.toLowerCase()) ||
        result.metadata.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 300);
  };

  const handleLocationFilter = (location: string) => {
    setSelectedLocation(location);
    if (location) {
      const locationResults = sampleResults.filter(result => 
        result.location.toLowerCase().includes(location.toLowerCase())
      );
      setSearchResults(locationResults);
    } else {
      setSearchResults([]);
    }
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'research': return <Search size={16} className="text-blue-400" />;
      case 'document': return <Globe size={16} className="text-green-400" />;
      case 'dataset': return <Layers size={16} className="text-purple-400" />;
      case 'infrastructure': return <Pin size={16} className="text-orange-400" />;
      default: return <MapPin size={16} className="text-gray-400" />;
    }
  };

  const globalLocations = [
    'Miami, FL',
    'San Francisco, CA',
    'Boston, MA',
    'New York, NY',
    'Seattle, WA',
    'Los Angeles, CA',
    'Chicago, IL'
  ];

  return (
    <div className="h-full bg-[#1e1e1e] text-white flex">
      {/* Left Panel - Search and Results */}
      <div className="w-1/3 border-r border-[#3e3e3e] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#3e3e3e]">
        <div className="flex items-center mb-3">
          <MapPin size={18} className="mr-2 text-orange-400" />
          <h2 className="text-lg font-semibold">Geographic Research</h2>
        </div>
        
        {/* Search Bar */}
        <div className="flex space-x-2 mb-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search for location-based data, research, or infrastructure..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10 bg-[#2d2d2d] border-[#3e3e3e] text-white placeholder-gray-400"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => searchInputRef.current?.focus()}
            className="bg-[#2d2d2d] border-[#3e3e3e] hover:bg-[#3e3e3e]"
          >
            <Navigation size={16} />
          </Button>
        </div>

        {/* Location Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {globalLocations.map(location => (
            <Button
              key={location}
              variant="outline"
              size="sm"
              onClick={() => handleLocationFilter(location)}
              className={`text-xs ${
                selectedLocation === location 
                  ? 'bg-[#007acc] border-[#007acc] text-white' 
                  : 'bg-[#2d2d2d] border-[#3e3e3e] hover:bg-[#3e3e3e]'
              }`}
            >
              {location}
            </Button>
          ))}
        </div>

        {/* Type Filters */}
        <div className="flex space-x-2">
          {['research', 'document', 'dataset', 'infrastructure'].map(type => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => toggleFilter(type)}
              className={`text-xs capitalize ${
                activeFilters.includes(type)
                  ? 'bg-[#007acc] border-[#007acc] text-white'
                  : 'bg-[#2d2d2d] border-[#3e3e3e] hover:bg-[#3e3e3e]'
              }`}
            >
              {getTypeIcon(type)}
              <span className="ml-1">{type}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto">
        {isSearching ? (
          <div className="p-4 text-center text-gray-400">
            <div className="animate-spin mb-2">
              <Navigation size={20} />
            </div>
            Searching location-based data...
          </div>
        ) : searchResults.length > 0 ? (
          <div className="p-4 space-y-3">
            {searchResults
              .filter(result => activeFilters.length === 0 || activeFilters.includes(result.type))
              .map(result => (
                <div 
                  key={result.id}
                  className="bg-[#2d2d2d] border border-[#3e3e3e] rounded-lg p-4 hover:bg-[#3e3e3e] transition-colors cursor-pointer"
                  onClick={() => onDataSelect?.(result)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(result.type)}
                      <h3 className="font-medium text-white">{result.title}</h3>
                    </div>
                    <span className="text-xs text-gray-400">{Math.round(result.relevance * 100)}% match</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-300">{result.location}</span>
                    <span className="text-xs text-gray-500">
                      {result.coordinates[1].toFixed(4)}, {result.coordinates[0].toFixed(4)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{result.snippet}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{result.metadata.source}</span>
                    <span>{result.metadata.date}</span>
                    <span className="bg-[#1e1e1e] px-2 py-1 rounded">{result.metadata.category}</span>
                  </div>
                </div>
              ))}
          </div>
        ) : searchQuery || selectedLocation ? (
          <div className="p-4 text-center text-gray-400">
            <MapPin size={48} className="mx-auto mb-2 opacity-50" />
            <p>No location-based data found for "{searchQuery || selectedLocation}"</p>
            <p className="text-sm mt-1">Try adjusting your search terms or location filters</p>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-400">
            <div className="mb-4">
              <MapPin size={48} className="mx-auto mb-2 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Geographic Research Mode</h3>
              <p className="text-sm">Search for location-based data, research, and infrastructure information</p>
            </div>
            
            <div className="max-w-md mx-auto text-left">
              <h4 className="font-medium mb-2">Search suggestions:</h4>
              <ul className="text-sm space-y-1">
                <li>• Sea level rise impact studies</li>
                <li>• Coastal erosion data</li>
                <li>• Infrastructure assessments</li>
                <li>• Environmental monitoring</li>
                <li>• Transportation analysis</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      </div>
      
      {/* Right Panel - Map/3D View */}
      <div className="flex-1 flex flex-col">
        {/* View Toggle */}
        <div className="border-b border-[#3e3e3e] p-3 flex items-center justify-between bg-[#1e1e1e]">
          <div className="flex items-center space-x-2">
            <Globe size={16} className="text-gray-400" />
            <span className="text-sm text-gray-300">Visualization Mode</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('map')}
              className={`text-xs ${
                viewMode === 'map'
                  ? 'bg-[#007acc] border-[#007acc] text-white'
                  : 'bg-[#2d2d2d] border-[#3e3e3e] hover:bg-[#3e3e3e]'
              }`}
            >
              <MapPin size={14} className="mr-1" />
              Map View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('3d')}
              className={`text-xs ${
                viewMode === '3d'
                  ? 'bg-[#007acc] border-[#007acc] text-white'
                  : 'bg-[#2d2d2d] border-[#3e3e3e] hover:bg-[#3e3e3e]'
              }`}
            >
              <Box size={14} className="mr-1" />
              3D Temporal
            </Button>
          </div>
        </div>
        
        {/* View Content */}
        <div className="flex-1">
          {viewMode === 'map' ? (
            <EnhancedMapView 
              data={searchResults.map(result => ({
                id: result.id,
                name: result.title,
                latitude: result.coordinates[1],
                longitude: result.coordinates[0],
                type: result.type as any,
                description: result.snippet,
                metadata: result.metadata
              }))}
              onDataSelect={onDataSelect}
            />
          ) : (
            <ThreeDTemporalViewSimple 
              onNodeSelect={(node) => {
                if (onDataSelect) {
                  onDataSelect({
                    id: node.id,
                    title: node.title,
                    type: node.type,
                    metadata: node.metadata,
                    timestamp: node.timestamp
                  });
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}