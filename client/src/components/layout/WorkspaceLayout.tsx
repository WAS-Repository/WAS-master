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
  MonitorSmartphone,
  File,
  Layers,
  Plus,
  Minus,
  Menu,
  Globe,
  List,
  Settings,
  HelpCircle,
  Edit,
  Sun
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
  const [terminalHeight, setTerminalHeight] = useState(100);
  const [showTerminal, setShowTerminal] = useState(true);
  const [activeDocTab, setActiveDocTab] = useState<'all' | 'research' | 'patents' | 'drawings'>('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(Math.floor(Math.random() * 20) + 5); // Random value between 5-25%
  const [networkPing, setNetworkPing] = useState(Math.floor(Math.random() * 40) + 20); // Random value between 20-60ms
  const [selectedLocality, setSelectedLocality] = useState<string | null>("Norfolk");
  const [documentViewMode, setDocumentViewMode] = useState<'map' | 'graph' | 'documents'>('map');
  const [navigationTab, setNavigationTab] = useState<number>(1);
  
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
  
  // Toggle terminal visibility
  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
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
    <div className="h-full flex flex-col overflow-hidden bg-black text-[#00ff00] font-mono scanlines">
      {/* Top navbar */}
      <div className="bg-black border-b border-[#22dd22] p-1 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#001000] border border-[#33ff33] p-1 rounded">
            <Globe className="h-5 w-5 text-[#33ff33] mr-1" />
            <span className="text-[#33ff33] font-bold text-sm">Hampton Roads Research Graph</span>
          </div>
        </div>
        
        <div className="flex space-x-4 mx-4">
          <div className="cursor-pointer hover:text-[#33ff33] text-[#33ff33]">File</div>
          <div className="cursor-pointer hover:text-[#33ff33] text-[#33ff33]">Edit</div>
          <div className="cursor-pointer hover:text-[#33ff33] text-[#33ff33]">View</div>
          <div className="cursor-pointer hover:text-[#33ff33] text-[#33ff33]">Help</div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Sun className="h-5 w-5 text-[#33ff33] cursor-pointer" />
          <Settings className="h-5 w-5 text-[#33ff33] cursor-pointer" />
          <div className="h-8 w-8 rounded-full bg-[#ff00ff] flex items-center justify-center text-black font-bold">JD</div>
        </div>
      </div>
      
      {/* Main content area with grid layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left icon navigation bar */}
        <div className="w-10 bg-black border-r border-[#22dd22] flex flex-col items-center pt-2">
          <button 
            className={`w-7 h-7 mb-3 flex items-center justify-center ${navigationTab === 1 ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'} border border-[#33ff33] rounded`}
            onClick={() => setNavigationTab(1)}
          >
            <File className="h-4 w-4" />
          </button>
          <button 
            className={`w-7 h-7 mb-3 flex items-center justify-center ${navigationTab === 2 ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'} border border-[#33ff33] rounded`}
            onClick={() => setNavigationTab(2)}
          >
            <Layers className="h-4 w-4" />
          </button>
          <button 
            className={`w-7 h-7 mb-3 flex items-center justify-center ${navigationTab === 3 ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'} border border-[#33ff33] rounded`}
            onClick={() => setNavigationTab(3)}
          >
            <List className="h-4 w-4" />
          </button>
          <button 
            className={`w-7 h-7 mb-3 flex items-center justify-center ${navigationTab === 4 ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'} border border-[#33ff33] rounded`}
            onClick={() => setNavigationTab(4)}
          >
            <Database className="h-4 w-4" />
          </button>
          <button 
            className={`w-7 h-7 mb-3 flex items-center justify-center ${navigationTab === 5 ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'} border border-[#33ff33] rounded`}
            onClick={() => setNavigationTab(5)}
          >
            <Terminal className="h-4 w-4" />
          </button>
        </div>
        
        {/* Main content grid layout */}
        <div className="flex-1 flex flex-col">
          {/* Current time and info bar */}
          <div className="flex bg-black border-b border-[#22dd22] p-2">
            <div className="flex flex-col mr-6">
              <div className="text-[#33ff33] font-bold text-xl">{formatTime(currentTime)}</div>
              <div className="text-[#33ff33] opacity-70 text-[10px]">Current time in user time zone</div>
            </div>
            
            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center bg-black border border-[#33ff33] px-2 py-1">
                <span className="text-[#ff00ff] uppercase mr-2">NETWORK STATUS</span>
                <span className={networkPing < 30 ? "text-[#33ff33]" : networkPing < 60 ? "text-[#ffff33]" : "text-[#ff3333]"}>
                  {networkPing}ms latency
                </span>
              </div>
              
              <div className="uppercase text-[#33ff33]">EMPTY</div>
              
              <div className="uppercase text-[#33ff33] text-right">MAIN SHELL</div>
            </div>
          </div>
          
          {/* Location and coordinate information */}
          <div className="flex bg-black border-b border-[#22dd22] p-2">
            <div className="w-1/3">
              <div className="text-[#ff00ff] uppercase text-xs">Primary Location of Impact</div>
              <div className="text-[#33ff33]">Hampton Roads, VA</div>
            </div>
            
            <div className="w-1/3 text-center">
              <div className="text-[#33ff33] uppercase text-xs">WORLD VIEW</div>
              <div className="text-[#33ff33] text-xs">GLOBAL NETWORK MAP</div>
            </div>
            
            <div className="w-1/3 text-right">
              <div className="text-[#33ff33] uppercase text-xs">ENDPOINT LOCATION</div>
              <div className="text-[#33ff33] text-xs">LAT/LON 36.9081°, -76.1911°</div>
            </div>
          </div>
          
          {/* Main visualization area */}
          <div className="flex flex-1">
            {/* Left column - document navigation */}
            <div className="w-56 border-r border-[#22dd22] bg-black p-2 flex flex-col">
              <div className="mb-3">
                <div className="text-[#33ff33] font-semibold mb-1">Hampton Roads Localities</div>
                <div className="text-xs text-[#33ff33] mb-2">Select a locality to view</div>
                <div className="space-y-1">
                  {['Norfolk', 'Hampton', 'Portsmouth', 'Virginia Beach', 'Newport News', 'Suffolk', 'Chesapeake'].map(locality => (
                    <div 
                      key={locality}
                      className={`cursor-pointer p-1 rounded flex items-center ${selectedLocality === locality ? 'bg-[#001800]' : 'hover:bg-[#001800]'}`}
                      onClick={() => setSelectedLocality(locality)}
                    >
                      <div className={`w-2 h-2 rounded-full ${selectedLocality === locality ? 'bg-[#33ff33]' : 'bg-[#33ff33] opacity-50'} mr-2`}></div>
                      <span className="text-[#33ff33] text-sm">{locality}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-2 mb-auto">
                <div className="text-[#ff00ff] font-semibold text-xs mb-1">Documents Selection Tabs</div>
                <div className="border border-[#33ff33] p-1 flex space-x-1 bg-black">
                  <button 
                    className={`px-2 py-0.5 text-xs ${activeDocTab === 'all' ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'}`}
                    onClick={() => setActiveDocTab('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`px-2 py-0.5 text-xs ${activeDocTab === 'research' ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'}`}
                    onClick={() => setActiveDocTab('research')}
                  >
                    Research
                  </button>
                  <button 
                    className={`px-2 py-0.5 text-xs ${activeDocTab === 'patents' ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'}`}
                    onClick={() => setActiveDocTab('patents')}
                  >
                    Patents
                  </button>
                  <button 
                    className={`px-2 py-0.5 text-xs ${activeDocTab === 'drawings' ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'}`}
                    onClick={() => setActiveDocTab('drawings')}
                  >
                    Drawings
                  </button>
                </div>
                
                <div className="border-l border-r border-b border-[#33ff33] bg-black p-2">
                  <div className="text-[#33ff33] text-xs mb-1">
                    {selectedLocality}: {activeDocTab === 'all' ? '3 types' : ''}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Center area - Map/Graph visualization */}
            <div className="flex-1 relative">
              <div className="absolute inset-0">
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
              
              {/* Control overlay */}
              <div className="absolute top-2 right-2 z-30 bg-black bg-opacity-70 border border-[#33ff33] rounded p-1">
                <div className="flex items-center space-x-2">
                  <button 
                    className={`p-1 ${documentViewMode === 'map' ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'}`}
                    onClick={() => setDocumentViewMode('map')}
                  >
                    <Map className="h-4 w-4" />
                  </button>
                  <button 
                    className={`p-1 ${documentViewMode === 'graph' ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'}`}
                    onClick={() => setDocumentViewMode('graph')}
                  >
                    <Network className="h-4 w-4" />
                  </button>
                  <button 
                    className={`p-1 ${documentViewMode === 'documents' ? 'bg-[#001800] text-[#33ff33]' : 'text-[#33ff33]'}`}
                    onClick={() => setDocumentViewMode('documents')}
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Map zoom controls */}
              <div className="absolute top-2 left-2 z-30 bg-black bg-opacity-70 border border-[#33ff33] rounded p-1">
                <div className="flex flex-col">
                  <button className="p-1 text-[#33ff33]">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-[#33ff33]">
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right column - system monitors */}
            <div className="w-64 border-l border-[#22dd22] bg-black flex flex-col">
              {/* Process table */}
              <div className="p-2 border-b border-[#22dd22]">
                <div className="text-xs text-[#33ff33] flex items-center justify-between mb-1">
                  <span className="text-xs text-[#33ff33] font-bold uppercase">PID TABLE</span>
                  <span className="text-[10px] text-[#33ff33]">Active: 7/12</span>
                </div>
                <div className="bg-black border border-[#33ff33] text-[10px]">
                  <div className="grid grid-cols-5 border-b border-[#33ff33] p-1">
                    <div>PID</div>
                    <div>Name</div>
                    <div className="text-right">CPU</div>
                    <div className="text-right">MEM</div>
                    <div className="text-right">Time</div>
                  </div>
                  
                  {[
                    { pid: '15608', name: 'edge-map', cpu: '3.5%', mem: '2.8%', time: '1:25.16' },
                    { pid: '15612', name: 'edge-ui', cpu: '6.2%', mem: '4.1%', time: '2:48.33' },
                    { pid: '15617', name: 'edge-db', cpu: '3.3%', mem: '1.6%', time: '0:31.71' },
                    { pid: '15631', name: 'node', cpu: '2.0%', mem: '3.3%', time: '0:12.46' }
                  ].map((process, i) => (
                    <div key={i} className="grid grid-cols-5 p-1 hover:bg-[#001800]">
                      <div>{process.pid}</div>
                      <div>{process.name}</div>
                      <div className="text-right">{process.cpu}</div>
                      <div className="text-right">{process.mem}</div>
                      <div className="text-right">{process.time}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Key players graph */}
              <div className="p-2 border-b border-[#22dd22]">
                <div className="text-xs text-[#33ff33] font-bold uppercase mb-1">Key Role Players</div>
                <div className="h-32 bg-[#001000] border border-[#33ff33] relative p-1">
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
              
              {/* System metrics and Events Calendar */}
              <div className="flex-1 p-2 overflow-y-auto">
                <div className="mb-3">
                  <div className="text-xs text-[#33ff33] font-bold uppercase mb-1">Document Correlation Strength</div>
                  <div className="flex items-center space-x-1">
                    <div className="h-3 flex-grow bg-[#001000] border border-[#33ff33]">
                      <div className="h-full bg-[#33ff33]" style={{ width: `60%` }}></div>
                    </div>
                    <span className="text-[#33ff33] text-xs">60%</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-xs text-[#33ff33] font-bold uppercase mb-1">CPU Usage</div>
                  <div className="flex items-center space-x-1">
                    <div className="h-3 flex-grow bg-[#001000] border border-[#33ff33]">
                      <div 
                        className={`h-full ${cpuUsage < 20 ? 'bg-[#33ff33]' : cpuUsage < 60 ? 'bg-[#ffff33]' : 'bg-[#ff3333]'}`} 
                        style={{ width: `${cpuUsage}%` }}
                      ></div>
                    </div>
                    <span className="text-[#33ff33] text-xs">{cpuUsage}%</span>
                  </div>
                </div>
                
                {/* Calendar of Events */}
                <div className="mb-3">
                  <div className="text-xs text-[#ff00ff] font-bold uppercase mb-1">Calendar of Events</div>
                  <div className="bg-[#001000] border border-[#33ff33] p-1">
                    <div className="grid grid-cols-7 gap-px mb-1">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-[10px] text-[#33ff33] font-bold">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-px">
                      {Array.from({ length: 30 }, (_, i) => {
                        const hasEvent = [3, 8, 12, 17, 22, 25].includes(i);
                        return (
                          <div 
                            key={i} 
                            className={`text-center text-[10px] p-1 ${hasEvent ? 'bg-[#002200] border border-[#33ff33]' : ''}`}
                          >
                            {i + 1}
                            {hasEvent && <div className="w-1 h-1 bg-[#33ff33] rounded-full mx-auto mt-0.5"></div>}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="text-[10px] text-[#33ff33] mt-1">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#33ff33] mr-1"></div>
                        <span>04/08: Research data upload</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#33ff33] mr-1"></div>
                        <span>04/17: Coastal analysis report</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#33ff33] mr-1"></div>
                        <span>04/25: Stakeholder meeting</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Terminal section */}
          {showTerminal && (
            <div className="border-t border-[#22dd22] bg-black">
              <div className="flex items-center justify-between border-b border-[#22dd22] p-1 bg-black">
                <div className="flex items-center">
                  <Terminal className="h-4 w-4 mr-2 text-[#33ff33]" />
                  <span className="text-xs font-medium text-[#33ff33]">Terminal</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 py-0 text-[#33ff33] hover:bg-[#001800] text-xs border border-[#33ff33]"
                  onClick={toggleTerminal}
                >
                  Hide Terminal
                </Button>
              </div>
              
              <div className="p-2 h-20 overflow-y-auto font-mono text-xs text-[#33ff33]">
                <div className="text-[#33ff33]">{'>'} Initialized Hampton Roads document visualization</div>
                <div className="text-[#33ff33]">{'>'} Loaded 7 localities and 15 document references</div>
                <div className="text-[#33ff33]">{'>'} Network graph initialized with 11 nodes and 13 connections</div>
                <div className="text-[#ffff33]">{'>'} Warning: Some document metadata is incomplete</div>
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
          
          {/* Footer status bar */}
          <div className="bg-black border-t border-[#22dd22] py-1 px-2 text-[10px] text-[#33ff33] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>APR 30 20:45 linux wired</div>
              <div>MANUFACTURER: SEACORE CHASSIS</div>
              <div>CPU USAGE: {cpuUsage}%</div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-3 uppercase text-[#33ff33]">Back</div>
              {/* Virtual keyboard indicator - On Mobile Keyboard main system */}
              <div id="keyboard" className="flex flex-col">
                <div className="flex mb-1 justify-center">
                  <div className="border border-[#33ff33] px-2 py-0.5 mr-1 text-center">ESC</div>
                  <div className="flex space-x-1">
                    {['Z', '&', 'É', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key, i) => (
                      <div key={i} className="border border-[#33ff33] w-6 h-6 flex items-center justify-center">{key}</div>
                    ))}
                  </div>
                </div>
                
                <div className="flex mb-1 justify-center">
                  <div className="border border-[#33ff33] px-2 py-0.5 mr-1 text-center">TAB</div>
                  <div className="flex space-x-1">
                    {['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key, i) => (
                      <div key={i} className="border border-[#33ff33] w-6 h-6 flex items-center justify-center">{key}</div>
                    ))}
                  </div>
                </div>
                
                <div className="flex mb-1 justify-center">
                  <div className="border border-[#33ff33] px-2 py-0.5 mr-1 text-center">CAPS</div>
                  <div className="flex space-x-1">
                    {['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'].map((key, i) => (
                      <div key={i} className="border border-[#33ff33] w-6 h-6 flex items-center justify-center">{key}</div>
                    ))}
                  </div>
                </div>
                
                <div className="flex mb-1 justify-center">
                  <div className="border border-[#33ff33] px-2 py-0.5 mr-1 text-center">SHIFT</div>
                  <div className="flex space-x-1">
                    {['<', 'W', 'X', 'C', 'V', 'B', 'N', ',', '.', '/'].map((key, i) => (
                      <div key={i} className="border border-[#33ff33] w-6 h-6 flex items-center justify-center">{key}</div>
                    ))}
                  </div>
                  <div className="border border-[#33ff33] px-2 py-0.5 ml-1 text-center">SHIFT</div>
                </div>
                
                <div className="flex justify-center">
                  <div className="border border-[#33ff33] px-2 py-0.5 mr-1 text-center">CTRL</div>
                  <div className="border border-[#33ff33] px-2 py-0.5 mr-1 text-center">FN</div>
                  <div className="border border-[#33ff33] px-16 py-0.5 text-center">keyboard trigger event</div>
                  <div className="border border-[#33ff33] px-2 py-0.5 ml-1 text-center">ALT GR</div>
                  <div className="border border-[#33ff33] px-2 py-0.5 ml-1 text-center">CTRL</div>
                </div>
                
                <div className="text-center text-[8px] mt-1 text-[#33ff33]">
                  On desktop mode this is the terminal. Keyboard leaves when bluetooth or wired keyboard is enabled
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}