import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  Map, 
  FileText, 
  Terminal as TerminalIcon, 
  Clock, 
  Cpu, 
  HardDrive,
  Wifi,
  RefreshCw,
  ChevronRight,
  Keyboard as KeyboardIcon
} from 'lucide-react';
import { Terminal } from '../layout/Terminal';
import DocumentViewer from '../visualization/DocumentViewer';
import MapView from '../visualization/MapView';
import KnowledgeGraph from '../visualization/KnowledgeGraph';

const RetroTerminalLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(Math.floor(Math.random() * 20) + 5); // Random value between 5-25%
  const [networkPing, setNetworkPing] = useState(Math.floor(Math.random() * 40) + 20); // Random value between 20-60ms
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activePanel, setActivePanel] = useState<'document' | 'map' | 'graph' | 'terminal'>('document');

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

  const formatTime = (date: Date) => {
    return [
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
      date.getSeconds().toString().padStart(2, '0')
    ].join(':');
  };

  const formatDate = (date: Date) => {
    return [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0')
    ].join('-');
  };

  const toggleKeyboard = () => {
    setShowKeyboard(prev => !prev);
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-500 border border-green-500/50 rounded overflow-hidden font-mono">
      {/* Header with time and system info */}
      <div className="bg-black border-b border-green-500/50 p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{formatTime(currentTime)}</div>
            <div className="text-xs">
              <div>{formatDate(currentTime)}</div>
              <div>SYSTEM: ONLINE</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Cpu size={14} />
              <div className="text-xs">{cpuUsage}%</div>
            </div>
            <div className="flex items-center gap-1">
              <Wifi size={14} />
              <div className="text-xs">{networkPing}ms</div>
            </div>
            <div className="flex items-center gap-1">
              <HardDrive size={14} />
              <div className="text-xs">1.5TB</div>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw size={14} />
              <div className="text-xs">CONNECTED</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Main Panel - Document View by default */}
          <ResizablePanel defaultSize={70} minSize={40}>
            <div className="h-full border border-green-500/30 p-1">
              <div className="flex items-center bg-black border-b border-green-500/30 p-1 mb-1">
                <div className="flex items-center gap-1 text-xs">
                  <ChevronRight size={14} />
                  <span>MAIN DISPLAY</span>
                </div>
              </div>
              
              <div className="h-[calc(100%-2rem)] bg-black/50 p-1 overflow-auto">
                {activePanel === 'document' && <DocumentViewer />}
                {activePanel === 'map' && <MapView />}
                {activePanel === 'graph' && <KnowledgeGraph />}
                {activePanel === 'terminal' && <Terminal height={300} />}
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Side Panel - System controls, visualization toggles, etc. */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col">
              {/* Panel tabs */}
              <div className="border border-green-500/30 p-1 mb-1">
                <div className="flex items-center gap-1 text-xs mb-2">
                  <ChevronRight size={14} />
                  <span>SYSTEM CONTROLS</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <Button 
                    variant={activePanel === 'document' ? "default" : "outline"} 
                    size="sm" 
                    className="h-8 justify-start bg-transparent hover:bg-green-500/20 text-green-500 border-green-500/50"
                    onClick={() => setActivePanel('document')}
                  >
                    <FileText size={14} className="mr-2" /> 
                    DOCUMENT VIEWER
                  </Button>
                  
                  <Button 
                    variant={activePanel === 'map' ? "default" : "outline"}
                    size="sm" 
                    className="h-8 justify-start bg-transparent hover:bg-green-500/20 text-green-500 border-green-500/50"
                    onClick={() => setActivePanel('map')}
                  >
                    <Map size={14} className="mr-2" /> 
                    MAP VIEW
                  </Button>
                  
                  <Button 
                    variant={activePanel === 'graph' ? "default" : "outline"}
                    size="sm" 
                    className="h-8 justify-start bg-transparent hover:bg-green-500/20 text-green-500 border-green-500/50"
                    onClick={() => setActivePanel('graph')}
                  >
                    <Network size={14} className="mr-2" /> 
                    KNOWLEDGE GRAPH
                  </Button>
                  
                  <Button 
                    variant={activePanel === 'terminal' ? "default" : "outline"}
                    size="sm" 
                    className="h-8 justify-start bg-transparent hover:bg-green-500/20 text-green-500 border-green-500/50"
                    onClick={() => setActivePanel('terminal')}
                  >
                    <TerminalIcon size={14} className="mr-2" /> 
                    TERMINAL
                  </Button>
                </div>
              </div>
              
              {/* System status */}
              <div className="flex-1 border border-green-500/30 p-1 overflow-auto">
                <div className="flex items-center gap-1 text-xs mb-2">
                  <ChevronRight size={14} />
                  <span>SYSTEM STATUS</span>
                </div>
                
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>SYSTEM:</span>
                    <span className="text-green-400">ONLINE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CONNECTION:</span>
                    <span className="text-green-400">STABLE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PING:</span>
                    <span className="text-green-400">{networkPing}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CPU:</span>
                    <span className="text-green-400">{cpuUsage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MEMORY:</span>
                    <span className="text-green-400">1.2GB / 8GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UPTIME:</span>
                    <span className="text-green-400">07:45:22</span>
                  </div>
                  
                  <div className="h-px bg-green-500/30 my-2"></div>
                  
                  <div className="flex justify-between">
                    <span>ACTIVE SEARCHES:</span>
                    <span className="text-green-400">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DOCUMENTS:</span>
                    <span className="text-green-400">147</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LOCALITIES:</span>
                    <span className="text-green-400">7</span>
                  </div>
                </div>
              </div>
              
              {/* Only show terminal keyboard toggle on mobile */}
              {isMobile && (
                <div className="border border-green-500/30 p-1 mt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 justify-center bg-transparent hover:bg-green-500/20 text-green-500 border-green-500/50"
                    onClick={toggleKeyboard}
                  >
                    <KeyboardIcon size={14} className="mr-2" /> 
                    {showKeyboard ? 'HIDE KEYBOARD' : 'SHOW KEYBOARD'}
                  </Button>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Mobile keyboard - only on mobile devices */}
      {isMobile && showKeyboard && (
        <div className="border-t border-green-500/50 bg-black p-1 select-none">
          <div className="grid grid-cols-12 gap-1 mb-1">
            {['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'BACK'].map((key) => (
              <Button 
                key={key} 
                variant="outline"
                size="sm"
                className={`h-8 p-0 text-xs bg-black text-green-500 border-green-500/50 hover:bg-green-500/20 ${key === 'ESC' || key === 'BACK' ? 'col-span-2' : 'col-span-1'}`}
              >
                {key}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-1">
            {['TAB', 'A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '←'].map((key) => (
              <Button 
                key={key} 
                variant="outline"
                size="sm"
                className={`h-8 p-0 text-xs bg-black text-green-500 border-green-500/50 hover:bg-green-500/20 ${key === 'TAB' || key === '←' ? 'col-span-2' : 'col-span-1'}`}
              >
                {key}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-1">
            {['CAPS', 'Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'ENTER'].map((key) => (
              <Button 
                key={key} 
                variant="outline"
                size="sm"
                className={`h-8 p-0 text-xs bg-black text-green-500 border-green-500/50 hover:bg-green-500/20 ${key === 'CAPS' || key === 'ENTER' ? 'col-span-2' : 'col-span-1'}`}
              >
                {key}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-12 gap-1">
            {['SHIFT', '<', 'W', 'X', 'C', 'V', 'B', 'N', '?', '.', ':', 'SHIFT'].map((key) => (
              <Button 
                key={key === 'SHIFT' ? `${key}-${Math.random()}` : key} 
                variant="outline"
                size="sm"
                className={`h-8 p-0 text-xs bg-black text-green-500 border-green-500/50 hover:bg-green-500/20 ${key === 'SHIFT' ? 'col-span-2' : 'col-span-1'}`}
              >
                {key}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-12 gap-1 mt-1">
            <Button 
              variant="outline"
              size="sm"
              className="col-span-2 h-8 p-0 text-xs bg-black text-green-500 border-green-500/50 hover:bg-green-500/20"
            >
              CTRL
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="col-span-2 h-8 p-0 text-xs bg-black text-green-500 border-green-500/50 hover:bg-green-500/20"
            >
              ALT
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="col-span-6 h-8 p-0 text-xs bg-black text-green-500 border-green-500/50 hover:bg-green-500/20"
            >
              SPACE
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="col-span-2 h-8 p-0 text-xs bg-black text-green-500 border-green-500/50 hover:bg-green-500/20"
            >
              FN
            </Button>
          </div>
        </div>
      )}
      
      {/* Desktop terminal (instead of keyboard) */}
      {!isMobile && (
        <div className="border-t border-green-500/50 h-32">
          <Terminal height={128} focusMode={false} />
        </div>
      )}
    </div>
  );
};

export default RetroTerminalLayout;