import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Search, 
  Maximize, 
  Minimize, 
  Terminal, 
  Map, 
  Network, 
  FileText, 
  ChevronUp, 
  ChevronDown,
  Clock,
  AlertTriangle,
  Shield,
  RefreshCw,
  Cpu,
  HardDrive,
  BarChart,
  Wifi,
  ServerCrash,
  ExternalLink,
  Database,
  MonitorSmartphone
} from 'lucide-react';
import MapView from '../visualization/MapView';
import KnowledgeGraph from '../visualization/KnowledgeGraph';
import DocumentViewer from '../visualization/DocumentViewer';

/**
 * WorkspaceLayout component creates a sci-fi terminal-like interface based on the provided design
 * that displays document visualization with various panels like map view, knowledge graph, etc.
 */
export default function WorkspaceLayout() {
  const isMobile = useIsMobile();
  const [terminalHeight, setTerminalHeight] = useState(220);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showFileExplorer, setShowFileExplorer] = useState(!isMobile);
  const [activeDocTab, setActiveDocTab] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(Math.floor(Math.random() * 20) + 5); // Random value between 5-25%
  const [networkPing, setNetworkPing] = useState(Math.floor(Math.random() * 40) + 20); // Random value between 20-60ms
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentViewMode, setDocumentViewMode] = useState<'map' | 'graph' | 'documents'>('map');
  
  // Simulate real-time clock and changing metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate changing CPU usage
      setCpuUsage((prev) => {
        const change = Math.floor(Math.random() * 6) - 2; // -2 to +3 change
        return Math.max(3, Math.min(40, prev + change)); // Keep between 3-40%
      });
      // Simulate changing network ping
      setNetworkPing((prev) => {
        const change = Math.floor(Math.random() * 10) - 4; // -4 to +5 change
        return Math.max(15, Math.min(80, prev + change)); // Keep between 15-80ms
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Adjust layout for mobile devices
  useEffect(() => {
    if (isMobile) {
      setShowTerminal(false);
      setShowFileExplorer(false);
    }
  }, [isMobile]);
  
  // Toggle terminal visibility
  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };
  
  // Toggle file explorer visibility
  const toggleFileExplorer = () => {
    setShowFileExplorer(!showFileExplorer);
  };
  
  // Format time as HH:MM:SS with leading zeros
  const formatTime = (date: Date) => {
    return [
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
      date.getSeconds().toString().padStart(2, '0')
    ].join(':');
  };

  // Format date as MM/DD/YY
  const formatDate = (date: Date) => {
    return [
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0'),
      date.getFullYear().toString().slice(2)
    ].join('/');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-black text-[#00ff00] font-mono">
      {/* Top status bar */}
      <div className="bg-black border-b border-[#22dd22] p-1 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center justify-center">
            <div className="text-[#33ff33] font-bold text-xl">{formatTime(currentTime)}</div>
            <div className="text-[#33ff33] opacity-70 text-[10px]">Current time in user time zone</div>
          </div>
          
          <div className="px-2 py-1 border border-[#44ff44] bg-black">
            <span className="text-[#33ff33] mr-1">NETWORK STATUS</span>
            <span className={networkPing < 30 ? "text-[#33ff33]" : networkPing < 60 ? "text-[#ffff33]" : "text-[#ff3333]"}>
              {networkPing}ms latency
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="px-2 py-1 mr-2 text-center">
            <div className="text-[#33ff33] uppercase">MAIN SHELL</div>
          </div>
        </div>
      </div>
      
      {/* Main content area - flexible layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left sidebar - File Explorer for desktop, toggleable for mobile */}
        {showFileExplorer && (
          <div className="w-[200px] border-r border-[#22dd22] bg-[#001100] flex flex-col">
            <div className="p-2 border-b border-[#22dd22]">
              <h3 className="text-[#33ff33] text-xs uppercase">File Explorer</h3>
              
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#002200]"
                    title={`File system action ${index + 1}`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center border border-[#33ff33]">
                      {index === 0 && <FileText size={14} className="text-[#33ff33]" />}
                      {index === 1 && <Database size={14} className="text-[#33ff33]" />}
                      {index === 2 && <Shield size={14} className="text-[#33ff33]" />}
                      {index === 3 && <HardDrive size={14} className="text-[#33ff33]" />}
                      {index === 4 && <Network size={14} className="text-[#33ff33]" />}
                      {index === 5 && <Map size={14} className="text-[#33ff33]" />}
                      {index === 6 && <RefreshCw size={14} className="text-[#33ff33]" />}
                      {index === 7 && <ExternalLink size={14} className="text-[#33ff33]" />}
                      {index === 8 && <ServerCrash size={14} className="text-[#33ff33]" />}
                      {index === 9 && <MonitorSmartphone size={14} className="text-[#33ff33]" />}
                      {index === 10 && <Wifi size={14} className="text-[#33ff33]" />}
                      {index === 11 && <AlertTriangle size={14} className="text-[#33ff33]" />}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h4 className="text-[#33ff33] text-xs">Document Categories</h4>
                <div className="mt-1 cursor-pointer hover:bg-[#002200] p-1 flex items-center">
                  <span className="mr-1 text-[#33ff33]">▶</span>
                  <span className="text-[#33ff33] text-xs">Research Papers</span>
                </div>
                <div className="mt-1 cursor-pointer hover:bg-[#002200] p-1 flex items-center">
                  <span className="mr-1 text-[#33ff33]">▶</span>
                  <span className="text-[#33ff33] text-xs">Patents</span>
                </div>
                <div className="mt-1 cursor-pointer hover:bg-[#002200] p-1 flex items-center">
                  <span className="mr-1 text-[#33ff33]">▶</span>
                  <span className="text-[#33ff33] text-xs">Engineering Drawings</span>
                  <div className="ml-2">
                    <div className="cursor-pointer hover:bg-[#002200] p-1 flex items-center ml-3">
                      <Shield className="h-4 w-4 mr-1 text-[#33ff33]" />
                      <span className="text-[#33ff33] text-xs">Bridge_Structure_Hampton.dwg</span>
                    </div>
                    <div className="cursor-pointer hover:bg-[#002200] p-1 flex items-center ml-3">
                      <Shield className="h-4 w-4 mr-1 text-[#33ff33]" />
                      <span className="text-[#33ff33] text-xs">Port_Facility_Norfolk.dwg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Center area - Main document view */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {/* Top info panel with location info */}
          <div className="bg-[#001100] border-b border-[#22dd22] p-2 flex justify-between">
            <div>
              <div className="text-[#ff00ff] uppercase">Primary Location of Impact</div>
              <div className="text-[#33ff33] text-sm">Hampton Roads, VA</div>
            </div>
            <div>
              <div className="text-[#33ff33] uppercase text-right">World View</div>
              <div className="text-[#33ff33] text-xs text-right">ENDPOINT: LAT/LON 36.9081°, -76.1911°</div>
            </div>
          </div>
          
          {/* Main document visualization area */}
          <div className="flex-grow relative">
            <div className="absolute inset-0 text-center text-7xl font-bold text-[#ff00ff] flex items-center justify-center uppercase" style={{opacity: 0.1}}>
              Document View
            </div>
            
            {/* Tabs for selecting visualization mode */}
            <div className="absolute top-0 right-0 z-10 p-2 bg-black bg-opacity-60">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs border-[#33ff33] ${documentViewMode === 'map' ? 'bg-[#002200] text-[#33ff33]' : 'bg-transparent text-[#33ff33]'}`}
                  onClick={() => setDocumentViewMode('map')}
                >
                  <Map className="h-3 w-3 mr-1" />
                  Map
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs border-[#33ff33] ${documentViewMode === 'graph' ? 'bg-[#002200] text-[#33ff33]' : 'bg-transparent text-[#33ff33]'}`}
                  onClick={() => setDocumentViewMode('graph')}
                >
                  <Network className="h-3 w-3 mr-1" />
                  Graph
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs border-[#33ff33] ${documentViewMode === 'documents' ? 'bg-[#002200] text-[#33ff33]' : 'bg-transparent text-[#33ff33]'}`}
                  onClick={() => setDocumentViewMode('documents')}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Docs
                </Button>
              </div>
            </div>
            
            {/* The actual visualization components */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${documentViewMode === 'map' ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}>
              <MapView />
            </div>
            
            <div className={`absolute inset-0 transition-opacity duration-300 ${documentViewMode === 'graph' ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}>
              <KnowledgeGraph />
            </div>
            
            <div className={`absolute inset-0 transition-opacity duration-300 ${documentViewMode === 'documents' ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}>
              <DocumentViewer />
            </div>
          </div>
          
          {/* Document selection tabs */}
          <div className="bg-[#001100] border-t border-[#22dd22] p-2">
            <div className="text-[#ff00ff] text-sm mb-1">Document Selection Tabs</div>
            <Tabs defaultValue="all" onValueChange={setActiveDocTab} className="w-full">
              <TabsList className="bg-black border border-[#33ff33] p-1">
                <TabsTrigger 
                  value="all" 
                  className={`text-xs px-2 py-1 data-[state=active]:bg-[#002200] data-[state=active]:text-[#33ff33] text-[#33ff33]`}
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="research" 
                  className={`text-xs px-2 py-1 data-[state=active]:bg-[#002200] data-[state=active]:text-[#33ff33] text-[#33ff33]`}
                >
                  Research
                </TabsTrigger>
                <TabsTrigger 
                  value="patents" 
                  className={`text-xs px-2 py-1 data-[state=active]:bg-[#002200] data-[state=active]:text-[#33ff33] text-[#33ff33]`}
                >
                  Patents
                </TabsTrigger>
                <TabsTrigger 
                  value="drawings" 
                  className={`text-xs px-2 py-1 data-[state=active]:bg-[#002200] data-[state=active]:text-[#33ff33] text-[#33ff33]`}
                >
                  Drawings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Right sidebar - Document metrics and info */}
        <div className="w-[250px] border-l border-[#22dd22] bg-[#001100] overflow-y-auto">
          <div className="p-2 border-b border-[#22dd22]">
            <h3 className="text-[#33ff33] text-xs uppercase mb-2">Document Correlation Strength</h3>
            <div className="flex items-center space-x-1">
              <div className="h-4 flex-grow bg-[#002200]">
                <div className="h-full bg-[#33ff33]" style={{ width: `${60}%` }}></div>
              </div>
              <span className="text-[#33ff33] text-xs">60%</span>
            </div>
          </div>
          
          <div className="p-2 border-b border-[#22dd22]">
            <h3 className="text-[#33ff33] text-xs uppercase mb-2">CPU Usage</h3>
            <div className="flex items-center space-x-1">
              <div className="h-4 flex-grow bg-[#002200]">
                <div 
                  className={`h-full ${cpuUsage < 20 ? 'bg-[#33ff33]' : cpuUsage < 60 ? 'bg-[#ffff33]' : 'bg-[#ff3333]'}`} 
                  style={{ width: `${cpuUsage}%` }}
                ></div>
              </div>
              <span className="text-[#33ff33] text-xs">{cpuUsage}%</span>
            </div>
          </div>
          
          <div className="p-2 border-b border-[#22dd22]">
            <h3 className="text-[#33ff33] text-xs uppercase mb-2">Memory Usage</h3>
            <div className="flex flex-col space-y-1">
              <div className="grid grid-cols-3 text-[10px] text-[#33ff33]">
                <div>Memory</div>
                <div>Used</div>
                <div>Max</div>
              </div>
              <div className="bg-[#002200] p-1 grid grid-cols-3 text-[10px] text-[#33ff33]">
                <div>Main</div>
                <div>1.8G</div>
                <div>8.0G</div>
              </div>
              <div className="bg-[#002200] p-1 grid grid-cols-3 text-[10px] text-[#33ff33]">
                <div>Swap</div>
                <div>0.0</div>
                <div>2.0G</div>
              </div>
            </div>
          </div>
          
          <div className="p-2 border-b border-[#22dd22]">
            <h3 className="text-[#33ff33] text-xs uppercase mb-2">Network Traffic</h3>
            <div className="flex justify-between text-[10px] text-[#33ff33] mb-1">
              <span>Upload: 0.3 MB/s</span>
              <span>Download: 1.2 MB/s</span>
            </div>
            <div className="h-20 bg-[#002200] relative overflow-hidden">
              {/* Network traffic visualization - simple bar chart */}
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute bottom-0 bg-[#33ff33]" 
                  style={{
                    left: `${i * 5}%`, 
                    width: '4%', 
                    height: `${Math.random() * 70 + 10}%`,
                    opacity: 0.7
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="p-2 border-b border-[#22dd22]">
            <h3 className="text-[#33ff33] text-xs uppercase mb-2">Top Processes</h3>
            <div className="text-[10px] text-[#33ff33] bg-[#002200]">
              <div className="grid grid-cols-4 p-1 border-b border-[#22dd22]">
                <div>PID</div>
                <div>Name</div>
                <div>CPU</div>
                <div>Mem</div>
              </div>
              <div className="grid grid-cols-4 p-1">
                <div>15612</div>
                <div>edge-ui</div>
                <div>6.2%</div>
                <div>4.1%</div>
              </div>
              <div className="grid grid-cols-4 p-1">
                <div>15608</div>
                <div>edge-map</div>
                <div>3.5%</div>
                <div>2.8%</div>
              </div>
              <div className="grid grid-cols-4 p-1">
                <div>15617</div>
                <div>edge-db</div>
                <div>3.3%</div>
                <div>1.6%</div>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <h3 className="text-[#33ff33] text-xs uppercase mb-2">Key Role Players</h3>
            <div className="h-32 bg-[#002200] relative">
              {/* Simple knowledge graph visualization */}
              <svg className="w-full h-full">
                <circle cx="50%" cy="30%" r="5" fill="#33ff33" />
                <circle cx="30%" cy="60%" r="5" fill="#33ff33" />
                <circle cx="70%" cy="70%" r="5" fill="#33ff33" />
                <circle cx="80%" cy="40%" r="5" fill="#33ff33" />
                <circle cx="20%" cy="40%" r="5" fill="#33ff33" />
                
                <line x1="50%" y1="30%" x2="30%" y2="60%" stroke="#33ff33" strokeWidth="1" />
                <line x1="50%" y1="30%" x2="70%" y2="70%" stroke="#33ff33" strokeWidth="1" />
                <line x1="50%" y1="30%" x2="80%" y2="40%" stroke="#33ff33" strokeWidth="1" />
                <line x1="50%" y1="30%" x2="20%" y2="40%" stroke="#33ff33" strokeWidth="1" />
                <line x1="30%" y1="60%" x2="70%" y2="70%" stroke="#33ff33" strokeWidth="1" />
                <line x1="80%" y1="40%" x2="70%" y2="70%" stroke="#33ff33" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terminal section */}
      {showTerminal && (
        <div 
          className="border-t border-[#22dd22] bg-black overflow-hidden" 
          style={{ height: `${terminalHeight}px` }}
        >
          <div className="flex items-center justify-between border-b border-[#22dd22] p-1 bg-[#001100]">
            <div className="flex items-center">
              <Terminal className="h-4 w-4 mr-2 text-[#33ff33]" />
              <span className="text-xs font-medium text-[#33ff33]">Terminal</span>
            </div>
            
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-[#33ff33] hover:bg-[#002200]"
                onClick={() => setTerminalHeight(prev => Math.min(prev + 50, 400))}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-[#33ff33] hover:bg-[#002200]"
                onClick={() => setTerminalHeight(prev => Math.max(prev - 50, 120))}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-[#33ff33] hover:bg-[#002200]"
                onClick={toggleTerminal}
              >
                <Minimize className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-2 h-[calc(100%-32px)] overflow-y-auto font-mono text-xs text-[#33ff33]">
            <div className="text-[#33ff33]">{'>'} Initialized Hampton Roads document visualization</div>
            <div className="text-[#33ff33]">{'>'} Loaded 7 localities and 15 document references</div>
            <div className="text-[#33ff33]">{'>'} Network graph initialized with 11 nodes and 13 connections</div>
            <div className="text-[#ffff33]">{'>'} Warning: Some document metadata is incomplete</div>
            <div className="text-[#33ff33]">{'>'} Calculating spatial relationships between documents</div>
            <div className="text-[#33ff33]">{'>'} Map view ready</div>
            <div className="text-[#33ff33]">{'>'} System ready</div>
            <div className="flex items-center mt-2">
              <span className="text-[#33ff33] mr-1">{'>'}</span>
              <Input 
                className="h-6 py-1 px-2 bg-transparent border-none text-xs text-[#33ff33] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Enter command..."
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile controls */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          {!showTerminal && (
            <Button
              variant="outline"
              size="sm"
              className="bg-black border-[#33ff33] text-[#33ff33]"
              onClick={toggleTerminal}
            >
              <Terminal className="h-4 w-4 mr-1" />
              Terminal
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="bg-black border-[#33ff33] text-[#33ff33]"
            onClick={toggleFileExplorer}
          >
            <FileText className="h-4 w-4 mr-1" />
            {showFileExplorer ? 'Hide' : 'Files'}
          </Button>
        </div>
      )}
      
      {/* Status bar */}
      <div className="bg-[#001100] border-t border-[#22dd22] py-1 px-2 text-[10px] text-[#33ff33] flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>APR 30 20:45 linux wired</div>
          <div>MANUFACTURER: SEACORE CHASSIS</div>
          <div>CPU USAGE: {cpuUsage}%</div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Virtual keyboard indicator */}
          <div className="flex space-x-1">
            {['ESC', 'Z', '&', '§', '€', 'R', 'T', 'Y', 'U', 'I', 'O'].map((key, i) => (
              <div key={i} className="border border-[#33ff33] px-1">{key}</div>
            ))}
          </div>
          <div className="border border-[#33ff33] px-2">ENTER</div>
        </div>
      </div>
    </div>
  );
}