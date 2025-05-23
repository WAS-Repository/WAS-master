import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import LandscapePrompt from "@/components/layout/LandscapePrompt";
import CleanResizableDashboard from "@/components/layout/CleanResizableDashboard";

export default function Home() {
  const [visualizationPanels, setVisualizationPanels] = useState<Array<{ id: string; type: string; title: string }>>([]);

  const handleOpenVisualization = (type: string) => {
    const titles = {
      'chart': 'Data Visualization',
      'dashboard': 'Story Dashboard', 
      'map': 'Geographic Analysis',
      'timeline': 'Timeline View',
      'network': 'Relationship Graph',
      'heatmap': 'Risk Heatmap'
    };
    
    const newPanel = {
      id: Date.now().toString(),
      type,
      title: titles[type as keyof typeof titles] || 'Analysis View'
    };
    setVisualizationPanels(prev => [...prev, newPanel]);
  };

  const handleCloseVisualization = (id: string) => {
    setVisualizationPanels(prev => prev.filter(panel => panel.id !== id));
  };

  return (
    <div className="h-full overflow-hidden">
      {/* Show landscape mode prompt for mobile users */}
      <LandscapePrompt />
      
      {/* Main workspace with resizable dashboard tiles */}
      <CleanResizableDashboard 
        onOpenVisualization={handleOpenVisualization}
        visualizationPanels={visualizationPanels}
        onCloseVisualization={handleCloseVisualization}
      />
    </div>
  );
}
