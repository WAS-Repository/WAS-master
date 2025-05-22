import { useState } from "react";
import { ChevronLeft, ChevronRight, File, Database, Shield, Wrench, FolderOpen, Search, PlusCircle } from "lucide-react";
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
    engineeringDrawings: true
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
        <h2 className="text-sm font-medium">Explorer</h2>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-6 w-6">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* File Tree */}
      <div className="overflow-y-auto p-2 flex-grow">
        {/* Research Papers */}
        <div className="mb-2">
          <div 
            className="flex items-center cursor-pointer hover:bg-opacity-10 hover:bg-white p-1 rounded"
            onClick={() => toggleSection('researchPapers')}
          >
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.researchPapers ? 'transform rotate-90' : ''}`} />
            <span className="text-sm">Research Papers</span>
          </div>
          {expandedSections.researchPapers && (
            <div className="ml-5">
              <div className="flex items-center cursor-pointer hover:bg-opacity-10 hover:bg-white p-1 rounded">
                <File className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm">Coastal_Erosion_Study.pdf</span>
              </div>
              <div className="flex items-center cursor-pointer hover:bg-opacity-10 hover:bg-white p-1 rounded">
                <File className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm">Naval_Base_Norfolk_Impact.pdf</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Patents */}
        <div className="mb-2">
          <div 
            className="flex items-center cursor-pointer hover:bg-opacity-10 hover:bg-white p-1 rounded"
            onClick={() => toggleSection('patents')}
          >
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.patents ? 'transform rotate-90' : ''}`} />
            <span className="text-sm">Patents</span>
          </div>
          {expandedSections.patents && (
            <div className="ml-5">
              {/* Patent files would go here */}
            </div>
          )}
        </div>
        
        {/* Schematics */}
        <div className="mb-2">
          <div 
            className="flex items-center cursor-pointer hover:bg-opacity-10 hover:bg-white p-1 rounded"
            onClick={() => toggleSection('schematics')}
          >
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.schematics ? 'transform rotate-90' : ''}`} />
            <span className="text-sm">Schematics</span>
          </div>
          {expandedSections.schematics && (
            <div className="ml-5">
              {/* Schematic files would go here */}
            </div>
          )}
        </div>
        
        {/* Engineering Drawings */}
        <div className="mb-2">
          <div 
            className="flex items-center cursor-pointer hover:bg-opacity-10 hover:bg-white p-1 rounded"
            onClick={() => toggleSection('engineeringDrawings')}
          >
            <ChevronRight className={`h-4 w-4 mr-1 text-text-secondary ${expandedSections.engineeringDrawings ? 'transform rotate-90' : ''}`} />
            <span className="text-sm">Engineering Drawings</span>
          </div>
          {expandedSections.engineeringDrawings && (
            <div className="ml-5">
              <div className="flex items-center cursor-pointer hover:bg-opacity-10 hover:bg-white p-1 rounded">
                <Shield className="h-4 w-4 mr-1 text-secondary" />
                <span className="text-sm">Bridge_Structure_Hampton.dwg</span>
              </div>
              <div className="flex items-center cursor-pointer hover:bg-opacity-10 hover:bg-white p-1 rounded">
                <Shield className="h-4 w-4 mr-1 text-secondary" />
                <span className="text-sm">Port_Facility_Norfolk.dwg</span>
              </div>
            </div>
          )}
        </div>
      </div>
      

    </div>
  );
}
