import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { 
  Terminal as TerminalIcon, 
  Map, 
  Network, 
  FileText,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  Laptop,
  ChevronRight,
  Eye,
  Download,
  Save,
  HelpCircle,
  FileCode,
  Settings
} from 'lucide-react';
import DocumentViewer from '../visualization/DocumentViewer';
import MapView from '../visualization/MapView';
import KnowledgeGraph from '../visualization/KnowledgeGraph';
import TerminalInterface from './TerminalInterface';
import ViewMenu, { ResearchWorkspace, researchWorkspaces } from './ViewMenu';

export default function TronLayout() {
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(Math.floor(Math.random() * 20) + 5); // Random value between 5-25%
  const [memoryUsage, setMemoryUsage] = useState(Math.floor(Math.random() * 30) + 10); // Random value between 10-40%
  const [networkPing, setNetworkPing] = useState(Math.floor(Math.random() * 40) + 20); // Random value between 20-60ms
  const [activeView, setActiveView] = useState<'document' | 'map' | 'graph'>('document');
  const [currentWorkspace, setCurrentWorkspace] = useState<ResearchWorkspace>(researchWorkspaces[0]);
  
  // Simulate real-time metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate changing CPU usage
      setCpuUsage((prev) => {
        const change = Math.floor(Math.random() * 6) - 2; // -2 to +3 change
        return Math.max(3, Math.min(40, prev + change)); // Keep between 3-40%
      });
      // Simulate changing memory usage
      setMemoryUsage((prev) => {
        const change = Math.floor(Math.random() * 8) - 3; // -3 to +4 change
        return Math.max(5, Math.min(50, prev + change)); // Keep between 5-50%
      });
      // Simulate changing network ping
      setNetworkPing((prev) => {
        const change = Math.floor(Math.random() * 10) - 4; // -4 to +5 change
        return Math.max(15, Math.min(80, prev + change)); // Keep between 15-80ms
      });
    }, 2000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM:SS
  const formatTime = (date: Date) => {
    return [
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
      date.getSeconds().toString().padStart(2, '0')
    ].join(':');
  };
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0')
    ].join('-');
  };
  
  // Handle workspace selection
  const handleWorkspaceChange = (workspace: ResearchWorkspace) => {
    setCurrentWorkspace(workspace);
    
    // Update the active view based on the workspace's preferred layout
    if (workspace.layout.activePanel === 'map') {
      setActiveView('map');
    } else if (workspace.layout.activePanel === 'graph') {
      setActiveView('graph');
    } else {
      setActiveView('document');
    }
    
    // In a real implementation, we would also update terminal colors, 
    // theme settings, and other configuration based on the workspace
  };

  return (
    <div className="h-full font-mono bg-black text-green-500 border border-green-900 rounded-md overflow-hidden">
      {/* Top toolbar with View menu */}
      <div className="bg-black text-green-500 border-b border-green-900 p-1 flex items-center text-xs">
        <div className="font-mono text-sm font-bold mr-4">
          HAMPTON ROADS RESEARCH INTERFACE
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" className="h-8 px-2 text-green-500">
            File
          </Button>
          
          <Button variant="ghost" className="h-8 px-2 text-green-500">
            Edit
          </Button>
          
          <ViewMenu 
            onSelectWorkspace={handleWorkspaceChange}
            currentWorkspaceId={currentWorkspace.id}
          />
          
          <Button variant="ghost" className="h-8 px-2 text-green-500">
            Help
          </Button>
        </div>
        
        <div className="ml-auto flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500">
            <FileCode className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Header with system status */}
      <div className="grid grid-cols-4 bg-black text-green-500 border-b border-green-900 p-2 text-xs">
        <div>
          <div className="text-xl font-bold">{formatTime(currentTime)}</div>
          <div className="text-xs opacity-70">{formatDate(currentTime)}</div>
        </div>
        
        <div className="text-center">
          <div className="uppercase text-xs font-bold mb-1">Network Status</div>
          <div className="grid grid-cols-2 gap-1 text-xxs">
            <div className="text-right text-green-300">Interface:</div>
            <div>enp0s0f1</div>
            <div className="text-right text-green-300">STATE:</div>
            <div>IPv4</div>
            <div className="text-right text-green-300">PING:</div>
            <div>{networkPing}ms</div>
            <div className="text-right text-green-300">ONLINE:</div>
            <div>96.22.220.83</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="uppercase text-xs font-bold mb-1">Research Environment</div>
          <div className="grid grid-cols-2 gap-1 text-xxs">
            <div className="text-right text-green-300">Workspace:</div>
            <div>{currentWorkspace.name}</div>
            <div className="text-right text-green-300">Mode:</div>
            <div>{currentWorkspace.layout.activePanel === 'map' ? 'Spatial' : 
                  currentWorkspace.layout.activePanel === 'graph' ? 'Network' : 'Document'}</div>
            <div className="text-right text-green-300">Focus:</div>
            <div>{currentWorkspace.id === 'deep-focus' || currentWorkspace.id === 'night-owl' ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="uppercase text-xs font-bold mb-1">System Info</div>
          <div className="text-xs">MAIN - fish</div>
          <div className="flex justify-end items-center space-x-3">
            <div className="flex items-center">
              <Cpu size={10} className="mr-1" />
              <span>{cpuUsage}%</span>
            </div>
            <div className="flex items-center">
              <HardDrive size={10} className="mr-1" />
              <span>{memoryUsage}%</span>
            </div>
            <div className="flex items-center">
              <Wifi size={10} className="mr-1" />
              <span>{networkPing}ms</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 h-[calc(100%-112px)]">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full"
        >
          {/* Main panel - Document Viewer */}
          <ResizablePanel defaultSize={70}>
            <div className="h-full flex flex-col">
              {/* Panel header */}
              <div className="flex justify-between bg-black text-green-500 border-b border-green-900 p-1 text-xs">
                <div className="flex">
                  <button 
                    className={`px-3 py-1 mr-1 ${activeView === 'document' ? 'bg-green-900 text-black' : ''}`}
                    onClick={() => setActiveView('document')}
                  >
                    <FileText size={12} className="inline mr-1" />
                    DOCUMENT
                  </button>
                  <button 
                    className={`px-3 py-1 mr-1 ${activeView === 'map' ? 'bg-green-900 text-black' : ''}`}
                    onClick={() => setActiveView('map')}
                  >
                    <Map size={12} className="inline mr-1" />
                    MAP
                  </button>
                  <button 
                    className={`px-3 py-1 ${activeView === 'graph' ? 'bg-green-900 text-black' : ''}`}
                    onClick={() => setActiveView('graph')}
                  >
                    <Network size={12} className="inline mr-1" />
                    GRAPH
                  </button>
                </div>
                
                <div>
                  <ViewMenu 
                    onSelectWorkspace={handleWorkspaceChange}
                    currentWorkspaceId={currentWorkspace.id}
                  />
                </div>
              </div>
              
              {/* Panel content */}
              <div className="flex-1 overflow-auto">
                {activeView === 'document' && <DocumentViewer />}
                {activeView === 'map' && <MapView />}
                {activeView === 'graph' && <KnowledgeGraph />}
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Side panel - Terminal/Keyboard */}
          <ResizablePanel defaultSize={30}>
            <TerminalInterface />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Status bar */}
      <div className="bg-black text-green-500 border-t border-green-900 p-1 text-xs flex justify-between">
        <div className="flex items-center">
          <Laptop size={12} className="mr-1" />
          <span>batcore-home</span>
        </div>
        <div className="flex items-center">
          <Clock size={12} className="mr-1" />
          <span>Uptime: 2d 7:45:24</span>
        </div>
        <div className="flex items-center">
          <ChevronRight size={12} className="mr-1" />
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}