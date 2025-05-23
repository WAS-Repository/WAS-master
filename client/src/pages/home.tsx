import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import LandscapePrompt from "@/components/layout/LandscapePrompt";
import ResizableDashboard from "@/components/layout/ResizableDashboard";

export default function Home() {
  const [visualizationPanels, setVisualizationPanels] = useState<Array<{ id: string; type: string; title: string }>>([]);

  const handleOpenVisualization = (type: string) => {
    const newPanel = {
      id: Date.now().toString(),
      type,
      title: type === 'chart' ? 'Data Visualization' : 'Story Dashboard'
    };
    setVisualizationPanels(prev => [...prev, newPanel]);
  };

  return (
    <div className="h-full overflow-hidden">
      {/* Show landscape mode prompt for mobile users */}
      <LandscapePrompt />
      
      {/* Main workspace with resizable dashboard tiles */}
      <ResizableDashboard onOpenVisualization={handleOpenVisualization} />
    </div>
  );
}
