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
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import LandscapePrompt from "@/components/layout/LandscapePrompt";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  // We're now using the new WorkspaceLayout component which provides an IDE-style interface
  // This layout shows all visualizations (map, graph, documents) simultaneously
  // similar to the reference image shared by the user
  return (
    <div className="h-full overflow-hidden">
      {/* Show landscape mode prompt for mobile users */}
      <LandscapePrompt />
      
      {/* Main workspace with all visualization components */}
      <WorkspaceLayout />
    </div>
  );
}
