import { useState } from "react";
import { ChevronLeft, ChevronRight, File, Database, Shield, Wrench, FolderOpen, Search, PlusCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  width: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ width, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    researchPapers: true,
    patents: false,
    schematics: false,
    engineeringDrawings: true,
    filters: true,
    recentSearches: true,
    savedFilters: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isCollapsed) {
    return (
      <div className="bg-bg-panel border-r border-border-color flex flex-col" style={{ width: 48 }}>
        <div className="flex justify-end p-2 border-b border-border-color">
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-6 w-6">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-2 flex flex-col items-center space-y-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <File className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Database className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Shield className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Wrench className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-bg-panel border-r border-border-color flex flex-col" 
      style={{ width }}
    >
      <div className="flex justify-between items-center p-2 border-b border-border-color">
        <h2 className="text-sm font-medium">Document Search</h2>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-6 w-6">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Search Interface */}
      <div className="overflow-y-auto p-3 flex-grow">
        {/* Search Box */}
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Search documents..."
            className="w-full bg-bg-dark border border-border-color rounded py-1.5 pl-8 pr-2 text-sm"
          />
          <Search className="h-4 w-4 absolute left-2 top-2 text-text-secondary" />
        </div>
        
        {/* Filters */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.filters ? 'transform rotate-90' : ''}`} 
              onClick={() => toggleSection('filters')}
            />
            <span className="text-sm font-medium cursor-pointer" onClick={() => toggleSection('filters')}>
              Advanced Filters
            </span>
          </div>
          
          {expandedSections.filters && (
            <div className="ml-5 space-y-3">
              {/* Document Type Filter */}
              <div>
                <label className="block text-xs text-text-secondary mb-1">Document Type</label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="research" className="mr-1" defaultChecked />
                    <label htmlFor="research" className="text-xs">Research</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="patents" className="mr-1" defaultChecked />
                    <label htmlFor="patents" className="text-xs">Patents</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="engineering" className="mr-1" defaultChecked />
                    <label htmlFor="engineering" className="text-xs">Engineering</label>
                  </div>
                </div>
              </div>
              
              {/* Locality Filter */}
              <div>
                <label className="block text-xs text-text-secondary mb-1">Locality</label>
                <select className="w-full bg-bg-dark border border-border-color rounded py-1 px-2 text-xs">
                  <option value="">All Localities</option>
                  <option value="norfolk">Norfolk</option>
                  <option value="virginiaBeach">Virginia Beach</option>
                  <option value="hampton">Hampton</option>
                  <option value="portsmouth">Portsmouth</option>
                  <option value="chesapeake">Chesapeake</option>
                  <option value="newportNews">Newport News</option>
                  <option value="suffolk">Suffolk</option>
                </select>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <label className="block text-xs text-text-secondary mb-1">Date Range</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="From"
                    className="w-1/2 bg-bg-dark border border-border-color rounded py-1 px-2 text-xs"
                  />
                  <input 
                    type="text" 
                    placeholder="To"
                    className="w-1/2 bg-bg-dark border border-border-color rounded py-1 px-2 text-xs"
                  />
                </div>
              </div>
              
              {/* Funding Source Filter */}
              <div>
                <label className="block text-xs text-text-secondary mb-1">Funding Source</label>
                <select className="w-full bg-bg-dark border border-border-color rounded py-1 px-2 text-xs">
                  <option value="">All Sources</option>
                  <option value="nsf">NSF</option>
                  <option value="noaa">NOAA</option>
                  <option value="epa">EPA</option>
                  <option value="usace">USACE</option>
                  <option value="dod">DOD</option>
                  <option value="fema">FEMA</option>
                </select>
              </div>
              
              {/* Search Button */}
              <button className="w-full bg-primary text-white py-1.5 rounded text-xs font-medium hover:bg-opacity-90">
                Apply Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Recent Searches */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.recentSearches ? 'transform rotate-90' : ''}`} 
              onClick={() => toggleSection('recentSearches')}
            />
            <span className="text-sm font-medium cursor-pointer" onClick={() => toggleSection('recentSearches')}>
              Recent Searches
            </span>
          </div>
          
          {expandedSections.recentSearches && (
            <div className="ml-5">
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <Search className="h-3 w-3 mr-1 text-text-secondary" />
                <span>coastal erosion norfolk</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <Search className="h-3 w-3 mr-1 text-text-secondary" />
                <span>flood protection patents</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <Search className="h-3 w-3 mr-1 text-text-secondary" />
                <span>usace hampton roads</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Saved Filters */}
        <div>
          <div className="flex items-center mb-2">
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.savedFilters ? 'transform rotate-90' : ''}`} 
              onClick={() => toggleSection('savedFilters')}
            />
            <span className="text-sm font-medium cursor-pointer" onClick={() => toggleSection('savedFilters')}>
              Saved Filters
            </span>
          </div>
          
          {expandedSections.savedFilters && (
            <div className="ml-5">
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <Filter className="h-3 w-3 mr-1 text-primary" />
                <span>Norfolk Research 2022-2023</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <Filter className="h-3 w-3 mr-1 text-primary" />
                <span>USACE Funded Projects</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <Filter className="h-3 w-3 mr-1 text-primary" />
                <span>All Patent Documents</span>
              </div>
            </div>
          )}
        </div>
      </div>
      

    </div>
  );
}
