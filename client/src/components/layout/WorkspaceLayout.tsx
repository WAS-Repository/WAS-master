import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Maximize, Minimize, Terminal, Map, Network, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import MapView from '../visualization/MapView';
import KnowledgeGraph from '../visualization/KnowledgeGraph';
import DocumentViewer from '../visualization/DocumentViewer';

interface PanelConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  defaultSize: number; // percentage of available space
}

/**
 * WorkspaceLayout component creates an IDE-style interface with multiple resizable panels
 * that can display different visualization modes simultaneously.
 */
export default function WorkspaceLayout() {
  const isMobile = useIsMobile();
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [showTerminal, setShowTerminal] = useState(true);
  const [activeTab, setActiveTab] = useState('document-viewer');
  const [topPanelConfig, setTopPanelConfig] = useState<{
    left: number; // percentage 0-100
    right: number; // percentage 0-100
  }>({ left: 50, right: 50 });
  
  // Adjust layout for mobile devices
  useEffect(() => {
    if (isMobile) {
      setShowTerminal(false);
    }
  }, [isMobile]);
  
  // Toggle terminal visibility
  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };
  
  // Resize terminal panel
  const resizeTerminal = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setTerminalHeight(prev => Math.min(prev + 50, 400));
    } else {
      setTerminalHeight(prev => Math.max(prev - 50, 100));
    }
  };
  
  // Adjust split between left and right panels
  const adjustPanelSplit = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setTopPanelConfig(prev => ({
        left: Math.min(prev.left + 5, 80),
        right: Math.max(prev.right - 5, 20)
      }));
    } else {
      setTopPanelConfig(prev => ({
        left: Math.max(prev.left - 5, 20),
        right: Math.min(prev.right + 5, 80)
      }));
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top section with map and graph */}
      <div 
        className={`flex flex-col md:flex-row ${showTerminal ? 'h-[calc(100%-' + terminalHeight + 'px)]' : 'h-full'}`}
      >
        {/* Left panel - Map */}
        <div 
          className={`${isMobile ? 'h-1/2' : ''} md:h-full relative`}
          style={{ width: isMobile ? '100%' : `${topPanelConfig.left}%` }}
        >
          <div className="absolute inset-0">
            <MapView />
          </div>

          {/* Only show resizer on desktop */}
          {!isMobile && (
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
              <div className="flex flex-col bg-slate-800 rounded overflow-hidden border border-slate-700">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-6 p-0"
                  onClick={() => adjustPanelSplit('left')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="w-full h-px bg-slate-700" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-6 p-0"
                  onClick={() => adjustPanelSplit('right')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right panel - Knowledge Graph */}
        <div 
          className={`${isMobile ? 'h-1/2' : ''} md:h-full relative`}
          style={{ width: isMobile ? '100%' : `${topPanelConfig.right}%` }}
        >
          <div className="absolute inset-0">
            <KnowledgeGraph />
          </div>
        </div>
      </div>
      
      {/* Terminal/Console section */}
      {showTerminal && (
        <div 
          className="relative border-t border-slate-700 bg-slate-900 overflow-hidden" 
          style={{ height: `${terminalHeight}px` }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 p-2 bg-slate-800">
            <div className="flex items-center">
              <Terminal className="h-4 w-4 mr-2 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Console</span>
            </div>
            
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => resizeTerminal('up')}
              >
                <ChevronUp className="h-4 w-4 text-slate-400" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => resizeTerminal('down')}
              >
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={toggleTerminal}
              >
                <Minimize className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </div>
          
          <div className="p-2 h-[calc(100%-36px)] overflow-y-auto font-mono text-xs text-slate-300">
            <div className="text-green-500">{'>'} Initialized Hampton Roads document visualization</div>
            <div className="text-slate-400">{'>'} Loaded 7 localities and 15 document references</div>
            <div className="text-blue-400">{'>'} Network graph initialized with 11 nodes and 13 connections</div>
            <div className="text-yellow-400">{'>'} Warning: Some document metadata is incomplete</div>
            <div className="text-slate-400">{'>'} Calculating spatial relationships between documents</div>
            <div className="text-slate-400">{'>'} Map view ready</div>
            <div className="text-slate-400">{'>'} System ready</div>
            <div className="flex items-center mt-2">
              <span className="text-green-500 mr-1">{'>'}</span>
              <Input 
                className="h-6 py-1 px-2 bg-transparent border-none text-xs text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Enter command..."
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Toggle terminal button (only shown when terminal is hidden) */}
      {!showTerminal && (
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-20 bg-slate-800 border-slate-700 shadow-lg"
          onClick={toggleTerminal}
        >
          <Terminal className="h-4 w-4 mr-1" />
          Terminal
        </Button>
      )}
      
      {/* Document browser panel (could be docked to the side on larger screens) */}
      <div className="fixed top-20 right-4 z-20 w-64 bg-slate-800 border border-slate-700 rounded shadow-lg">
        <div className="p-2 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Documents</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Maximize className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
        
        <div className="p-2">
          <div className="relative mb-2">
            <Input 
              className="w-full text-xs pl-8 py-1 h-7 bg-slate-900 border-slate-700"
              placeholder="Search documents..."
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          </div>
          
          <div className="space-y-1 max-h-64 overflow-y-auto">
            <div className="flex items-center p-1.5 rounded hover:bg-slate-700 cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-slate-300 truncate">Coastal Erosion Study</span>
            </div>
            <div className="flex items-center p-1.5 rounded hover:bg-slate-700 cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-slate-300 truncate">Flood Barrier System</span>
            </div>
            <div className="flex items-center p-1.5 rounded hover:bg-slate-700 cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-xs text-slate-300 truncate">Port Facility Norfolk</span>
            </div>
            <div className="flex items-center p-1.5 rounded hover:bg-slate-700 cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-slate-300 truncate">Naval Base Impact</span>
            </div>
            <div className="flex items-center p-1.5 rounded hover:bg-slate-700 cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-slate-300 truncate">Sea Level Rise Projections</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status bar (fixed to bottom) */}
      <div className="fixed bottom-0 left-0 right-0 h-6 bg-slate-800 border-t border-slate-700 text-xs text-slate-400 flex items-center px-2 z-10">
        <div className="flex items-center mr-4">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
          <span>Network: Online</span>
        </div>
        <div className="flex items-center mr-4">
          <span>Data: 7 localities, 15 documents</span>
        </div>
        <div className="ml-auto flex items-center">
          <span>Hampton Roads Document Explorer v1.0</span>
        </div>
      </div>
    </div>
  );
}

// Helper components
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);