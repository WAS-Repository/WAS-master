import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Terminal,
  Maximize2,
  Search,
  MessageSquare,
  FolderOpen,
  HelpCircle,
  Map,
  Sun,
  Moon,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// File system types
type FileType = 'file' | 'folder';

interface FileSystemItem {
  name: string;
  type: FileType;
  children?: FileSystemItem[];
  expanded?: boolean;
  active?: boolean;
  path: string;
}

// Terminal entry type
type TerminalEntry = {
  type: 'input' | 'output' | 'info' | 'error' | 'success' | 'command';
  content: string;
  timestamp: Date;
};

// Terminal mode type
type TerminalMode = 'shell' | 'agent' | 'explorer';

// Sample file structure for explorer
const fileSystemData: FileSystemItem[] = [
  {
    name: 'DOCUMENTS',
    type: 'folder',
    expanded: true,
    path: '/documents',
    children: [
      { name: 'Coastal Erosion Impact Study.pdf', type: 'file', path: '/documents/coastal-erosion.pdf', active: false },
      { name: 'Tidal Pattern Analysis.pdf', type: 'file', path: '/documents/tidal-patterns.pdf', active: false },
      { name: 'Sea Level Rise Projections.pdf', type: 'file', path: '/documents/sea-level.pdf', active: false }
    ]
  },
  {
    name: 'MAPS',
    type: 'folder',
    expanded: true,
    path: '/maps',
    children: [
      { name: 'Norfolk Flood Zones.map', type: 'file', path: '/maps/norfolk-flood.map', active: false },
      { name: 'Virginia Beach Coastal.map', type: 'file', path: '/maps/virginia-beach.map', active: false },
      { name: 'Hampton Roads Region.map', type: 'file', path: '/maps/hampton-roads.map', active: false }
    ]
  },
  {
    name: 'RESEARCH DATA',
    type: 'folder',
    expanded: false,
    path: '/research-data',
    children: [
      { name: 'Tide Measurements.csv', type: 'file', path: '/research-data/tide-measurements.csv', active: false },
      { name: 'Erosion Rates.csv', type: 'file', path: '/research-data/erosion-rates.csv', active: false },
      { name: 'Impact Analysis.xlsx', type: 'file', path: '/research-data/impact-analysis.xlsx', active: false }
    ]
  }
];

const CodeTerminal: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  // File explorer state
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(fileSystemData);
  const [openFiles, setOpenFiles] = useState<{path: string, name: string}[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  
  // Terminal state
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
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [terminalMode, setTerminalMode] = useState<TerminalMode>('shell');
  
  // References for terminal
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
  
  // Focus the terminal input on render and after clicking
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  // Toggle file system items
  const toggleItem = (path: string[]) => {
    const updateFileSystem = (items: FileSystemItem[], itemPath: string[], depth: number): FileSystemItem[] => {
      return items.map(item => {
        // Current item is target
        if (depth === itemPath.length - 1 && item.name === itemPath[depth]) {
          if (item.type === 'folder') {
            return { ...item, expanded: !item.expanded };
          } else {
            // Add/activate file tab when clicking a file
            const filePath = item.path;
            
            if (!openFiles.some(f => f.path === filePath)) {
              setOpenFiles([...openFiles, { path: filePath, name: item.name }]);
            }
            
            setActiveFile(filePath);
            
            // Mark this file as active, deactivate others
            return { ...item, active: true };
          }
        } 
        // Current item is in the path to target
        else if (depth < itemPath.length && item.name === itemPath[depth] && item.children) {
          return {
            ...item,
            children: updateFileSystem(item.children, itemPath, depth + 1)
          };
        } 
        // Deactivate all other files
        else if (item.type === 'file' && item.active) {
          return { ...item, active: false };
        }
        
        return item;
      });
    };

    setFileSystem(updateFileSystem(fileSystem, path, 0));
  };
  
  // Close a file tab
  const closeFile = (path: string) => {
    setOpenFiles(openFiles.filter(f => f.path !== path));
    
    // If active file is closed, activate the first remaining file
    if (activeFile === path && openFiles.length > 1) {
      const remainingFiles = openFiles.filter(f => f.path !== path);
      setActiveFile(remainingFiles.length > 0 ? remainingFiles[0].path : null);
    } else if (openFiles.length <= 1) {
      setActiveFile(null);
    }
  };
  
  // Terminal commands
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
        case 'search':
          searchDocuments(args.join(' '));
          break;
        case 'view':
          viewDocument(args[0]);
          break;
        case 'mode':
          if (args.length === 0) {
            setEntries(prev => [
              ...prev,
              { type: 'info', content: `Current mode: ${terminalMode}`, timestamp: new Date() }
            ]);
          } else if (['shell', 'agent', 'explorer'].includes(args[0])) {
            switchMode(args[0] as TerminalMode);
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
  
  // Handle keyboard input in terminal
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  
  // Terminal command implementations
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
      { type: 'info', content: '  date              - Show current date and time', timestamp: new Date() },
      { type: 'info', content: '\nResearch commands:', timestamp: new Date() },
      { type: 'info', content: '  search <query>    - Search for documents', timestamp: new Date() },
      { type: 'info', content: '  view <id>         - View document details', timestamp: new Date() },
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
    
    if (currentPath === '/home/user') {
      listing = 'Documents/  Maps/  Data/  Downloads/';
    } else if (currentPath === '/home/user/Documents') {
      listing = 'Research/  Reports/  Policy/';
    } else if (currentPath === '/home/user/Maps') {
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
      setCurrentPath('/home/user');
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
      '/home/user', 
      '/home/user/Documents', 
      '/home/user/Maps', 
      '/home/user/Data',
      '/home/user/Downloads'
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
  
  const switchMode = (mode: TerminalMode) => {
    setTerminalMode(mode);
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Switched to ${mode} mode.`, timestamp: new Date() }
    ]);
  };
  
  // File content for document viewer
  const getFileContent = (path: string) => {
    if (path === '/documents/coastal-erosion.pdf') {
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
    } else if (path === '/maps/norfolk-flood.map') {
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
      return `# File: ${path}

This document is part of the Hampton Roads Research Platform collection.

Select files from the file explorer or use the terminal below to execute research queries.`;
    }
  };
  
  // Render the file explorer recursive component
  const renderFileExplorer = (items: FileSystemItem[], path: string[] = []) => {
    return items.map((item, index) => (
      <div key={index}>
        <div 
          className={`flex items-center py-1 px-2 text-xs hover:bg-slate-700 cursor-pointer ${item.active ? 'bg-slate-700' : ''}`}
          style={{ paddingLeft: `${(path.length) * 12 + 4}px` }}
          onClick={() => toggleItem([...path, item.name])}
        >
          <span className="mr-2">
            {item.type === 'folder' 
              ? (item.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)
              : <FileText size={16} />
            }
          </span>
          <span>{item.name}</span>
        </div>
        
        {item.type === 'folder' && item.expanded && item.children && 
          renderFileExplorer(item.children, [...path, item.name])}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col text-white bg-[#1e1e1e] font-sans overflow-hidden">
      {/* Top Menu Bar */}
      <div className="flex items-center h-7 bg-[#252526] px-2 text-xs">
        <div className="flex items-center space-x-3">
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <span>View</span>
          <span>Go</span>
          <span>Terminal</span>
          <span>Help</span>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-60 bg-[#252526] border-r border-[#3e3e3e] flex flex-col">
          <div className="text-xs px-4 py-2 text-gray-400 font-semibold border-b border-[#3e3e3e]">EXPLORER</div>
          <div className="flex-1 overflow-auto">
            {renderFileExplorer(fileSystem)}
          </div>
        </div>
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="h-9 bg-[#252526] flex border-b border-[#3e3e3e] overflow-auto">
            {openFiles.length > 0 ? (
              openFiles.map((file) => (
                <div 
                  key={file.path}
                  className={`px-3 py-2 text-white text-xs flex items-center border-r border-[#3e3e3e] cursor-pointer ${activeFile === file.path ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}`}
                  onClick={() => setActiveFile(file.path)}
                >
                  <FileText size={14} className="mr-2" />
                  {file.name}
                  <span 
                    className="ml-2 text-gray-400 hover:text-white" 
                    onClick={(e) => { e.stopPropagation(); closeFile(file.path); }}
                  >
                    ×
                  </span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-400 text-xs">No files open</div>
            )}
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 overflow-auto bg-[#1e1e1e]">
            {activeFile ? (
              <div className="flex h-full">
                {/* Line Numbers */}
                <div className="text-gray-500 text-xs text-right pr-2 select-none bg-[#1e1e1e]">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="px-2 leading-6">{i+1}</div>
                  ))}
                </div>
                
                {/* Code Content */}
                <pre className="text-white text-xs leading-6 flex-1 whitespace-pre-wrap p-2">
                  {getFileContent(activeFile)}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <h2 className="text-lg mb-4">Hampton Roads Research Platform</h2>
                  <p className="text-sm text-gray-400 mb-8">
                    Select a file from the explorer or use the terminal below.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Terminal */}
          <div className="h-1/3 border-t border-[#3e3e3e]">
            {/* Terminal Header */}
            <div className="flex justify-between items-center bg-[#252526] px-3 py-1 border-b border-[#3e3e3e]">
              <div className="flex items-center">
                <Terminal size={14} className="mr-2" />
                <span className="text-xs font-semibold">Hampton Roads Terminal</span>
                <span className="text-xs ml-2 text-gray-400">v1.0.0</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 px-2 py-0 rounded-sm text-xs ${terminalMode === 'shell' ? 'bg-[#2d2d2d]' : 'hover:bg-[#2d2d2d]'}`} 
                    onClick={() => switchMode('shell')}
                  >
                    <Terminal size={12} className="mr-1" />
                    Shell
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 px-2 py-0 rounded-sm text-xs ${terminalMode === 'agent' ? 'bg-[#2d2d2d]' : 'hover:bg-[#2d2d2d]'}`}
                    onClick={() => switchMode('agent')}
                  >
                    <MessageSquare size={12} className="mr-1" />
                    Agent
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 px-2 py-0 rounded-sm text-xs ${terminalMode === 'explorer' ? 'bg-[#2d2d2d]' : 'hover:bg-[#2d2d2d]'}`}
                    onClick={() => switchMode('explorer')}
                  >
                    <FolderOpen size={12} className="mr-1" />
                    Explorer
                  </Button>
                </div>
                
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Maximize2 size={12} />
                </Button>
              </div>
            </div>
            
            {/* Terminal Content */}
            <div 
              className="h-[calc(100%-28px)] bg-[#1e1e1e] text-white text-xs p-2 overflow-auto" 
              onClick={focusInput}
              ref={terminalRef}
            >
              {entries.map((entry, index) => (
                <div key={index} className={`
                  ${entry.type === 'error' ? 'text-red-400' : ''} 
                  ${entry.type === 'info' ? 'text-yellow-400' : ''}
                  ${entry.type === 'success' ? 'text-green-400' : ''}
                  ${entry.type === 'command' ? 'text-cyan-400' : ''}
                `}>
                  {entry.type === 'command' && <span className="text-green-500 mr-1">$</span>}
                  {entry.content}
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-green-500 mr-1">{currentPath}$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none border-none text-white"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-5 bg-[#007acc] text-white text-xs flex justify-between items-center px-3">
        <div>terminal: hampton-research</div>
        <div className="flex items-center gap-3">
          <span>Line 1</span>
          <span>UTF-8</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CodeTerminal;