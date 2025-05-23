import React from 'react';
import { BarChart3, Map, TrendingUp, X, Network, Calendar, Zap } from 'lucide-react';

interface VisualizationPanelProps {
  panels: Array<{ id: string; type: string; title: string }>;
  onClose: (id: string) => void;
}

export default function VisualizationPanel({ panels, onClose }: VisualizationPanelProps) {
  if (panels.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'chart': return <BarChart3 size={14} className="mr-2" />;
      case 'map': return <Map size={14} className="mr-2" />;
      case 'dashboard': return <TrendingUp size={14} className="mr-2" />;
      case 'network': return <Network size={14} className="mr-2" />;
      case 'timeline': return <Calendar size={14} className="mr-2" />;
      case 'heatmap': return <Zap size={14} className="mr-2" />;
      default: return <BarChart3 size={14} className="mr-2" />;
    }
  };

  const getVisualizationContent = (panel: { type: string; title: string }) => {
    switch (panel.type) {
      case 'chart':
        return (
          <div className="h-full flex flex-col p-4">
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-semibold mb-2">Data Visualization</h3>
                <p className="text-gray-400 mb-4">AI-generated chart from Hampton Roads research data</p>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#2d2d2d] p-2 rounded">
                    <div className="text-blue-400 font-semibold">Sea Level</div>
                    <div>+3.2mm/year</div>
                  </div>
                  <div className="bg-[#2d2d2d] p-2 rounded">
                    <div className="text-green-400 font-semibold">Infrastructure</div>
                    <div>$2.3B at risk</div>
                  </div>
                  <div className="bg-[#2d2d2d] p-2 rounded">
                    <div className="text-yellow-400 font-semibold">Population</div>
                    <div>45K affected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="h-full flex flex-col p-4">
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-semibold mb-2">Story Dashboard</h3>
                <p className="text-gray-400 mb-4">Interactive narrative with data insights</p>
                <div className="text-left max-w-md">
                  <div className="mb-3 p-3 bg-[#2d2d2d] rounded">
                    <div className="text-sm font-semibold mb-1">Current Situation</div>
                    <div className="text-xs text-gray-400">Hampton Roads experiencing accelerated coastal erosion...</div>
                  </div>
                  <div className="mb-3 p-3 bg-[#2d2d2d] rounded">
                    <div className="text-sm font-semibold mb-1">Key Trends</div>
                    <div className="text-xs text-gray-400">15% increase in erosion rates since 2010...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'map':
        return (
          <div className="h-full flex flex-col p-4">
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center">
                <Map size={48} className="mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold mb-2">Geographic Analysis</h3>
                <p className="text-gray-400 mb-4">Interactive map of risk zones and infrastructure</p>
                <div className="text-xs text-gray-500">
                  🗺️ Hampton Roads region with flood risk overlays
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">{panel.title}</h3>
              <p className="text-gray-400 mb-4">Interactive {panel.type} visualization</p>
              <div className="text-xs text-gray-500">
                💡 This panel is resizable - drag the borders to adjust size!
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      {/* Visualization Tabs */}
      <div className="h-9 bg-[#252526] flex border-b border-[#3e3e3e] overflow-auto">
        {panels.map((panel) => (
          <div 
            key={panel.id}
            className="px-3 py-2 text-white text-xs flex items-center border-r border-[#3e3e3e] cursor-pointer bg-[#1e1e1e] border-t-2 border-t-[#007acc]"
          >
            {getIcon(panel.type)}
            <span className="truncate max-w-[120px]">{panel.title}</span>
            <span 
              className="ml-2 text-gray-400 hover:text-white hover:bg-[#3e3e3e] rounded px-1" 
              onClick={() => onClose(panel.id)}
              title="Close"
            >
              <X size={12} />
            </span>
          </div>
        ))}
      </div>
      
      {/* Visualization Content */}
      <div className="flex-1 overflow-auto bg-[#1e1e1e]">
        {panels.length > 0 && getVisualizationContent(panels[0])}
      </div>
    </div>
  );
}