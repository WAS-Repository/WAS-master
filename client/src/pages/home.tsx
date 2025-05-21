import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { X } from "lucide-react";
import KnowledgeGraph from "@/components/visualization/KnowledgeGraph";
import MapView from "@/components/visualization/MapView";
import DocumentViewer from "@/components/visualization/DocumentViewer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("knowledge-graph");
  
  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="bg-bg-panel border-b border-border-color flex">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-transparent justify-start rounded-none p-0 h-auto">
            <TabsTrigger 
              value="knowledge-graph" 
              className="py-2 px-4 text-sm border-r border-border-color rounded-none data-[state=active]:bg-bg-dark data-[state=active]:shadow-none flex items-center space-x-2"
            >
              <span>Knowledge Graph</span>
              <button 
                className="h-4 w-4 text-text-secondary hover:text-text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  // If this tab is active, switch to another tab before closing
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
              className="py-2 px-4 text-sm border-r border-border-color rounded-none data-[state=active]:bg-bg-dark data-[state=active]:shadow-none flex items-center space-x-2"
            >
              <span>Map View</span>
              <button 
                className="h-4 w-4 text-text-secondary hover:text-text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  // If this tab is active, switch to another tab before closing
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
              className="py-2 px-4 text-sm border-r border-border-color rounded-none data-[state=active]:bg-bg-dark data-[state=active]:shadow-none flex items-center space-x-2"
            >
              <span>Document Viewer</span>
              <button 
                className="h-4 w-4 text-text-secondary hover:text-text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  // If this tab is active, switch to another tab before closing
                  if (activeTab === "document-viewer") {
                    setActiveTab("knowledge-graph");
                  }
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="knowledge-graph" className="m-0 p-0 h-full">
            <div className="h-full">
              <KnowledgeGraph />
            </div>
          </TabsContent>
          
          <TabsContent value="map-view" className="m-0 p-0 h-full">
            <div className="h-full">
              <MapView />
            </div>
          </TabsContent>
          
          <TabsContent value="document-viewer" className="m-0 p-0 h-full">
            <div className="h-full">
              <DocumentViewer />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
