import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  Terminal as TerminalIcon, 
  Monitor, 
  Smartphone, 
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  CheckSquare,
  FileText
} from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress?: (key: string) => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress }) => {
  const functionKeys = ['ESC', '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK'];
  const row1 = ['TAB', 'A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'];
  const row2 = ['CAPS', 'Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', "'", 'ENTER'];
  const row3 = ['SHIFT', '<', 'W', 'X', 'C', 'V', 'B', 'N', ',', '.', '/', 'SHIFT'];
  const row4 = ['CTRL', 'FN', 'ALT', ' ', 'ALT GR', 'CTRL'];
  
  const handleKeyPress = (key: string) => {
    console.log(`Key pressed: ${key}`);
    if (onKeyPress) {
      onKeyPress(key);
    }
  };
  
  return (
    <div className="bg-black text-green-500 p-2 font-mono text-xs rounded border border-green-900">
      <div className="grid grid-cols-15 gap-1 mb-1">
        {functionKeys.map((key, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm" 
            className="h-8 bg-black border-green-900 text-green-500 hover:bg-green-900 hover:text-black"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-14 gap-1 mb-1">
        {row1.map((key, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm" 
            className={`h-8 bg-black border-green-900 text-green-500 hover:bg-green-900 hover:text-black ${key === 'TAB' ? 'col-span-2' : ''}`}
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-13 gap-1 mb-1">
        {row2.map((key, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm" 
            className={`h-8 bg-black border-green-900 text-green-500 hover:bg-green-900 hover:text-black ${key === 'CAPS' ? 'col-span-2' : ''} ${key === 'ENTER' ? 'col-span-2' : ''}`}
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-12 gap-1 mb-1">
        {row3.map((key, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm" 
            className={`h-8 bg-black border-green-900 text-green-500 hover:bg-green-900 hover:text-black ${key === 'SHIFT' ? 'col-span-2' : ''}`}
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-10 gap-1">
        {row4.map((key, index) => (
          <Button 
            key={key === 'SHIFT' ? `${key}-${Math.random()}` : key} 
            variant="outline" 
            size="sm" 
            className={`h-8 bg-black border-green-900 text-green-500 hover:bg-green-900 hover:text-black ${key === ' ' ? 'col-span-4' : 'col-span-1'}`}
            onClick={() => handleKeyPress(key)}
          >
            {key === ' ' ? 'SPACE' : key}
          </Button>
        ))}
      </div>
    </div>
  );
};

interface SystemMonitorProps {
  hostname: string;
  ipAddress: string;
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({
  hostname,
  ipAddress,
  uptime,
  cpuUsage,
  memoryUsage
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
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
  
  return (
    <div className="bg-black text-green-500 p-2 font-mono text-xs rounded border border-green-900">
      <div className="mb-2 text-center text-xl">{formatTime(currentTime)}</div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <div className="text-green-300">HOSTNAME</div>
          <div>{hostname}</div>
        </div>
        <div>
          <div className="text-green-300">IP ADDRESS</div>
          <div>{ipAddress}</div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-green-300">SYSTEM UPTIME</div>
        <div>{uptime}</div>
      </div>
      
      <div className="mb-2">
        <div className="text-green-300">CPU USAGE</div>
        <div className="h-2 bg-green-900 rounded">
          <div 
            className="h-full bg-green-500 rounded" 
            style={{ width: `${cpuUsage}%` }}
          ></div>
        </div>
        <div className="text-right">{cpuUsage}%</div>
      </div>
      
      <div>
        <div className="text-green-300">MEMORY USAGE</div>
        <div className="h-2 bg-green-900 rounded">
          <div 
            className="h-full bg-green-500 rounded" 
            style={{ width: `${memoryUsage}%` }}
          ></div>
        </div>
        <div className="text-right">{memoryUsage}%</div>
      </div>
    </div>
  );
};

// Terminal simulation content
const TerminalContent = () => {
  const [entries, setEntries] = useState<Array<{ type: string; content: string }>>([
    { type: 'info', content: 'Terminal initialized. Type "help" for available commands.' },
    { type: 'command', content: 'ls' },
    { type: 'output', content: 'documents/ maps/ graphs/ system/' },
    { type: 'command', content: 'cat documents/README.md' },
    { type: 'output', content: '# Hampton Roads Research Platform\nThis terminal provides access to research documents, maps, and data visualization tools for the Hampton Roads region.\n\nUse the "search" command to find relevant documents.' }
  ]);
  
  return (
    <div className="h-full overflow-auto p-2 bg-black text-green-500 font-mono text-xs">
      {entries.map((entry, index) => (
        <div key={index} className={`mb-1 ${entry.type === 'command' ? 'text-cyan-400' : entry.type === 'error' ? 'text-red-400' : entry.type === 'info' ? 'text-yellow-400' : ''}`}>
          {entry.type === 'command' && <span className="text-green-300">$ </span>}
          {entry.content}
        </div>
      ))}
      <div className="flex items-center">
        <span className="text-green-300">$ </span>
        <div className="ml-1 h-4 w-2 bg-green-500 animate-pulse"></div>
      </div>
    </div>
  );
};

export default function TerminalInterface() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'terminal' | 'system' | 'keyboard'>('terminal');
  
  // Mock system data
  const systemData = {
    hostname: 'batcore-home',
    ipAddress: '96.22.220.83',
    uptime: '2d 7:45:24',
    cpuUsage: 18,
    memoryUsage: 32,
  };
  
  return (
    <div className="h-full flex flex-col bg-black text-green-500 font-mono border border-green-900 rounded">
      {/* Header tabs */}
      <div className="flex border-b border-green-900">
        <button 
          className={`px-4 py-2 border-r border-green-900 ${activeTab === 'terminal' ? 'bg-green-900 text-black' : ''}`}
          onClick={() => setActiveTab('terminal')}
        >
          <TerminalIcon size={14} className="inline mr-1" />
          TERMINAL
        </button>
        <button 
          className={`px-4 py-2 border-r border-green-900 ${activeTab === 'system' ? 'bg-green-900 text-black' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          <Monitor size={14} className="inline mr-1" />
          SYSTEM
        </button>
        {isMobile && (
          <button 
            className={`px-4 py-2 ${activeTab === 'keyboard' ? 'bg-green-900 text-black' : ''}`}
            onClick={() => setActiveTab('keyboard')}
          >
            <Smartphone size={14} className="inline mr-1" />
            KEYBOARD
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'terminal' && (
          <TerminalContent />
        )}
        
        {activeTab === 'system' && (
          <div className="p-2">
            <SystemMonitor {...systemData} />
          </div>
        )}
        
        {activeTab === 'keyboard' && isMobile && (
          <div className="p-2">
            <VirtualKeyboard />
          </div>
        )}
      </div>
      
      {/* Only show the keyboard on mobile in terminal mode */}
      {activeTab === 'terminal' && isMobile && (
        <div className="border-t border-green-900 p-2">
          <VirtualKeyboard />
        </div>
      )}
    </div>
  );
}