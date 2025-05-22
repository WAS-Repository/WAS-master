import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { X, Network, Map, FileText, ChevronDown } from "lucide-react";
import KnowledgeGraph from "@/components/visualization/KnowledgeGraph";
import MapView from "@/components/visualization/MapView";
import DocumentViewer from "@/components/visualization/DocumentViewer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [activeTab, setActiveTab] = useState("knowledge-graph");
  const isMobile = useIsMobile();
  
  // Function to get icon for tab
  const getTabIcon = (tabId: string) => {
    switch(tabId) {
      case "knowledge-graph":
        return <Network className="h-4 w-4 mr-1" />;
      case "map-view":
        return <Map className="h-4 w-4 mr-1" />;
      case "document-viewer":
        return <FileText className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  // Function to get tab name
  const getTabName = (tabId: string) => {
    switch(tabId) {
      case "knowledge-graph":
        return "Knowledge Graph";
      case "map-view":
        return "Map View";
      case "document-viewer":
        return "Document Viewer";
      default:
        return "";
    }
  };
  
  // Mobile Tab Selector
  const MobileTabSelector = () => {
    return (
      <div className="w-full flex items-center justify-between p-2 bg-bg-panel border-b border-border-color">
        <div className="flex items-center">
          {getTabIcon(activeTab)}
          <span className="text-sm font-medium">{getTabName(activeTab)}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <span className="sr-only">Change view</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setActiveTab("knowledge-graph")} className="cursor-pointer">
              <Network className="h-4 w-4 mr-2" />
              <span>Knowledge Graph</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("map-view")} className="cursor-pointer">
              <Map className="h-4 w-4 mr-2" />
              <span>Map View</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("document-viewer")} className="cursor-pointer">
              <FileText className="h-4 w-4 mr-2" />
              <span>Document Viewer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  
  // Desktop Tabs
  const DesktopTabs = () => {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-transparent justify-start rounded-none p-0 h-auto">
          <TabsTrigger 
            value="knowledge-graph" 
            className="py-2 px-4 text-sm border-r border-border-color rounded-none data-[state=active]:bg-bg-dark data-[state=active]:shadow-none flex items-center"
          >
            <Network className="h-4 w-4 mr-1.5" />
            <span>Knowledge Graph</span>
            <button 
              className="ml-2 h-4 w-4 text-text-secondary hover:text-text-primary"
              onClick={(e) => {
                e.stopPropagation();
                if (activeTab === "knowledge-graph") {
                  setActiveTab("map-view");
                }
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </TabsTrigger>
          
          <TabsTrigger 
            value="map-view" 
            className="py-2 px-4 text-sm border-r border-border-color rounded-none data-[state=active]:bg-bg-dark data-[state=active]:shadow-none flex items-center"
          >
            <Map className="h-4 w-4 mr-1.5" />
            <span>Map View</span>
            <button 
              className="ml-2 h-4 w-4 text-text-secondary hover:text-text-primary"
              onClick={(e) => {
                e.stopPropagation();
                if (activeTab === "map-view") {
                  setActiveTab("document-viewer");
                }
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </TabsTrigger>
          
          <TabsTrigger 
            value="document-viewer" 
            className="py-2 px-4 text-sm border-r border-border-color rounded-none data-[state=active]:bg-bg-dark data-[state=active]:shadow-none flex items-center"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            <span>Document Viewer</span>
            <button 
              className="ml-2 h-4 w-4 text-text-secondary hover:text-text-primary"
              onClick={(e) => {
                e.stopPropagation();
                if (activeTab === "document-viewer") {
                  setActiveTab("knowledge-graph");
                }
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
  };
  
  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      {/* Tabs Navigation */}
      <div className="bg-bg-panel border-b border-border-color flex">
        {isMobile ? <MobileTabSelector /> : <DesktopTabs />}
      </div>
      
      {/* Tab Content */}
      <div className="flex-grow h-0">
        {activeTab === "knowledge-graph" && (
          <div className="h-full">
            <KnowledgeGraph />
          </div>
        )}
        
        {activeTab === "map-view" && (
          <div className="h-full">
            <MapView />
          </div>
        )}
        
        {activeTab === "document-viewer" && (
          <div className="h-full">
            <DocumentViewer />
          </div>
        )}
      </div>
    </div>
  );
}
