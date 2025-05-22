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
        <h2 className="text-sm font-medium">Terminal Menu</h2>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-6 w-6">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Terminal Navigation */}
      <div className="overflow-y-auto p-3 flex-grow">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.filters ? 'transform rotate-90' : ''}`} 
              onClick={() => toggleSection('filters')}
            />
            <span className="text-sm font-medium cursor-pointer" onClick={() => toggleSection('filters')}>
              Terminal Modes
            </span>
          </div>
          
          {expandedSections.filters && (
            <div className="ml-5 space-y-2">
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <TerminalIcon className="h-3 w-3 mr-1 text-primary" />
                <span>Shell Mode</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <MessageSquare className="h-3 w-3 mr-1 text-primary" />
                <span>Agent Mode</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <FolderOpen className="h-3 w-3 mr-1 text-primary" />
                <span>Explorer Mode</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Recent Commands */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.recentSearches ? 'transform rotate-90' : ''}`} 
              onClick={() => toggleSection('recentSearches')}
            />
            <span className="text-sm font-medium cursor-pointer" onClick={() => toggleSection('recentSearches')}>
              Recent Commands
            </span>
          </div>
          
          {expandedSections.recentSearches && (
            <div className="ml-5">
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <TerminalIcon className="h-3 w-3 mr-1 text-text-secondary" />
                <span>ls -la</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <TerminalIcon className="h-3 w-3 mr-1 text-text-secondary" />
                <span>search "coastal erosion"</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <TerminalIcon className="h-3 w-3 mr-1 text-text-secondary" />
                <span>cd /Documents</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Saved Scripts */}
        <div>
          <div className="flex items-center mb-2">
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.savedFilters ? 'transform rotate-90' : ''}`} 
              onClick={() => toggleSection('savedFilters')}
            />
            <span className="text-sm font-medium cursor-pointer" onClick={() => toggleSection('savedFilters')}>
              Saved Scripts
            </span>
          </div>
          
          {expandedSections.savedFilters && (
            <div className="ml-5">
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <FileText className="h-3 w-3 mr-1 text-primary" />
                <span>backup_data.sh</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <FileText className="h-3 w-3 mr-1 text-primary" />
                <span>report_generator.sh</span>
              </div>
              <div className="flex items-center text-xs py-1 cursor-pointer hover:bg-opacity-10 hover:bg-white rounded px-1">
                <FileText className="h-3 w-3 mr-1 text-primary" />
                <span>analyze_localities.sh</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
