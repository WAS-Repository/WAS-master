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
  Sun,
  Palette,
  Check,
  PlusCircle
} from 'lucide-react';
import MapView from '../visualization/MapView';
import KnowledgeGraph from '../visualization/KnowledgeGraph';
import DocumentViewer from '../visualization/DocumentViewer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Color scheme definitions - each theme has main colors that will be used
type ColorScheme = {
  name: string;
  id: string;
  mainColor: string;
  accentColor: string;
  bgColor: string;
  bgAltColor: string;
  borderColor: string;
};

const colorSchemes: ColorScheme[] = [
  {
    name: "Matrix Green",
    id: "matrix",
    mainColor: "#33ff33",
    accentColor: "#ff00ff",
    bgColor: "#000000",
    bgAltColor: "#001100",
    borderColor: "#22dd22"
  },
  {
    name: "Cyberpunk Blue",
    id: "cyberpunk",
    mainColor: "#00ccff",
    accentColor: "#ff3366",
    bgColor: "#000022",
    bgAltColor: "#000044",
    borderColor: "#0077aa"
  },
  {
    name: "Retro Amber",
    id: "amber",
    mainColor: "#ffb000",
    accentColor: "#ff3300",
    bgColor: "#1a1000",
    bgAltColor: "#221500",
    borderColor: "#cc7700"
  },
  {
    name: "Tron Legacy",
    id: "tron",
    mainColor: "#aacfd1",
    accentColor: "#ff9c00",
    bgColor: "#05080d",
    bgAltColor: "#0b131c",
    borderColor: "#6fc3df"
  },
  {
    name: "Blood Red",
    id: "blood",
    mainColor: "#ff0000",
    accentColor: "#770000",
    bgColor: "#0a0000",
    bgAltColor: "#110000",
    borderColor: "#aa0000"
  }
];

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
  const [colorScheme, setColorScheme] = useState<ColorScheme>(colorSchemes[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
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

  // Apply the main container background color from the color scheme
  return (
    <div className="h-full flex flex-col overflow-hidden font-mono scanlines" 
      style={{ 
        backgroundColor: colorScheme.bgColor,
        color: colorScheme.mainColor
      }}>
      
      {/* Main content area with grid layout */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Main content grid layout */}
        <div className="flex-1 flex flex-col">
          {/* Current time and info bar */}
          <div className="flex bg-black border-b border-[#22dd22] p-2" style={{ borderColor: colorScheme.borderColor, backgroundColor: colorScheme.bgColor }}>
            <div className="flex flex-col mr-6">
              <div className="font-bold text-xl" style={{ color: colorScheme.mainColor }}>{formatTime(currentTime)}</div>
              <div className="opacity-70 text-[10px]" style={{ color: colorScheme.mainColor }}>Current time in user time zone</div>
            </div>
            
            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {/* Network status removed */}
              </div>
              
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-opacity-20" 
                      style={{ color: colorScheme.mainColor }}
                    >
                      <Palette className="h-5 w-5" />
                      <span className="sr-only">Change theme</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" style={{ backgroundColor: colorScheme.bgAltColor, borderColor: colorScheme.borderColor }}>
                    <div className="p-2 border-b" style={{ borderColor: colorScheme.borderColor }}>
                      <h4 className="text-sm font-medium" style={{ color: colorScheme.mainColor }}>Choose a color scheme</h4>
                    </div>
                    <div className="p-2">
                      <div className="grid gap-2">
                        {colorSchemes.map((scheme) => (
                          <Button
                            key={scheme.id}
                            variant="ghost"
                            className="w-full justify-start flex items-center gap-2"
                            style={{ 
                              color: scheme.mainColor,
                              backgroundColor: scheme.id === colorScheme.id ? scheme.bgAltColor : 'transparent'
                            }}
                            onClick={() => setColorScheme(scheme)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.mainColor }}></div>
                              <span>{scheme.name}</span>
                            </div>
                            {scheme.id === colorScheme.id && (
                              <Check className="h-4 w-4 ml-auto" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <div className="uppercase text-right" style={{ color: colorScheme.mainColor }}>MAIN SHELL</div>
              </div>
            </div>
          </div>
          

          {/* Main visualization area */}
          <div className="flex flex-1">
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
              <div className="absolute top-2 right-2 z-30 bg-opacity-70 rounded p-1 border" 
                style={{ 
                  backgroundColor: colorScheme.bgColor,
                  borderColor: colorScheme.mainColor 
                }}
              >
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-1"
                    style={{ 
                      backgroundColor: documentViewMode === 'map' ? colorScheme.bgAltColor : 'transparent',
                      color: colorScheme.mainColor 
                    }}
                    onClick={() => setDocumentViewMode('map')}
                  >
                    <Map className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1"
                    style={{ 
                      backgroundColor: documentViewMode === 'graph' ? colorScheme.bgAltColor : 'transparent',
                      color: colorScheme.mainColor 
                    }}
                    onClick={() => setDocumentViewMode('graph')}
                  >
                    <Network className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1"
                    style={{ 
                      backgroundColor: documentViewMode === 'documents' ? colorScheme.bgAltColor : 'transparent',
                      color: colorScheme.mainColor 
                    }}
                    onClick={() => setDocumentViewMode('documents')}
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Map zoom controls */}
              <div className="absolute top-2 left-2 z-30 bg-opacity-70 rounded p-1 border"
                style={{ 
                  backgroundColor: colorScheme.bgColor,
                  borderColor: colorScheme.mainColor 
                }}
              >
                <div className="flex flex-col">
                  <button className="p-1" style={{ color: colorScheme.mainColor }}>
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="p-1" style={{ color: colorScheme.mainColor }}>
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right column - system monitors */}
            <div className="w-64 border-l flex flex-col" style={{ 
              borderColor: colorScheme.borderColor,
              backgroundColor: colorScheme.bgColor
            }}>
              {/* Funding Tracking Table */}
              <div className="p-2 border-b" style={{ borderColor: colorScheme.borderColor }}>
                <div className="text-xs flex items-center justify-between mb-1" style={{ color: colorScheme.mainColor }}>
                  <span className="text-xs font-bold uppercase" style={{ color: colorScheme.mainColor }}>PUBLIC FUNDING DATA</span>
                  <span className="text-[10px]" style={{ color: colorScheme.mainColor }}>Total: $14.6M</span>
                </div>
                <div className="max-h-48 overflow-y-auto text-[10px] border" style={{ 
                  backgroundColor: colorScheme.bgColor,
                  borderColor: colorScheme.mainColor,
                  color: colorScheme.mainColor
                }}>
                  <div className="sticky top-0 grid grid-cols-5 border-b p-1" style={{ 
                    borderColor: colorScheme.mainColor,
                    backgroundColor: colorScheme.bgColor
                  }}>
                    <div>Date</div>
                    <div>Agency</div>
                    <div>Project</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Doc ID</div>
                  </div>
                  
                  {[
                    { date: '2023-04-15', agency: 'NSF', project: 'Coastal Erosion Study', amount: '$1.2M', docId: 'RP-0731', type: 'research' },
                    { date: '2023-02-10', agency: 'NOAA', project: 'Tidal Pattern Analysis', amount: '$850K', docId: 'RP-0645', type: 'research' },
                    { date: '2022-11-05', agency: 'EPA', project: 'Water Quality Assessment', amount: '$2.1M', docId: 'RP-0592', type: 'research' },
                    { date: '2022-08-22', agency: 'USACE', project: 'Flood Barrier System', amount: '$3.7M', docId: 'PT-0114', type: 'patent' },
                    { date: '2022-06-30', agency: 'DOD', project: 'Naval Base Protection', amount: '$4.3M', docId: 'ED-0078', type: 'engineering' },
                    { date: '2022-03-12', agency: 'NSF', project: 'Sediment Transport', amount: '$920K', docId: 'RP-0489', type: 'research' },
                    { date: '2021-11-04', agency: 'FEMA', project: 'Emergency Response', amount: '$1.5M', docId: 'RP-0423', type: 'research' }
                  ].map((grant, i) => (
                    <div key={i} className="grid grid-cols-5 p-1 hover:bg-opacity-20 border-b" style={{ 
                      color: colorScheme.mainColor,
                      borderColor: colorScheme.borderColor,
                      cursor: 'pointer'
                    }}>
                      <div>{grant.date}</div>
                      <div>{grant.agency}</div>
                      <div className="truncate">{grant.project}</div>
                      <div className="text-right">{grant.amount}</div>
                      <div className="text-right flex items-center justify-end">
                        {grant.docId}
                        {grant.type === 'research' && (
                          <span className="ml-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: colorScheme.accentColor }}></span>
                        )}
                        {grant.type === 'patent' && (
                          <span className="ml-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: '#ffff33' }}></span>
                        )}
                        {grant.type === 'engineering' && (
                          <span className="ml-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: '#ff3333' }}></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Key players graph */}
              <div className="p-2 border-b" style={{ borderColor: colorScheme.borderColor }}>
                <div className="text-xs font-bold uppercase mb-1" style={{ color: colorScheme.mainColor }}>Key Role Players</div>
                <div className="h-32 relative p-1 border" style={{ 
                  backgroundColor: colorScheme.bgAltColor,
                  borderColor: colorScheme.mainColor
                }}>
                  {/* Simple knowledge graph visualization */}
                  <svg className="w-full h-full">
                    <circle cx="50%" cy="30%" r="5" fill={colorScheme.mainColor} />
                    <circle cx="30%" cy="60%" r="5" fill={colorScheme.mainColor} />
                    <circle cx="70%" cy="70%" r="5" fill={colorScheme.mainColor} />
                    <circle cx="80%" cy="40%" r="5" fill={colorScheme.mainColor} />
                    <circle cx="20%" cy="40%" r="5" fill={colorScheme.mainColor} />
                    
                    <line x1="50%" y1="30%" x2="30%" y2="60%" stroke={colorScheme.mainColor} strokeWidth="1" />
                    <line x1="50%" y1="30%" x2="70%" y2="70%" stroke={colorScheme.mainColor} strokeWidth="1" />
                    <line x1="50%" y1="30%" x2="80%" y2="40%" stroke={colorScheme.mainColor} strokeWidth="1" />
                    <line x1="50%" y1="30%" x2="20%" y2="40%" stroke={colorScheme.mainColor} strokeWidth="1" />
                    <line x1="30%" y1="60%" x2="70%" y2="70%" stroke={colorScheme.mainColor} strokeWidth="1" />
                    <line x1="80%" y1="40%" x2="70%" y2="70%" stroke={colorScheme.mainColor} strokeWidth="1" />
                  </svg>
                </div>
              </div>
              
              {/* Extra space for the funding table to expand */}
              <div className="flex-1 p-2 overflow-y-auto">
                {/* Content removed to simplify the interface */}
              </div>
            </div>
          </div>
          
          {/* Terminal section */}
          {showTerminal && (
            <div className="border-t" style={{ 
              borderColor: colorScheme.borderColor,
              backgroundColor: colorScheme.bgColor
            }}>
              <div className="flex items-center justify-between border-b p-1" style={{ 
                borderColor: colorScheme.borderColor,
                backgroundColor: colorScheme.bgColor
              }}>
                <div className="flex items-center">
                  <Terminal className="h-4 w-4 mr-2" style={{ color: colorScheme.mainColor }} />
                  <span className="text-xs font-medium" style={{ color: colorScheme.mainColor }}>Terminal</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 py-0 text-xs border hover:bg-opacity-20"
                  style={{ 
                    color: colorScheme.mainColor,
                    borderColor: colorScheme.mainColor
                  }}
                  onClick={toggleTerminal}
                >
                  Hide Terminal
                </Button>
              </div>
              
              <div className="p-2 h-20 overflow-y-auto font-mono text-xs" style={{ color: colorScheme.mainColor }}>
                <div style={{ color: colorScheme.mainColor }}>{'>'} Initialized Hampton Roads document visualization</div>
                <div style={{ color: colorScheme.mainColor }}>{'>'} Loaded 7 localities and 15 document references</div>
                <div style={{ color: colorScheme.mainColor }}>{'>'} Network graph initialized with 11 nodes and 13 connections</div>
                <div style={{ color: '#ffff33' }}>{'>'} Warning: Some document metadata is incomplete</div>
                <div style={{ color: colorScheme.mainColor }}>{'>'} System ready</div>
                <div className="flex items-center mt-2">
                  <span style={{ color: colorScheme.mainColor }} className="mr-1">{'>'}</span>
                  <Input 
                    className="h-6 py-1 px-2 bg-transparent border-none text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{ color: colorScheme.mainColor }}
                    placeholder="Enter command..."
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Footer status bar */}
          <div className="border-t py-1 px-2 text-[10px] flex items-center justify-between" 
            style={{ 
              backgroundColor: colorScheme.bgColor,
              borderColor: colorScheme.borderColor,
              color: colorScheme.mainColor 
            }}
          >
            <div className="flex items-center space-x-3">
              <div>APR 30 20:45 linux wired</div>
              <div>MANUFACTURER: SEACORE CHASSIS</div>
              <div>CPU USAGE: {cpuUsage}%</div>
            </div>
            
            <div className="flex items-center">
              <div className="uppercase" style={{ color: colorScheme.mainColor }}>Back</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}