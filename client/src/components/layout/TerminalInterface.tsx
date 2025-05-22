import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Terminal as TerminalIcon, 
  Monitor, 
  Smartphone, 
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  CheckSquare,
  FileText,
  FolderOpen,
  Search,
  HelpCircle,
  MessageSquare,
  Maximize2
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

// Define file tree data structure
type FileType = 'file' | 'folder';

interface FileTreeItem {
  name: string;
  type: FileType;
  children?: FileTreeItem[];
  expanded?: boolean;
  icon?: React.ReactNode;
  path: string;
}

// Sample research data file structure
const researchFileTree: FileTreeItem[] = [
  {
    name: 'DOCUMENTS',
    type: 'folder',
    expanded: true,
    path: '/documents',
    children: [
      { name: 'Coastal Erosion Impact Study.pdf', type: 'file', path: '/documents/coastal-erosion' },
      { name: 'Tidal Pattern Analysis.pdf', type: 'file', path: '/documents/tidal-patterns' },
      { name: 'Sea Level Rise Projections.pdf', type: 'file', path: '/documents/sea-level' }
    ]
  },
  {
    name: 'MAPS',
    type: 'folder',
    expanded: true,
    path: '/maps',
    children: [
      { name: 'Norfolk Flood Zones.map', type: 'file', path: '/maps/norfolk-flood' },
      { name: 'Virginia Beach Coastal.map', type: 'file', path: '/maps/virginia-beach' },
      { name: 'Hampton Roads Region.map', type: 'file', path: '/maps/hampton-roads' }
    ]
  },
  {
    name: 'RESEARCH DATA',
    type: 'folder',
    expanded: false,
    path: '/data',
    children: [
      { name: 'Tide Measurements.csv', type: 'file', path: '/data/tide-measurements' },
      { name: 'Erosion Rates.csv', type: 'file', path: '/data/erosion-rates' },
      { name: 'Impact Analysis.xlsx', type: 'file', path: '/data/impact-analysis' }
    ]
  }
];

// File Explorer Component
const FileExplorer: React.FC<{ 
  files: FileTreeItem[],
  onFileSelect: (file: FileTreeItem) => void,
  onToggleFolder: (folder: FileTreeItem) => void
}> = ({ files, onFileSelect, onToggleFolder }) => {
  return (
    <div className="h-full overflow-auto p-1 text-xs">
      {files.map((item, index) => (
        <FileTreeNode 
          key={index} 
          item={item} 
          level={0}
          onFileSelect={onFileSelect}
          onToggleFolder={onToggleFolder}
        />
      ))}
    </div>
  );
};

// File Tree Node Component
const FileTreeNode: React.FC<{ 
  item: FileTreeItem, 
  level: number,
  onFileSelect: (file: FileTreeItem) => void,
  onToggleFolder: (folder: FileTreeItem) => void
}> = ({ item, level, onFileSelect, onToggleFolder }) => {
  
  const handleClick = () => {
    if (item.type === 'folder') {
      onToggleFolder(item);
    } else {
      onFileSelect(item);
    }
  };
  
  return (
    <div>
      <div 
        className="flex items-center py-1 px-1 hover:bg-green-900 hover:bg-opacity-20 cursor-pointer" 
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleClick}
      >
        {item.type === 'folder' ? (
          <span className="mr-1">{item.expanded ? '▼' : '►'}</span>
        ) : (
          <span className="mr-1 ml-3">📄</span>
        )}
        <span className={item.type === 'folder' ? 'font-bold' : ''}>{item.name}</span>
      </div>
      
      {item.type === 'folder' && item.expanded && item.children && (
        <div>
          {item.children.map((child, idx) => (
            <FileTreeNode 
              key={idx} 
              item={child} 
              level={level + 1}
              onFileSelect={onFileSelect}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// File Editor Tab Component
const EditorTab: React.FC<{
  fileName: string;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}> = ({ fileName, isActive, onSelect, onClose }) => {
  return (
    <div 
      className={`flex items-center px-3 py-1 border-r border-green-900 cursor-pointer ${isActive ? 'bg-green-900 text-black' : ''}`}
      onClick={onSelect}
    >
      <FileText size={12} className="inline mr-1" />
      <span>{fileName}</span>
      <span 
        className="ml-2 hover:text-red-400"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        ×
      </span>
    </div>
  );
};

// Document Content Component
const DocumentContent: React.FC<{
  filePath: string;
}> = ({ filePath }) => {
  // Show research document content based on the path
  const getDocumentContent = (path: string) => {
    if (path === '/documents/coastal-erosion') {
      return `# Coastal Erosion Impact Study

## Executive Summary
This study examines the impact of coastal erosion on Hampton Roads communities over the past decade.

## Key Findings
- Erosion rates have increased 32% in vulnerable shoreline areas
- Property damage estimated at $45M annually
- Natural barriers reduced by 18% since 2010

## Recommendations
1. Implement enhanced shoreline protection measures
2. Develop long-term coastal management strategy
3. Invest in natural barrier restoration projects`;
    } else if (path === '/documents/tidal-patterns') {
      return `# Tidal Pattern Analysis for Hampton Roads

## Overview
This analysis documents changing tidal patterns in the Hampton Roads region and their implications for flood risk management.

## Methodology
- 10-year measurement series from 8 monitoring stations
- Statistical analysis of tidal cycles and anomalies
- Correlation with storm surge events

## Results
Tidal ranges have increased by 0.8ft on average across all monitoring stations, with the most significant changes observed during spring tides.`;
    } else if (path === '/maps/norfolk-flood') {
      return `[MAP VISUALIZATION: Norfolk Flood Zones]

This map displays the current flood risk zones for Norfolk based on the latest FEMA assessments and local monitoring data.

Legend:
- Red: High risk (annual flood probability >20%)
- Orange: Moderate risk (annual flood probability 5-20%) 
- Yellow: Low risk (annual flood probability <5%)

Key vulnerable areas include:
- Ghent
- Ocean View
- Downtown waterfront`;
    } else {
      return `# Document: ${path}

This document is part of the Hampton Roads Research Platform collection.

The content is being prepared for viewing. Select another document or use the terminal to execute research queries.`;
    }
  };
  
  return (
    <div className="h-full overflow-auto p-2 text-xs font-mono">
      <pre className="whitespace-pre-wrap">{getDocumentContent(filePath)}</pre>
    </div>
  );
};

// Full functional terminal component with command handling
const TerminalContentFull = () => {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { 
      type: 'info', 
      content: 'Hampton Roads Research Terminal v1.0.0', 
      timestamp: new Date() 
    },
    { 
      type: 'info', 
      content: 'Type \'help\' for a list of available commands.', 
      timestamp: new Date() 
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState('/home/researcher');
  const [terminalMode, setTerminalMode] = useState<'shell' | 'agent' | 'explorer'>('shell');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Sample document data
  const documents = [
    { id: 1, title: "Coastal Erosion Impact Study", year: 2023, type: "research" },
    { id: 2, title: "Tidal Pattern Analysis for Hampton Roads", year: 2023, type: "research" },
    { id: 3, title: "Naval Base Protection Systems", year: 2022, type: "engineering" },
    { id: 4, title: "Sea Level Rise Projections", year: 2024, type: "research" },
    { id: 5, title: "Flood Mitigation Techniques", year: 2023, type: "policy" }
  ];
  
  // Focus the input on render and after clicking
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  // Process command submission
  const handleCommand = async () => {
    if (!currentCommand.trim()) return;
    
    // Add command to terminal output and history
    setEntries(prev => [
      ...prev, 
      { type: 'command', content: `${currentPath}$ ${currentCommand}`, timestamp: new Date() }
    ]);
    
    // Add to command history
    setCommandHistory(prev => [currentCommand, ...prev]);
    setHistoryIndex(-1);

    try {
      // Command parsing
      const commandParts = currentCommand.trim().split(/\s+/);
      const mainCommand = commandParts[0].toLowerCase();
      const args = commandParts.slice(1);

      // Process different command types
      switch(mainCommand) {
        case 'help':
          showHelp();
          break;
        case 'clear':
          clearTerminal();
          break;
        case 'date':
          showDate();
          break;
        case 'pwd':
          showCurrentPath();
          break;
        case 'ls':
          listDirectory();
          break;
        case 'cd':
          changeDirectory(args[0]);
          break;
        case 'echo':
          echoMessage(args.join(' '));
          break;
        case 'search':
          searchDocuments(args.join(' '));
          break;
        case 'view':
          viewDocument(args[0]);
          break;
        case 'map':
          handleMapCommand(args);
          break;
        case 'graph':
          handleGraphCommand(args);
          break;
        case 'mode':
          if (args.length === 0) {
            setEntries(prev => [
              ...prev,
              { type: 'info', content: `Current mode: ${terminalMode}`, timestamp: new Date() }
            ]);
          } else if (['shell', 'agent', 'explorer'].includes(args[0])) {
            switchMode(args[0] as 'shell' | 'agent' | 'explorer');
          } else {
            setEntries(prev => [
              ...prev,
              { type: 'error', content: `Unknown mode: ${args[0]}. Available modes: shell, agent, explorer`, timestamp: new Date() }
            ]);
          }
          break;
        default:
          setEntries(prev => [
            ...prev,
            { type: 'error', content: `Command not found: ${mainCommand}`, timestamp: new Date() }
          ]);
      }
    } catch (error) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `Error: ${(error as Error).message}`, timestamp: new Date() }
      ]);
    }

    // Clear the input
    setCurrentCommand('');
    
    // Scroll to bottom
    if (terminalRef.current) {
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 0);
    }
  };
  
  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      // Navigate up through command history
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      // Navigate down through command history
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };
  
  // Command implementations
  const showHelp = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Available commands:', timestamp: new Date() },
      { type: 'info', content: '\nTerminal commands:', timestamp: new Date() },
      { type: 'info', content: '  help              - Display this help message', timestamp: new Date() },
      { type: 'info', content: '  clear             - Clear terminal output', timestamp: new Date() },
      { type: 'info', content: '  pwd               - Print working directory', timestamp: new Date() },
      { type: 'info', content: '  ls                - List directory contents', timestamp: new Date() },
      { type: 'info', content: '  cd <path>         - Change directory', timestamp: new Date() },
      { type: 'info', content: '  echo <message>    - Display a message', timestamp: new Date() },
      { type: 'info', content: '  date              - Show current date and time', timestamp: new Date() },
      { type: 'info', content: '\nResearch commands:', timestamp: new Date() },
      { type: 'info', content: '  search <query>    - Search for documents', timestamp: new Date() },
      { type: 'info', content: '  view <id>         - View document details', timestamp: new Date() },
      { type: 'info', content: '  map show-docs     - Show documents on map', timestamp: new Date() },
      { type: 'info', content: '  graph add <id>    - Add document to knowledge graph', timestamp: new Date() },
      { type: 'info', content: '  mode <type>       - Switch terminal mode (shell, agent, explorer)', timestamp: new Date() }
    ]);
  };

  const clearTerminal = () => {
    setEntries([
      { type: 'info', content: 'Terminal cleared.', timestamp: new Date() }
    ]);
  };

  const showDate = () => {
    setEntries(prev => [
      ...prev,
      { type: 'output', content: new Date().toString(), timestamp: new Date() }
    ]);
  };

  const showCurrentPath = () => {
    setEntries(prev => [
      ...prev,
      { type: 'output', content: currentPath, timestamp: new Date() }
    ]);
  };

  const listDirectory = () => {
    // Simulate directory listing based on current path
    let listing = '';
    
    if (currentPath === '/home/researcher') {
      listing = 'Documents/  Maps/  Data/  Downloads/';
    } else if (currentPath === '/home/researcher/Documents') {
      listing = 'Research/  Reports/  Policy/';
    } else if (currentPath === '/home/researcher/Maps') {
      listing = 'norfolk_flood.map  virginia_beach_coastal.map  hampton_roads_region.map';
    } else {
      listing = 'No files found.';
    }
    
    setEntries(prev => [
      ...prev,
      { type: 'output', content: listing, timestamp: new Date() }
    ]);
  };

  const changeDirectory = (path: string = '') => {
    if (!path) {
      setCurrentPath('/home/researcher');
      return;
    }
    
    let newPath;
    if (path.startsWith('/')) {
      newPath = path;
    } else if (path === '..') {
      const parts = currentPath.split('/');
      parts.pop();
      newPath = parts.join('/') || '/';
    } else {
      newPath = currentPath === '/' ? `/${path}` : `${currentPath}/${path}`;
    }
    
    // Validate path (in a real app, you'd check if the path exists)
    const validPaths = [
      '/home/researcher', 
      '/home/researcher/Documents', 
      '/home/researcher/Maps', 
      '/home/researcher/Data',
      '/home/researcher/Downloads'
    ];
    
    if (validPaths.includes(newPath)) {
      setCurrentPath(newPath);
    } else {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `cd: no such directory: ${path}`, timestamp: new Date() }
      ]);
    }
  };

  const echoMessage = (message: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'output', content: message, timestamp: new Date() }
    ]);
  };

  const searchDocuments = (query: string) => {
    if (!query) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: 'search: missing search query', timestamp: new Date() }
      ]);
      return;
    }
    
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Searching for "${query}"...`, timestamp: new Date() }
    ]);
    
    // Simulate search results
    setTimeout(() => {
      const results = documents.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase())
      );
      
      if (results.length > 0) {
        setEntries(prev => [
          ...prev,
          { type: 'success', content: `Found ${results.length} documents matching "${query}"`, timestamp: new Date() },
          ...results.map(doc => ({
            type: 'output' as const,
            content: `${doc.id}. ${doc.title} (${doc.year}) [${doc.type}]`,
            timestamp: new Date()
          }))
        ]);
      } else {
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `No documents found matching "${query}"`, timestamp: new Date() }
        ]);
      }
    }, 500);
  };

  const viewDocument = (idString: string) => {
    if (!idString) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: 'view: missing document ID', timestamp: new Date() }
      ]);
      return;
    }
    
    const id = parseInt(idString);
    if (isNaN(id)) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `view: invalid document ID: ${idString}`, timestamp: new Date() }
      ]);
      return;
    }
    
    const document = documents.find(doc => doc.id === id);
    if (document) {
      setEntries(prev => [
        ...prev,
        { type: 'success', content: `Document #${id}: ${document.title}`, timestamp: new Date() },
        { type: 'output', content: `Type: ${document.type}`, timestamp: new Date() },
        { type: 'output', content: `Year: ${document.year}`, timestamp: new Date() },
        { type: 'output', content: `Localities: Norfolk, Virginia Beach`, timestamp: new Date() },
        { type: 'output', content: `Authors: J. Smith, A. Johnson`, timestamp: new Date() },
        { type: 'output', content: `Abstract: This document examines the impact of coastal development...`, timestamp: new Date() }
      ]);
    } else {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `Document not found with ID: ${id}`, timestamp: new Date() }
      ]);
    }
  };

  const handleMapCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: 'map: missing argument', timestamp: new Date() }
      ]);
      return;
    }
    
    const subCommand = args[0];
    
    if (subCommand === 'show-docs') {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Showing documents on map view...', timestamp: new Date() },
        { type: 'success', content: 'Map view activated with document overlay.', timestamp: new Date() }
      ]);
    } else if (subCommand === 'focus') {
      const locality = args[1];
      if (!locality) {
        setEntries(prev => [
          ...prev,
          { type: 'error', content: 'map focus: missing locality name', timestamp: new Date() }
        ]);
        return;
      }
      
      setEntries(prev => [
        ...prev,
        { type: 'info', content: `Focusing map on locality: ${locality}`, timestamp: new Date() },
        { type: 'success', content: `Map centered on ${locality}.`, timestamp: new Date() }
      ]);
    } else {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `Unknown map subcommand: ${subCommand}`, timestamp: new Date() }
      ]);
    }
  };

  const handleGraphCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: 'graph: missing argument', timestamp: new Date() }
      ]);
      return;
    }
    
    const subCommand = args[0];
    
    if (subCommand === 'add') {
      const id = args[1];
      if (!id) {
        setEntries(prev => [
          ...prev,
          { type: 'error', content: 'graph add: missing document ID', timestamp: new Date() }
        ]);
        return;
      }
      
      setEntries(prev => [
        ...prev,
        { type: 'info', content: `Adding document #${id} to knowledge graph...`, timestamp: new Date() },
        { type: 'success', content: `Document #${id} added to graph.`, timestamp: new Date() }
      ]);
    } else if (subCommand === 'view') {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Activating knowledge graph view...', timestamp: new Date() },
        { type: 'success', content: 'Graph view activated.', timestamp: new Date() }
      ]);
    } else {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `Unknown graph subcommand: ${subCommand}`, timestamp: new Date() }
      ]);
    }
  };

  const switchMode = (mode: 'shell' | 'agent' | 'explorer') => {
    setTerminalMode(mode);
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Switched to ${mode} mode.`, timestamp: new Date() }
    ]);
  };

  return (
    <div className="flex flex-col h-full" ref={terminalRef}>
      {/* Terminal Header with Mode Selector */}
      <div className="flex justify-between items-center bg-black text-green-500 border-b border-green-900 pb-1 mb-1">
        <div className="flex space-x-2">
          <button 
            className={`px-2 py-1 text-xs rounded ${terminalMode === 'shell' ? 'bg-green-900 text-black' : ''}`} 
            onClick={() => switchMode('shell')}
          >
            <TerminalIcon size={12} className="inline mr-1" />
            Shell
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded ${terminalMode === 'agent' ? 'bg-green-900 text-black' : ''}`}
            onClick={() => switchMode('agent')}
          >
            <MessageSquare size={12} className="inline mr-1" />
            Agent
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded ${terminalMode === 'explorer' ? 'bg-green-900 text-black' : ''}`}
            onClick={() => switchMode('explorer')}
          >
            <FolderOpen size={12} className="inline mr-1" />
            Explorer
          </button>
        </div>
        
        <div className="text-xs">
          <span className="opacity-70">Hampton Roads Terminal v1.0.0</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-auto p-1 bg-black text-green-500 text-xs" onClick={focusInput}>
        {entries.map((entry, index) => (
          <div key={index} className={`mb-1 ${entry.type === 'command' ? 'text-cyan-400' : entry.type === 'error' ? 'text-red-400' : entry.type === 'info' ? 'text-yellow-400' : entry.type === 'success' ? 'text-green-400' : ''}`}>
            {entry.type === 'command' && <span className="text-green-300">$ </span>}
            {entry.content}
          </div>
        ))}
      </div>
      
      {/* Terminal Input */}
      <div className="flex items-center mt-1 bg-black text-green-500 border-t border-green-900 pt-1">
        <span className="text-green-300 mr-1">{currentPath}$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent outline-none text-green-500 text-xs"
          autoFocus
        />
      </div>
    </div>
  );
};

export default function TerminalInterface() {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(true);
  const [fileTree, setFileTree] = useState<FileTreeItem[]>(researchFileTree);
  const [openTabs, setOpenTabs] = useState<{id: string; name: string; path: string}[]>([]);
  const [activeTabId, setActiveTabId] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(null);
  
  // System data
  const systemData = {
    hostname: 'hampton-research',
    ipAddress: '96.22.220.83',
    uptime: '2d 7:45:24',
    cpuUsage: 18,
    memoryUsage: 32,
  };
  
  // Handle file selection
  const handleFileSelect = (file: FileTreeItem) => {
    setSelectedFile(file);
    
    // Check if tab is already open
    const existingTab = openTabs.find(tab => tab.path === file.path);
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      // Add new tab
      const newTab = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        path: file.path
      };
      setOpenTabs([...openTabs, newTab]);
      setActiveTabId(newTab.id);
    }
  };
  
  // Handle folder toggle
  const handleToggleFolder = (folder: FileTreeItem) => {
    const updateFolderExpanded = (items: FileTreeItem[]): FileTreeItem[] => {
      return items.map(item => {
        if (item.path === folder.path) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: updateFolderExpanded(item.children) };
        }
        return item;
      });
    };
    
    setFileTree(updateFolderExpanded(fileTree));
  };
  
  // Handle tab close
  const handleCloseTab = (tabId: string) => {
    const newOpenTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newOpenTabs);
    
    // If we're closing the active tab, activate another tab if available
    if (tabId === activeTabId && newOpenTabs.length > 0) {
      setActiveTabId(newOpenTabs[0].id);
    } else if (newOpenTabs.length === 0) {
      setSelectedFile(null);
    }
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <div className="h-full flex flex-col bg-black text-green-500 font-mono border border-green-900 rounded">
      {/* Top Toolbar */}
      <div className="flex items-center p-1 border-b border-green-900">
        <button 
          className="p-1 hover:bg-green-900 hover:bg-opacity-20 rounded"
          onClick={toggleSidebar}
          title="Toggle Explorer"
        >
          <FolderOpen size={14} />
        </button>
        <div className="ml-2 text-xs">Hampton Roads Research Platform</div>
      </div>
      
      {/* Main VS Code-like layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer Sidebar */}
        {showSidebar && (
          <div className="w-48 border-r border-green-900 flex flex-col">
            <div className="border-b border-green-900 p-1 font-bold text-xs">
              EXPLORER
            </div>
            <FileExplorer 
              files={fileTree} 
              onFileSelect={handleFileSelect}
              onToggleFolder={handleToggleFolder}
            />
          </div>
        )}
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="flex border-b border-green-900 overflow-x-auto">
            {openTabs.length > 0 ? (
              openTabs.map(tab => (
                <EditorTab 
                  key={tab.id}
                  fileName={tab.name}
                  isActive={tab.id === activeTabId}
                  onSelect={() => setActiveTabId(tab.id)}
                  onClose={() => handleCloseTab(tab.id)}
                />
              ))
            ) : (
              <div className="p-2 text-xs opacity-70">No files open</div>
            )}
          </div>
          
          {/* Document Content or Welcome Screen */}
          <div className="flex-1 overflow-hidden">
            {selectedFile && openTabs.length > 0 ? (
              <DocumentContent 
                filePath={openTabs.find(tab => tab.id === activeTabId)?.path || ''} 
              />
            ) : (
              <div className="h-full flex items-center justify-center text-center p-4">
                <div>
                  <div className="text-xl mb-4">Hampton Roads Research Platform</div>
                  <div className="text-sm mb-6">
                    Select a file from the explorer to begin working, or use the terminal below.
                  </div>
                  <div className="text-xs opacity-70">
                    Version 1.0.0
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Terminal Panel */}
          <div className="h-1/3 border-t border-green-900">
            <TerminalContentFull />
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="border-t border-green-900 p-1 text-xs flex justify-between">
        <div>terminal: hampton-research</div>
        <div className="flex items-center gap-4">
          <span>{new Date().toLocaleDateString()}</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}