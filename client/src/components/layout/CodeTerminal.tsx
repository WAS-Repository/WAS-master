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
type TerminalMode = 'shell' | 'agent';

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

interface CodeTerminalProps {
  onOpenVisualization?: (type: string) => void;
}

const CodeTerminal: React.FC<CodeTerminalProps> = ({ onOpenVisualization }) => {
  const { theme, setTheme } = useTheme();
  
  // File explorer state
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(fileSystemData);
  const [openFiles, setOpenFiles] = useState<{path: string, name: string}[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  
  // Enhanced search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState({
    documentType: '',
    location: '',
    year: '',
    topic: ''
  });
  
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
    
    if (mode === 'agent') {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'AI Agent mode activated - Microsoft Phi-3 model loading...', timestamp: new Date() },
        { type: 'success', content: 'Available commands:', timestamp: new Date() },
        { type: 'info', content: '• create-viz [topic] - Generate data visualization', timestamp: new Date() },
        { type: 'info', content: '• story-dashboard [topic] - Create narrative dashboard', timestamp: new Date() },
        { type: 'info', content: '• analyze [query] - Analyze documents and data', timestamp: new Date() },
        { type: 'info', content: '• search [locality] - Find relevant research documents', timestamp: new Date() },
        { type: 'info', content: '• source-data [locality/topic] - Find and integrate datasets', timestamp: new Date() },
        { type: 'info', content: 'Example: create-viz coastal erosion Virginia Beach', timestamp: new Date() }
      ]);
    }
  };

  // Data sourcing command handlers
  const handleSourceNOAA = async (locality: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `🌊 Sourcing NOAA data for ${locality}...`, timestamp: new Date() },
      { type: 'info', content: '📡 Connecting to NOAA Climate Data API...', timestamp: new Date() }
    ]);

    setTimeout(() => {
      setEntries(prev => [
        ...prev,
        { type: 'success', content: '📊 NOAA datasets discovered:', timestamp: new Date() },
        { type: 'output', content: '• Sea Level Trends (1970-2023): +3.2mm/year', timestamp: new Date() },
        { type: 'output', content: '• Storm Events Database: 234 recorded events', timestamp: new Date() },
        { type: 'output', content: '• Tide Gauge Data: Real-time + 50yr historical', timestamp: new Date() },
        { type: 'output', content: '• Hurricane Track Database: 67 affecting region', timestamp: new Date() },
        { type: 'output', content: '• Water Temperature Trends: +0.8°C since 1990', timestamp: new Date() },
        { type: 'success', content: '💾 Data integrated into research database', timestamp: new Date() }
      ]);
    }, 2000);
  };

  const handleSourceUSGS = async (locality: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `🏔️ Sourcing USGS data for ${locality}...`, timestamp: new Date() },
      { type: 'info', content: '🔍 Accessing USGS Water & Geological APIs...', timestamp: new Date() }
    ]);

    setTimeout(() => {
      setEntries(prev => [
        ...prev,
        { type: 'success', content: '📈 USGS datasets discovered:', timestamp: new Date() },
        { type: 'output', content: '• Groundwater Levels: 12 monitoring wells', timestamp: new Date() },
        { type: 'output', content: '• Stream Flow Data: 8 gauge stations', timestamp: new Date() },
        { type: 'output', content: '• Land Subsidence: 2.1mm/year average', timestamp: new Date() },
        { type: 'output', content: '• Earthquake Activity: 15 events (2010-2023)', timestamp: new Date() },
        { type: 'output', content: '• Coastal Change: Shoreline position data', timestamp: new Date() },
        { type: 'success', content: '💾 Geological data integrated successfully', timestamp: new Date() }
      ]);
    }, 2500);
  };

  const handleSourceCensus = async (locality: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `📊 Sourcing Census data for ${locality}...`, timestamp: new Date() },
      { type: 'info', content: '🏘️ Accessing Census Bureau APIs...', timestamp: new Date() }
    ]);

    setTimeout(() => {
      setEntries(prev => [
        ...prev,
        { type: 'success', content: '👥 Census datasets discovered:', timestamp: new Date() },
        { type: 'output', content: '• Population: 245,428 (2020 Census)', timestamp: new Date() },
        { type: 'output', content: '• Housing Units: 112,367 total units', timestamp: new Date() },
        { type: 'output', content: '• Median Income: $67,890 (2021 ACS)', timestamp: new Date() },
        { type: 'output', content: '• Coastal Properties: 23,456 within 1km of shore', timestamp: new Date() },
        { type: 'output', content: '• Age Demographics: 67% adults, 22% seniors', timestamp: new Date() },
        { type: 'success', content: '💾 Demographic data integrated', timestamp: new Date() }
      ]);
    }, 1800);
  };

  const handleAutoDiscover = async (topic: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `🤖 AI discovering datasets for "${topic}"...`, timestamp: new Date() },
      { type: 'info', content: '🔍 Scanning 40+ data sources and APIs...', timestamp: new Date() }
    ]);

    setTimeout(() => {
      setEntries(prev => [
        ...prev,
        { type: 'success', content: '🎯 Relevant datasets discovered:', timestamp: new Date() },
        { type: 'output', content: '• EPA Air Quality Index: Hampton Roads region', timestamp: new Date() },
        { type: 'output', content: '• VIMS Shoreline Studies: 25-year dataset', timestamp: new Date() },
        { type: 'output', content: '• NASA Satellite Imagery: Land use change', timestamp: new Date() },
        { type: 'output', content: '• HRPDC Transportation Data: Traffic patterns', timestamp: new Date() },
        { type: 'output', content: '• Local Tourism Board: Economic impact data', timestamp: new Date() },
        { type: 'success', content: '✨ Multi-source integration complete', timestamp: new Date() }
      ]);
    }, 3000);
  };

  const handleCreateStory = async (topic: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `📖 Creating data-driven story for "${topic}"...`, timestamp: new Date() },
      { type: 'info', content: '🧠 AI analyzing integrated datasets...', timestamp: new Date() },
      { type: 'info', content: '📊 Generating narrative with visualizations...', timestamp: new Date() }
    ]);

    setTimeout(() => {
      setEntries(prev => [
        ...prev,
        { type: 'success', content: '📚 Data story created: "Hampton Roads Resilience"', timestamp: new Date() },
        { type: 'output', content: '• Chapter 1: Climate trends from NOAA data', timestamp: new Date() },
        { type: 'output', content: '• Chapter 2: Infrastructure stress (USGS + local)', timestamp: new Date() },
        { type: 'output', content: '• Chapter 3: Community impact (Census + surveys)', timestamp: new Date() },
        { type: 'output', content: '• Chapter 4: Adaptation strategies (multi-source)', timestamp: new Date() },
        { type: 'success', content: '🎬 Interactive story dashboard opening...', timestamp: new Date() }
      ]);
      
      // Auto-open relevant visualizations for the story
      if (onOpenVisualization) {
        setTimeout(() => onOpenVisualization('timeline'), 500);
        setTimeout(() => onOpenVisualization('map'), 1000);
      }
    }, 4000);
  };

  // File tree structure for Ubuntu-style explorer
  const fileTreeData = {
    name: 'Hampton Roads Research',
    type: 'folder' as const,
    expanded: true,
    children: [
      {
        name: 'Documents',
        type: 'folder' as const,
        expanded: true,
        children: [
          {
            name: 'Research Reports',
            type: 'folder' as const,
            expanded: false,
            children: [
              {
                name: 'Coastal Erosion Impact Study.pdf',
                type: 'file' as const,
                path: '/documents/research/coastal-erosion.pdf',
                icon: '📄',
                metadata: { location: 'virginia-beach', year: '2023', topic: 'erosion' }
              },
              {
                name: 'Tidal Pattern Analysis Report.pdf',
                type: 'file' as const,
                path: '/documents/research/tidal-patterns.pdf',
                icon: '📄',
                metadata: { location: 'norfolk', year: '2023', topic: 'flooding' }
              }
            ]
          },
          {
            name: 'Technical Reports',
            type: 'folder' as const,
            expanded: false,
            children: [
              {
                name: 'Storm Water Management Implementation.pdf',
                type: 'file' as const,
                path: '/documents/technical/storm-water.pdf',
                icon: '📋',
                metadata: { location: 'norfolk', year: '2023', topic: 'storm-water' }
              }
            ]
          }
        ]
      },
      {
        name: 'Maps',
        type: 'folder' as const,
        expanded: false,
        children: [
          {
            name: 'Norfolk Flood Risk Assessment.map',
            type: 'file' as const,
            path: '/maps/norfolk-flood.map',
            icon: '🗺️',
            metadata: { location: 'norfolk', year: '2023', topic: 'flooding' }
          }
        ]
      },
      {
        name: 'Datasets',
        type: 'folder' as const,
        expanded: false,
        children: [
          {
            name: 'NOAA',
            type: 'folder' as const,
            expanded: false,
            children: [
              {
                name: 'sea-level-trends.csv',
                type: 'file' as const,
                path: '/datasets/noaa/sea-level.csv',
                icon: '📊',
                metadata: { location: 'norfolk', year: '2023', topic: 'climate' }
              }
            ]
          },
          {
            name: 'USGS',
            type: 'folder' as const,
            expanded: false,
            children: [
              {
                name: 'coastal-change-database.geojson',
                type: 'file' as const,
                path: '/datasets/usgs/coastal-change.geojson',
                icon: '🌍',
                metadata: { location: 'virginia-beach', year: '2023', topic: 'erosion' }
              }
            ]
          },
          {
            name: 'Census',
            type: 'folder' as const,
            expanded: false,
            children: [
              {
                name: 'demographics-hampton-roads.json',
                type: 'file' as const,
                path: '/datasets/census/demographics.json',
                icon: '👥',
                metadata: { location: 'norfolk', year: '2020', topic: 'demographics' }
              }
            ]
          }
        ]
      }
    ]
  };

  // NLP-powered search suggestions
  const getNLPSuggestions = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    const suggestions: string[] = [];
    
    // Semantic search based on common research terms
    if (lowerQuery.includes('flood') || lowerQuery.includes('water')) {
      suggestions.push('flooding and tidal patterns', 'storm water management', 'flood risk assessment');
    }
    if (lowerQuery.includes('coast') || lowerQuery.includes('erosion')) {
      suggestions.push('coastal erosion impacts', 'shoreline protection', 'sea level rise');
    }
    if (lowerQuery.includes('norfolk') || lowerQuery.includes('virginia')) {
      suggestions.push('Norfolk infrastructure', 'Virginia Beach coastline', 'Hampton Roads region');
    }
    if (lowerQuery.includes('storm') || lowerQuery.includes('surge')) {
      suggestions.push('storm water systems', 'storm surge protection', 'infrastructure resilience');
    }
    if (lowerQuery.includes('infra') || lowerQuery.includes('manage')) {
      suggestions.push('infrastructure adaptation', 'management strategies', 'green infrastructure');
    }
    
    return suggestions.slice(0, 4); // Limit to 4 suggestions
  };

  // State for file tree expansion
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Hampton Roads Research', 'Documents']));

  // Toggle folder expansion
  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  // Helper to open a file in the editor
  const openFile = (file: any) => {
    const newFile = { name: file.name, path: file.path };
    if (!openFiles.find(f => f.path === file.path)) {
      setOpenFiles(prev => [...prev, newFile]);
    }
    setActiveFile(file.path);
  };

  // Render Ubuntu-style file tree recursively
  const renderFileTree = (node: any, depth: number = 0, parentPath: string = ''): JSX.Element => {
    const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(fullPath);
    
    if (node.type === 'folder') {
      return (
        <div key={fullPath}>
          <div 
            className="flex items-center py-1 px-2 hover:bg-[#37373d] cursor-pointer text-xs text-white transition-colors"
            style={{ paddingLeft: `${8 + depth * 16}px` }}
            onClick={() => toggleFolder(fullPath)}
          >
            <span className="mr-2 text-orange-400">
              {isExpanded ? '📂' : '📁'}
            </span>
            <span className="flex-1 font-medium">{node.name}</span>
            <span className="text-gray-500 text-[10px] ml-2">
              {isExpanded ? '▼' : '▶'}
            </span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map((child: any) => renderFileTree(child, depth + 1, fullPath))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div 
          key={fullPath}
          className="flex items-center py-1 px-2 hover:bg-[#37373d] cursor-pointer text-xs text-white group transition-colors"
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => openFile(node)}
        >
          <span className="mr-2 text-blue-400">{node.icon}</span>
          <span className="flex-1 truncate">{node.name}</span>
          {node.metadata && (
            <span className="text-gray-500 text-[10px] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {node.metadata.year}
            </span>
          )}
        </div>
      );
    }
  };
  
  // Enhanced document content in markdown format for better editing
  const getFileContent = (path: string) => {
    if (path === '/documents/coastal-erosion.pdf') {
      return `# Coastal Erosion Impact Study
*Published: August 15, 2023 | Virginia Institute of Marine Science*

## Executive Summary
This comprehensive study examines accelerating coastal erosion rates across Hampton Roads, documenting critical infrastructure threats and providing evidence-based adaptation strategies for regional resilience planning.

## Key Findings

### Erosion Rate Analysis
- **Virginia Beach**: 3-5 feet annually (2020-2023)
- **Norfolk Shoreline**: 2-3 feet annually
- **Chesapeake Bay**: 1-2 feet annually
- **Overall regional increase**: 32% since 2010

### Economic Impact Assessment
\`\`\`
Annual property damage: $45M
Infrastructure repair costs: $23M
Tourism revenue loss: $12M
Total economic impact: $80M annually
\`\`\`

### Environmental Changes
- Natural barrier reduction: 18% since 2010
- Wetland habitat loss: 2,340 acres
- Storm surge penetration: +15% inland reach

## Methodology
Our research employed multiple data collection approaches:

1. **LiDAR Coastal Mapping** (2019-2023)
2. **Satellite Imagery Analysis** (Landsat & Sentinel)
3. **Field Monitoring Stations** (24 active sites)
4. **Historical Records Review** (1970-present)

## Geographic Risk Assessment

| Location | Risk Level | Annual Loss Rate | Priority |
|----------|------------|------------------|----------|
| Virginia Beach Oceanfront | High | 4.2 ft/year | Critical |
| Norfolk Naval Station | Moderate | 2.8 ft/year | High |
| Portsmouth Waterfront | Moderate | 2.1 ft/year | Medium |
| Chesapeake Bay Shore | Low-Moderate | 1.3 ft/year | Medium |

## Adaptation Recommendations

### Immediate Actions (0-2 years)
1. **Enhanced Shoreline Protection**
   - Living shoreline installations
   - Dune restoration programs
   - Breakwater construction

2. **Policy Updates**
   - Coastal setback revisions
   - Building code modifications
   - Flood insurance requirements

### Long-term Strategy (3-10 years)
1. **Regional Coastal Management Plan**
   - Inter-jurisdictional coordination
   - Funding mechanism establishment
   - Performance monitoring system

2. **Infrastructure Adaptation**
   - Critical facility relocation
   - Transportation corridor protection
   - Utility system hardening

## Data Sources & Validation
- NOAA Coastal Change Analysis Program
- USGS Coastal and Marine Geology Program
- Virginia Department of Environmental Quality
- Hampton Roads Planning District Commission

---
*Document format: Editable Markdown | Last updated: ${new Date().toLocaleDateString()}*`;

    } else if (path === '/documents/tidal-patterns.pdf') {
      return `# Tidal Pattern Analysis Report
*Published: July 20, 2023 | NOAA Chesapeake Bay Office*

## Overview
Comprehensive analysis of tidal variations impacting Hampton Roads infrastructure and navigation over the past decade, revealing significant pattern shifts with implications for flood management.

## Data Collection Network

### Primary Monitoring Stations
- **Norfolk**: NOAA Station 8638610
- **Virginia Beach**: NOAA Station 8638863  
- **Portsmouth**: Municipal Station PR-001
- **Chesapeake**: Municipal Station CH-003

### Data Quality Metrics
\`\`\`
Total observations: 847,320
Data completeness: 97.3%
Temporal resolution: 6-minute intervals
Quality assurance: Automated + manual review
\`\`\`

## Tidal Pattern Changes

### High Tide Trends (2010-2023)
- Average increase: **2.3 inches**
- Nuisance flooding events: **+45% frequency**
- Storm-enhanced tides: **+67% correlation**
- Peak seasonal impact: **October-March**

### Mean Sea Level Variations
| Station | 2010 Baseline | 2023 Current | Change |
|---------|---------------|--------------|--------|
| Norfolk | 0.47 ft MLLW | 0.66 ft MLLW | +0.19 ft |
| Va Beach | 0.52 ft MLLW | 0.73 ft MLLW | +0.21 ft |
| Portsmouth | 0.44 ft MLLW | 0.61 ft MLLW | +0.17 ft |

## Infrastructure Impact Analysis

### Norfolk Naval Station
- Operational disruptions: **23% increase**
- Pier accessibility: **Modified operating procedures**
- Emergency response: **Enhanced protocols implemented**

### Virginia Beach Oceanfront
- Boardwalk flooding: **12 events annually** (vs 4 historic)
- Business impacts: **$2.3M revenue loss estimates**
- Public safety: **Enhanced warning systems**

### Regional Transportation
- Route 460 flooding: **67% increase in incidents**
- Downtown Tunnel approaches: **Enhanced monitoring**
- Airport runway drainage: **Capacity upgrades needed**

## Predictive Modeling

### 2030 Projections
Based on current acceleration rates:
\`\`\`python
# Conservative estimates
High tide increase: +1.8 to 2.4 inches
Flood frequency: 200-300% above baseline
Storm surge enhancement: 8-12% amplification
\`\`\`

### Model Confidence
- **Statistical confidence**: 85%
- **Scenario range**: Best/worst case bounds
- **Update frequency**: Annual recalibration

## Adaptation Strategies

### Engineering Solutions
1. **Automated Tide Gates**
   - Real-time operation capability
   - Storm surge protection
   - Navigation compatibility

2. **Enhanced Drainage Systems**
   - Pump station upgrades
   - Stormwater capacity expansion
   - Green infrastructure integration

### Early Warning Enhancements
1. **Predictive Systems**
   - 72-hour flood forecasting
   - Mobile alert integration
   - Public information portals

2. **Monitoring Expansion**
   - Additional gauge installations
   - Real-time data sharing
   - Emergency response integration

---
*Technical data available for download | Contact: tide.analysis@noaa.gov*`;

    } else if (path === '/documents/storm-water.pdf') {
      return `# Storm Water Management Implementation
*Published: September 10, 2023 | Norfolk Public Works Department*

## Project Summary
Documentation of green infrastructure pilot program results across Norfolk's coastal zones, demonstrating 40% reduction in flooding incidents through innovative stormwater management solutions.

## Green Infrastructure Solutions

### Implemented Systems

#### 1. Permeable Pavement Network
\`\`\`
Total area: 45,000 sq ft
Installation sites: 12 locations
Infiltration rate: 8.5 inches/hour
Material type: Pervious concrete + porous asphalt
\`\`\`

**Performance Results:**
- Surface runoff reduction: **35%**
- Groundwater recharge: **+28%**
- Urban heat reduction: **3-5°F**

#### 2. Bioretention Areas
- **Total capacity**: 2.3M gallons stormwater storage
- **Plant species**: 23 native varieties selected
- **Pollutant removal**: 67% average efficiency
- **Maintenance frequency**: Monthly inspection, quarterly cleaning

#### 3. Constructed Wetlands
- **Coverage area**: 78 acres across 6 sites  
- **Treatment capacity**: 12M gallons/day
- **Wildlife enhancement**: 34 species documented
- **Water quality improvement**: 73% pollutant reduction

## Performance Metrics by Zone

### Downtown Norfolk District
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Annual flood events | 23 | 14 | 39% reduction |
| Property damage claims | $890K | $285K | 68% reduction |
| Emergency responses | 67 | 41 | 39% reduction |
| Water quality index | 3.2/10 | 7.8/10 | 144% improvement |

### Ocean View Neighborhood  
- **Drainage capacity**: 40% improvement
- **Property values**: 12% average increase
- **Community satisfaction**: 89% approval rating
- **Maintenance costs**: 15% below traditional systems

## Economic Analysis

### Investment Summary
\`\`\`
Phase 1 Implementation: $23.4M
  - Federal grants: $10.5M (45%)
  - State funding: $7.0M (30%) 
  - Municipal bonds: $5.9M (25%)

Annual Operations: $890K
  - Maintenance: $650K
  - Monitoring: $140K
  - Administration: $100K
\`\`\`

### Return on Investment
- **Property damage avoided**: $12.2M annually
- **Insurance savings**: $3.1M annually  
- **ROI period**: 4.2 years
- **20-year NPV**: $187M positive

## Regional Expansion Plan

### Phase 2: Portsmouth Waterfront (2024-2025)
- **Investment**: $31.2M
- **Timeline**: 18 months
- **Expected impact**: 45% flood reduction

### Phase 3: Virginia Beach Resort Area (2025-2026)  
- **Investment**: $42.8M
- **Timeline**: 24 months
- **Tourism protection**: $89M annually

### Phase 4: Chesapeake Industrial Zones (2026-2028)
- **Investment**: $28.5M  
- **Timeline**: 30 months
- **Business continuity**: Enhanced resilience

## Technical Specifications

### Design Standards
- **Storm capacity**: 25-year flood event protection
- **Overflow systems**: Emergency bypass channels
- **Material standards**: AASHTO/EPA compliance
- **Monitoring systems**: IoT sensor networks

### Maintenance Protocols
1. **Monthly Inspections**
   - Visual condition assessment
   - Debris removal
   - Plant health evaluation

2. **Quarterly Maintenance**  
   - Sediment removal
   - Equipment calibration
   - Performance testing

3. **Annual Reviews**
   - System performance analysis
   - Cost-benefit assessment
   - Expansion planning

---
*Engineering drawings and specifications available in project database*`;

    } else if (path === '/maps/norfolk-flood.map') {
      return `# Norfolk Flood Risk Assessment Map
*Updated: November 2023 | FEMA + Local Data Integration*

## Map Overview
Interactive flood risk visualization combining FEMA flood insurance rate maps with real-time monitoring data and predictive modeling results for comprehensive risk assessment.

## Risk Zone Classifications

### High Risk Areas (Red) - Annual Probability >20%
\`\`\`
- Ghent District: 890 properties
- Ocean View: 1,240 properties  
- Downtown Waterfront: 340 commercial structures
- Norfolk Naval Station: Critical infrastructure
\`\`\`

### Moderate Risk Areas (Orange) - Annual Probability 5-20%
\`\`\`
- Colonial Place: 650 properties
- Larchmont: 420 properties
- Willoughby: 780 properties
- Norfolk Botanical Garden: Environmental concern
\`\`\`

### Low Risk Areas (Yellow) - Annual Probability <5%
\`\`\`
- Suburban areas: 12,400+ properties
- Elevated developments: Generally protected
- Industrial zones: Varies by specific location
\`\`\`

## Critical Infrastructure Assessment

### Transportation Network
- **I-64 corridor**: Moderate risk, enhanced drainage needed
- **Norfolk Southern rail**: High risk sections identified
- **Norfolk International Airport**: Low-moderate risk
- **Downtown Tunnel**: Enhanced monitoring systems

### Utilities & Services
- **Power substations**: 3 high-risk, 7 moderate-risk facilities
- **Water treatment**: Primary plant protected, 2 pump stations at risk
- **Emergency services**: Station relocations recommended
- **Hospital systems**: EVMS area enhanced protection needed

## Historical Flood Events

### Recent Significant Events
| Date | Storm Type | Max Surge | Properties Affected |
|------|------------|-----------|-------------------|
| Sept 2019 | Hurricane Dorian | 4.2 ft | 2,340 |
| Oct 2021 | Nor'easter | 3.8 ft | 1,890 |
| Aug 2022 | Thunderstorm Complex | 2.9 ft | 1,120 |
| Jan 2023 | King Tide + Storm | 3.1 ft | 1,450 |

## Flood Protection Measures

### Existing Infrastructure
- **Sea wall systems**: 12.3 miles of protection
- **Tide gates**: 8 automated structures
- **Pump stations**: 15 active facilities
- **Drainage channels**: 67 miles maintained

### Planned Improvements (2024-2027)
1. **Enhanced Tide Gates**: $45M investment
2. **Pump Station Upgrades**: $23M capacity expansion  
3. **Green Infrastructure**: $67M comprehensive program
4. **Early Warning Systems**: $8M technology upgrade

## Emergency Preparedness

### Evacuation Routes
- **Primary routes**: I-64 West, US-460 West
- **Secondary routes**: Local arterials (condition-dependent)
- **Emergency shelters**: 12 designated facilities
- **Medical facilities**: Special needs accommodation

### Community Resources
- **Flood insurance**: 67% participation rate
- **Emergency alerts**: Text/email notification system
- **Sandbag distribution**: 8 pre-positioned sites
- **Emergency supplies**: Community distribution centers

## Data Sources & Updates
- **FEMA Flood Insurance Rate Maps**: Base flood elevations
- **NOAA Tide Gauges**: Real-time water levels
- **Local monitoring**: 24 municipal stations
- **Weather service**: Predictive storm surge modeling
- **Update frequency**: Continuous data, quarterly map revisions

---
*Interactive version available at: norfolk.gov/flood-maps*`;

    } else {
      return `# ${path.split('/').pop()?.replace(/\.[^/.]+$/, "") || "Research Document"}
*Hampton Roads Research Platform | ${new Date().toLocaleDateString()}*

## Document Information
- **File Path**: \`${path}\`
- **Format**: Markdown (Editable)
- **Status**: Available for collaboration
- **Last Modified**: ${new Date().toLocaleString()}

## Document Features
This document supports:
- ✅ **Real-time editing**
- ✅ **Markdown formatting**  
- ✅ **Collaborative review**
- ✅ **Version control**
- ✅ **Export capabilities**

## Getting Started
1. **Browse documents** using the file explorer
2. **Edit content** directly in this interface
3. **Access visualizations** through the View menu
4. **Run analysis** using the terminal commands

## Research Tools Available
- **Terminal commands**: Data analysis and visualization
- **AI Agent mode**: Intelligent research assistance
- **Visualization suite**: Maps, graphs, and dashboards
- **Search capabilities**: Full-text document search

## Hampton Roads Research Collection
This platform contains comprehensive research documents covering:
- Coastal erosion and sea level rise
- Flood risk assessment and management
- Infrastructure adaptation strategies
- Economic impact analysis
- Environmental monitoring data

---
*Select specific documents from the explorer to access full research content*`;
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
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">File</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">Edit</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">Selection</span>
          
          {/* View Menu with Dropdown */}
          <div className="relative group">
            <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">View</span>
            <div className="absolute top-full left-0 mt-1 w-64 bg-[#252526] border border-[#3e3e3e] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <div className="px-3 py-1 text-gray-400 text-xs font-semibold border-b border-[#3e3e3e]">Data Visualizations</div>
                
                <div 
                  className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                  onClick={() => onOpenVisualization?.('map')}
                >
                  <Map size={14} className="mr-2 text-green-400" />
                  Interactive Map (Leaflet.js)
                </div>
                
                <div 
                  className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                  onClick={() => onOpenVisualization?.('knowledge-graph')}
                >
                  <Search size={14} className="mr-2 text-blue-400" />
                  Knowledge Graph (D3.js)
                </div>
                
                <div 
                  className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                  onClick={() => onOpenVisualization?.('force-directed')}
                >
                  <div className="w-3.5 h-3.5 mr-2 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  Force-Directed Graph
                </div>
                
                <div 
                  className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                  onClick={() => onOpenVisualization?.('hierarchy')}
                >
                  <div className="w-3.5 h-3.5 mr-2 bg-green-500 flex items-center justify-center text-white text-xs font-bold">⟨⟩</div>
                  Hierarchical Tree
                </div>
                
                <div 
                  className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                  onClick={() => onOpenVisualization?.('timeline')}
                >
                  <div className="w-3.5 h-3.5 mr-2 bg-purple-500 flex items-center justify-center text-white text-xs font-bold">⟶</div>
                  Timeline Visualization
                </div>
                
                <div className="border-t border-[#3e3e3e] my-1"></div>
                
                <div 
                  className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                  onClick={() => onOpenVisualization?.('chord')}
                >
                  <div className="w-3.5 h-3.5 mr-2 bg-orange-500 rounded"></div>
                  Chord Diagram
                </div>
                
                <div 
                  className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                  onClick={() => onOpenVisualization?.('sankey')}
                >
                  <div className="w-3.5 h-3.5 mr-2 bg-teal-500 rounded"></div>
                  Sankey Diagram
                </div>
                
                <div 
                  className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                  onClick={() => onOpenVisualization?.('treemap')}
                >
                  <div className="w-3.5 h-3.5 mr-2 bg-pink-500 rounded"></div>
                  Treemap
                </div>
                
                <div 
                  className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                  onClick={() => onOpenVisualization?.('heatmap')}
                >
                  <div className="w-3.5 h-3.5 mr-2 bg-red-500 rounded"></div>
                  Heat Map
                </div>
              </div>
            </div>
          </div>
          
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">Go</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">Terminal</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">Help</span>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Document Explorer */}
        <div className="w-80 bg-[#252526] border-r border-[#3e3e3e] flex flex-col">
          {/* Explorer Header */}
          <div className="px-4 py-2 text-gray-400 font-semibold border-b border-[#3e3e3e] flex items-center justify-between">
            <span className="text-xs">DOCUMENT EXPLORER</span>
            <Search size={12} />
          </div>
          
          {/* Search Section */}
          <div className="p-3 border-b border-[#3e3e3e] space-y-3">
            {/* Basic Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#3e3e3e] text-white text-xs px-3 py-2 rounded border border-[#464647] focus:border-[#007acc] outline-none"
              />
              <Search size={12} className="absolute right-2 top-2 text-gray-400" />
            </div>
            
            {/* Advanced Search Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                File Explorer
              </span>
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="text-xs text-[#007acc] hover:text-[#1177bb] flex items-center"
              >
                Advanced
                <ChevronDown size={10} className={`ml-1 transition-transform ${showAdvancedSearch ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Advanced Search Panel */}
            {showAdvancedSearch && (
              <div className="space-y-2 pt-2 border-t border-[#464647]">
                {/* Document Type Filter */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Document Type</label>
                  <select
                    value={filters.documentType}
                    onChange={(e) => setFilters({...filters, documentType: e.target.value})}
                    className="w-full bg-[#3e3e3e] text-white text-xs px-2 py-1 rounded border border-[#464647]"
                  >
                    <option value="">All Types</option>
                    <option value="research">Research Report</option>
                    <option value="technical">Technical Report</option>
                    <option value="analysis">Analysis</option>
                    <option value="map">Map Data</option>
                  </select>
                </div>
                
                {/* Location Filter */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full bg-[#3e3e3e] text-white text-xs px-2 py-1 rounded border border-[#464647]"
                  >
                    <option value="">All Locations</option>
                    <option value="norfolk">Norfolk</option>
                    <option value="virginia-beach">Virginia Beach</option>
                    <option value="portsmouth">Portsmouth</option>
                    <option value="chesapeake">Chesapeake</option>
                  </select>
                </div>
                
                {/* Date Range */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Publication Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    className="w-full bg-[#3e3e3e] text-white text-xs px-2 py-1 rounded border border-[#464647]"
                  >
                    <option value="">Any Year</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>
                
                {/* Topic Filter */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Research Topic</label>
                  <select
                    value={filters.topic}
                    onChange={(e) => setFilters({...filters, topic: e.target.value})}
                    className="w-full bg-[#3e3e3e] text-white text-xs px-2 py-1 rounded border border-[#464647]"
                  >
                    <option value="">All Topics</option>
                    <option value="erosion">Coastal Erosion</option>
                    <option value="flooding">Flooding</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="storm-water">Storm Water</option>
                    <option value="climate">Climate Change</option>
                  </select>
                </div>
                
                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilters({documentType: '', location: '', year: '', topic: ''});
                    setSearchQuery('');
                  }}
                  className="text-xs text-gray-400 hover:text-white mt-2"
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            {/* NLP Search Suggestions */}
            {searchQuery.length > 3 && (
              <div className="text-xs text-gray-400">
                <div className="font-medium mb-1">Smart suggestions:</div>
                <div className="space-y-1">
                  {getNLPSuggestions(searchQuery).map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => setSearchQuery(suggestion)}
                      className="cursor-pointer hover:text-white px-2 py-1 rounded hover:bg-[#3e3e3e]"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Ubuntu-Style File Tree */}
          <div className="flex-1 overflow-auto bg-[#1e1e1e]">
            {renderFileTree(fileTreeData)}
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