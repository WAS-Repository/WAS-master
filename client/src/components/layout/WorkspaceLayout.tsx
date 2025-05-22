import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SearchFeature } from '@/components/search/SearchFeature';
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
  PlusCircle,
  X
} from 'lucide-react';
import MapView from '../visualization/MapView';
import KnowledgeGraph from '../visualization/KnowledgeGraph';
import DocumentViewer from '../visualization/DocumentViewer';
import WorkspacePanels from './WorkspacePanels';
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
  const [showColorPicker, setColorPicker] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  
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

  // Effect to sync focus mode with parent component
  useEffect(() => {
    // Check if we can access the parent document to find focus-mode class
    try {
      const isFocusModeActive = document.documentElement.classList.contains('focus-mode');
      if (isFocusModeActive !== focusMode) {
        setFocusMode(isFocusModeActive);
      }
    } catch (e) {
      // Ignore any errors that might occur when checking document
    }
  }, []);

  // Apply the main container background color from the color scheme
  return (
    <div className={`h-full flex flex-col overflow-hidden font-mono ${focusMode ? 'focus-mode-content' : ''}`} 
      style={{ 
        backgroundColor: colorScheme.bgColor,
        color: colorScheme.mainColor
      }}>
      
      {/* Main content area with grid layout */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Main content grid layout */}
        <div className="flex-1 flex flex-col">
          {/* Header bar */}
          <div className={`flex p-2 border-b ${focusMode ? 'content-header' : ''}`} 
            style={{ 
              borderColor: colorScheme.borderColor, 
              backgroundColor: colorScheme.bgColor 
            }}>
            <div className="flex-1 flex justify-end items-center">
              {/* Empty header bar - theme button moved to AppLayout */}
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
              
              {/* In Focus Mode, we add a simple indicator in the top-right */}
              {focusMode && (
                <div className="absolute top-2 right-2 focus-mode-indicator">
                  Focus Mode (Alt+F to exit)
                </div>
              )}
            </div>
            
            {/* Right column removed - now accessed through View menu */}
          </div>
        </div>
      </div>
    </div>
  );
}