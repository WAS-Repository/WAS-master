import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { 
  FileText, 
  Folder, 
  ChevronDown, 
  ChevronRight, 
  Terminal, 
  Settings,
  Code,
  Command,
  Search,
  HelpCircle,
  FolderOpen,
  MessageSquare, 
  Map,
  Maximize2,
  Sun,
  Moon
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

// File/Directory Type
type FileSystemItem = {
  name: string;
  type: 'file' | 'directory';
  children?: FileSystemItem[];
  expanded?: boolean;
  active?: boolean;
};

// Simulated file structure
const fileSystemData: FileSystemItem[] = [
  {
    name: 'OPEN EDITORS',
    type: 'directory',
    expanded: true,
    children: [
      { name: 'Settings', type: 'file', active: false },
      { name: 'User Settings', type: 'file', active: false },
      { name: 'vCodeOpenFolder.reg', type: 'file', active: true }
    ]
  },
  {
    name: 'WORKSPACE',
    type: 'directory',
    expanded: true,
    children: [
      { name: 'vscode.bat', type: 'file', active: false },
      { name: 'vscode-setup.sh', type: 'file', active: false },
      {
        name: 'HELLO-WORLD-REACT-APP',
        type: 'directory',
        expanded: false,
        children: [
          { name: 'README.md', type: 'file', active: false },
          { name: 'package.json', type: 'file', active: false },
          { name: 'index.js', type: 'file', active: false }
        ]
      }
    ]
  },
  {
    name: 'RECENT PROJECTS',
    type: 'directory',
    expanded: false,
    children: [
      { name: 'coastal-research', type: 'file', active: false },
      { name: 'flood-analysis', type: 'file', active: false },
      { name: 'sea-level-metrics', type: 'file', active: false }
    ]
  }
];

// Terminal entry type, matching Terminal.tsx
type TerminalEntry = {
  type: 'input' | 'output' | 'info' | 'error' | 'success' | 'command';
  content: string;
  timestamp: Date;
};

const VSCodeLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(fileSystemData);
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
    },
    {
      type: 'info',
      content: 'Type \'mode <shell|agent|explorer>\' to switch terminal modes.',
      timestamp: new Date()
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [terminalMode, setTerminalMode] = useState<'shell' | 'agent' | 'explorer'>('shell');

  // Handle file/directory toggle
  const toggleItem = (itemPath: string[], isExpand?: boolean) => {
    const updateFileSystem = (items: FileSystemItem[], path: string[], depth: number): FileSystemItem[] => {
      return items.map(item => {
        if (depth === path.length - 1 && item.name === path[depth]) {
          if (item.type === 'directory') {
            return { 
              ...item, 
              expanded: isExpand !== undefined ? isExpand : !item.expanded 
            };
          } else {
            // Set this file as active and deactivate others
            return { ...item, active: true };
          }
        } else if (depth < path.length && item.name === path[depth] && item.children) {
          return {
            ...item,
            children: updateFileSystem(item.children, path, depth + 1)
          };
        } else if (item.type === 'file') {
          // Deactivate all other files
          return { ...item, active: false };
        }
        return item;
      });
    };

    setFileSystem(updateFileSystem(fileSystem, itemPath, 0));
  };

  // Add refs for terminal input and display
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
  
  // Process terminal command
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
        case 'pandas':
          handlePandasCommand(args);
          break;
        case 'numpy':
          handleNumpyCommand(args);
          break;
        case 'matplotlib':
          handleMatplotlibCommand(args);
          break;
        case 'seaborn':
          handleSeabornCommand(args);
          break;
        case 'sql':
          handleSqlCommand(args);
          break;
        case 'jupyter':
          handleJupyterCommand(args);
          break;
        case 'plotly':
          handlePlotlyCommand(args);
          break;
        case 'scipy':
          handleScipyCommand(args);
          break;
        case 'sklearn':
          handleSklearnCommand(args);
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
      { type: 'info', content: '  echo <message>    - Display a message', timestamp: new Date() },
      { type: 'info', content: '  date              - Show current date and time', timestamp: new Date() },
      { type: 'info', content: '\nResearch commands:', timestamp: new Date() },
      { type: 'info', content: '  search <query>    - Search for documents', timestamp: new Date() },
      { type: 'info', content: '  view <id>         - View document details', timestamp: new Date() },
      { type: 'info', content: '  map show-docs     - Show documents on map', timestamp: new Date() },
      { type: 'info', content: '\nData Science libraries:', timestamp: new Date() },
      { type: 'info', content: '  pandas            - Data manipulation and analysis', timestamp: new Date() },
      { type: 'info', content: '  numpy             - Numerical computing', timestamp: new Date() },
      { type: 'info', content: '  matplotlib        - Plotting and visualization', timestamp: new Date() },
      { type: 'info', content: '  seaborn           - Statistical data visualization', timestamp: new Date() },
      { type: 'info', content: '  sql               - Database queries and operations', timestamp: new Date() },
      { type: 'info', content: '  sklearn           - Machine learning', timestamp: new Date() },
      { type: 'info', content: '  scipy             - Scientific computing', timestamp: new Date() },
      { type: 'info', content: '  plotly            - Interactive visualizations', timestamp: new Date() },
      { type: 'info', content: '  jupyter           - Notebook interface', timestamp: new Date() },
      { type: 'info', content: '\nSystem commands:', timestamp: new Date() },
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
  
  // Data Science Library Handlers
  const handlePandasCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Pandas library loaded. Available commands:', timestamp: new Date() },
        { type: 'info', content: '  pandas read_csv <file>    - Load CSV data', timestamp: new Date() },
        { type: 'info', content: '  pandas describe          - Statistical summary', timestamp: new Date() },
        { type: 'info', content: '  pandas head [n]          - Show first n rows', timestamp: new Date() },
        { type: 'info', content: '  pandas info              - Dataset information', timestamp: new Date() },
        { type: 'info', content: '  pandas query "<sql>"     - Query database', timestamp: new Date() }
      ]);
      return;
    }

    const subCommand = args[0];
    switch(subCommand) {
      case 'read_csv':
        simulateDataLoad('CSV', args[1] || 'coastal_data.csv');
        break;
      case 'describe':
        showDataDescription();
        break;
      case 'head':
        showDataHead(parseInt(args[1]) || 5);
        break;
      case 'info':
        showDataInfo();
        break;
      case 'query':
        executeDataQuery(args.slice(1).join(' '));
        break;
      default:
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `Unknown pandas command: ${subCommand}`, timestamp: new Date() }
        ]);
    }
  };

  const handleNumpyCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'NumPy library loaded. Available commands:', timestamp: new Date() },
        { type: 'info', content: '  numpy array <data>       - Create array', timestamp: new Date() },
        { type: 'info', content: '  numpy stats              - Statistical operations', timestamp: new Date() },
        { type: 'info', content: '  numpy random <type>      - Generate random data', timestamp: new Date() }
      ]);
      return;
    }

    const subCommand = args[0];
    switch(subCommand) {
      case 'array':
        setEntries(prev => [
          ...prev,
          { type: 'success', content: `Array created: [${args.slice(1).join(', ')}]`, timestamp: new Date() },
          { type: 'output', content: `Shape: (${args.length - 1},)`, timestamp: new Date() }
        ]);
        break;
      case 'stats':
        showNumpyStats();
        break;
      case 'random':
        generateRandomData(args[1] || 'normal');
        break;
      default:
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `Unknown numpy command: ${subCommand}`, timestamp: new Date() }
        ]);
    }
  };

  const handleMatplotlibCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Matplotlib library loaded. Available commands:', timestamp: new Date() },
        { type: 'info', content: '  matplotlib plot <type>   - Create plot (line, bar, scatter)', timestamp: new Date() },
        { type: 'info', content: '  matplotlib hist          - Create histogram', timestamp: new Date() },
        { type: 'info', content: '  matplotlib save <name>   - Save current plot', timestamp: new Date() }
      ]);
      return;
    }

    const subCommand = args[0];
    switch(subCommand) {
      case 'plot':
        createVisualization(args[1] || 'line');
        break;
      case 'hist':
        createHistogram();
        break;
      case 'save':
        savePlot(args[1] || 'plot.png');
        break;
      default:
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `Unknown matplotlib command: ${subCommand}`, timestamp: new Date() }
        ]);
    }
  };

  const handleSeabornCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Seaborn library loaded. Available commands:', timestamp: new Date() },
        { type: 'info', content: '  seaborn heatmap          - Create correlation heatmap', timestamp: new Date() },
        { type: 'info', content: '  seaborn pairplot         - Create pairwise plots', timestamp: new Date() },
        { type: 'info', content: '  seaborn distplot         - Distribution plot', timestamp: new Date() }
      ]);
      return;
    }

    const subCommand = args[0];
    switch(subCommand) {
      case 'heatmap':
        createHeatmap();
        break;
      case 'pairplot':
        createPairplot();
        break;
      case 'distplot':
        createDistplot();
        break;
      default:
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `Unknown seaborn command: ${subCommand}`, timestamp: new Date() }
        ]);
    }
  };

  const handleSqlCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'SQL interface active. Available commands:', timestamp: new Date() },
        { type: 'info', content: '  sql connect              - Connect to database', timestamp: new Date() },
        { type: 'info', content: '  sql tables               - List all tables', timestamp: new Date() },
        { type: 'info', content: '  sql execute "<query>"    - Execute SQL query', timestamp: new Date() }
      ]);
      return;
    }

    const subCommand = args[0];
    switch(subCommand) {
      case 'connect':
        connectToDatabase();
        break;
      case 'tables':
        listTables();
        break;
      case 'execute':
        executeSqlQuery(args.slice(1).join(' '));
        break;
      default:
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `Unknown sql command: ${subCommand}`, timestamp: new Date() }
        ]);
    }
  };

  const handleJupyterCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Jupyter interface available. Available commands:', timestamp: new Date() },
        { type: 'info', content: '  jupyter notebook         - Start notebook server', timestamp: new Date() },
        { type: 'info', content: '  jupyter lab              - Start JupyterLab', timestamp: new Date() },
        { type: 'info', content: '  jupyter kernel           - Manage kernels', timestamp: new Date() }
      ]);
      return;
    }

    const subCommand = args[0];
    switch(subCommand) {
      case 'notebook':
        startJupyterNotebook();
        break;
      case 'lab':
        startJupyterLab();
        break;
      case 'kernel':
        manageKernels();
        break;
      default:
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `Unknown jupyter command: ${subCommand}`, timestamp: new Date() }
        ]);
    }
  };

  const handlePlotlyCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Plotly library loaded. Available commands:', timestamp: new Date() },
        { type: 'info', content: '  plotly interactive       - Create interactive plot', timestamp: new Date() },
        { type: 'info', content: '  plotly 3d                - Create 3D visualization', timestamp: new Date() },
        { type: 'info', content: '  plotly dashboard         - Create dashboard', timestamp: new Date() }
      ]);
      return;
    }

    const subCommand = args[0];
    switch(subCommand) {
      case 'interactive':
        createInteractivePlot();
        break;
      case '3d':
        create3DVisualization();
        break;
      case 'dashboard':
        createDashboard();
        break;
      default:
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `Unknown plotly command: ${subCommand}`, timestamp: new Date() }
        ]);
    }
  };

  const handleScipyCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'SciPy library loaded. Available commands:', timestamp: new Date() },
        { type: 'info', content: '  scipy optimize           - Optimization functions', timestamp: new Date() },
        { type: 'info', content: '  scipy stats              - Statistical functions', timestamp: new Date() },
        { type: 'info', content: '  scipy integrate          - Integration functions', timestamp: new Date() }
      ]);
      return;
    }

    const subCommand = args[0];
    switch(subCommand) {
      case 'optimize':
        runOptimization();
        break;
      case 'stats':
        runStatisticalTests();
        break;
      case 'integrate':
        runIntegration();
        break;
      default:
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `Unknown scipy command: ${subCommand}`, timestamp: new Date() }
        ]);
    }
  };

  const handleSklearnCommand = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Scikit-learn library loaded. Available commands:', timestamp: new Date() },
        { type: 'info', content: '  sklearn model <type>     - Create ML model', timestamp: new Date() },
        { type: 'info', content: '  sklearn train            - Train model', timestamp: new Date() },
        { type: 'info', content: '  sklearn predict          - Make predictions', timestamp: new Date() }
      ]);
      return;
    }

    const subCommand = args[0];
    switch(subCommand) {
      case 'model':
        createMLModel(args[1] || 'linear_regression');
        break;
      case 'train':
        trainModel();
        break;
      case 'predict':
        makePredictions();
        break;
      default:
        setEntries(prev => [
          ...prev,
          { type: 'error', content: `Unknown sklearn command: ${subCommand}`, timestamp: new Date() }
        ]);
    }
  };

  // Helper functions for data science operations
  const simulateDataLoad = (type: string, filename: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Loading ${type} file: ${filename}...`, timestamp: new Date() },
      { type: 'success', content: `Data loaded successfully!`, timestamp: new Date() },
      { type: 'output', content: `Shape: (1250, 8) - 1250 rows, 8 columns`, timestamp: new Date() },
      { type: 'output', content: `Columns: [date, location, tide_level, erosion_rate, temperature, salinity, ph, depth]`, timestamp: new Date() }
    ]);
  };

  const showDataDescription = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Statistical Summary:', timestamp: new Date() },
      { type: 'output', content: '              count      mean       std       min       25%       50%       75%       max', timestamp: new Date() },
      { type: 'output', content: 'tide_level    1250.0    2.34      0.89      0.12      1.67      2.31      2.98      4.56', timestamp: new Date() },
      { type: 'output', content: 'erosion_rate  1250.0    0.045     0.023     0.001     0.028     0.043     0.061     0.123', timestamp: new Date() },
      { type: 'output', content: 'temperature   1250.0    18.7      4.2       8.9       15.4      18.8      22.1      28.3', timestamp: new Date() },
      { type: 'output', content: 'salinity      1250.0    34.8      2.1       29.2      33.6      34.9      36.2      39.1', timestamp: new Date() }
    ]);
  };

  const showDataHead = (n: number) => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `First ${n} rows:`, timestamp: new Date() },
      { type: 'output', content: '  date        location       tide_level  erosion_rate  temperature', timestamp: new Date() },
      { type: 'output', content: '0 2023-01-01  Norfolk         2.34        0.045         18.7', timestamp: new Date() },
      { type: 'output', content: '1 2023-01-02  Virginia Beach  2.67        0.052         19.2', timestamp: new Date() },
      { type: 'output', content: '2 2023-01-03  Portsmouth      1.89        0.038         17.8', timestamp: new Date() },
      { type: 'output', content: '3 2023-01-04  Chesapeake      2.12        0.041         18.5', timestamp: new Date() },
      { type: 'output', content: '4 2023-01-05  Hampton         2.78        0.058         20.1', timestamp: new Date() }
    ]);
  };

  const showDataInfo = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Dataset Information:', timestamp: new Date() },
      { type: 'output', content: 'RangeIndex: 1250 entries, 0 to 1249', timestamp: new Date() },
      { type: 'output', content: 'Data columns (total 8 columns):', timestamp: new Date() },
      { type: 'output', content: ' #   Column        Non-Null Count  Dtype  ', timestamp: new Date() },
      { type: 'output', content: '---  ------        --------------  -----  ', timestamp: new Date() },
      { type: 'output', content: ' 0   date          1250 non-null   datetime64[ns]', timestamp: new Date() },
      { type: 'output', content: ' 1   location      1250 non-null   object', timestamp: new Date() },
      { type: 'output', content: ' 2   tide_level    1250 non-null   float64', timestamp: new Date() },
      { type: 'output', content: ' 3   erosion_rate  1250 non-null   float64', timestamp: new Date() },
      { type: 'output', content: 'memory usage: 78.2+ KB', timestamp: new Date() }
    ]);
  };

  const executeDataQuery = (query: string) => {
    if (!query) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: 'No query provided', timestamp: new Date() }
      ]);
      return;
    }

    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Executing query: ${query}`, timestamp: new Date() },
      { type: 'success', content: 'Query executed successfully!', timestamp: new Date() },
      { type: 'output', content: 'Results: 15 matching records found', timestamp: new Date() },
      { type: 'output', content: 'Average erosion rate: 0.067 m/year', timestamp: new Date() },
      { type: 'output', content: 'Max tide level: 4.12 meters', timestamp: new Date() }
    ]);
  };

  const createVisualization = (plotType: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Creating ${plotType} plot...`, timestamp: new Date() },
      { type: 'success', content: `${plotType.charAt(0).toUpperCase() + plotType.slice(1)} plot generated!`, timestamp: new Date() },
      { type: 'output', content: 'Plot saved as: erosion_analysis.png', timestamp: new Date() },
      { type: 'output', content: 'Trend: Erosion rate increases with higher tide levels', timestamp: new Date() }
    ]);
  };

  const createHeatmap = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Generating correlation heatmap...', timestamp: new Date() },
      { type: 'success', content: 'Heatmap created successfully!', timestamp: new Date() },
      { type: 'output', content: 'Strong correlation (0.87) between tide_level and erosion_rate', timestamp: new Date() },
      { type: 'output', content: 'Moderate correlation (0.65) between temperature and salinity', timestamp: new Date() }
    ]);
  };

  const connectToDatabase = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Connecting to Hampton Roads Research Database...', timestamp: new Date() },
      { type: 'success', content: 'Database connection established!', timestamp: new Date() },
      { type: 'output', content: 'Host: research-db.hampton-roads.gov', timestamp: new Date() },
      { type: 'output', content: 'Database: coastal_research', timestamp: new Date() },
      { type: 'output', content: 'Tables available: documents, localities, measurements, predictions', timestamp: new Date() }
    ]);
  };

  const listTables = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Available database tables:', timestamp: new Date() },
      { type: 'output', content: '1. documents         - Research documents and reports', timestamp: new Date() },
      { type: 'output', content: '2. localities        - Geographic regions and boundaries', timestamp: new Date() },
      { type: 'output', content: '3. measurements      - Tide, erosion, and environmental data', timestamp: new Date() },
      { type: 'output', content: '4. predictions       - Climate and sea level projections', timestamp: new Date() },
      { type: 'output', content: '5. document_localities - Document-location relationships', timestamp: new Date() }
    ]);
  };

  const executeSqlQuery = (query: string) => {
    if (!query) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: 'No SQL query provided', timestamp: new Date() }
      ]);
      return;
    }

    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Executing SQL: ${query}`, timestamp: new Date() },
      { type: 'success', content: 'Query executed successfully!', timestamp: new Date() },
      { type: 'output', content: 'Execution time: 0.045 seconds', timestamp: new Date() },
      { type: 'output', content: 'Rows affected: 847', timestamp: new Date() }
    ]);
  };

  const createMLModel = (modelType: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Creating ${modelType} model...`, timestamp: new Date() },
      { type: 'success', content: `${modelType} model initialized!`, timestamp: new Date() },
      { type: 'output', content: 'Features: tide_level, temperature, salinity, depth', timestamp: new Date() },
      { type: 'output', content: 'Target: erosion_rate', timestamp: new Date() },
      { type: 'output', content: 'Model ready for training', timestamp: new Date() }
    ]);
  };

  const trainModel = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Training model on Hampton Roads coastal data...', timestamp: new Date() }
    ]);

    setTimeout(() => {
      setEntries(prev => [
        ...prev,
        { type: 'success', content: 'Model training completed!', timestamp: new Date() },
        { type: 'output', content: 'Training accuracy: 0.892', timestamp: new Date() },
        { type: 'output', content: 'Validation accuracy: 0.874', timestamp: new Date() },
        { type: 'output', content: 'R² score: 0.856', timestamp: new Date() }
      ]);
    }, 2000);
  };

  const makePredictions = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Making erosion rate predictions...', timestamp: new Date() },
      { type: 'success', content: 'Predictions generated!', timestamp: new Date() },
      { type: 'output', content: 'Norfolk (2024): 0.058 m/year erosion rate', timestamp: new Date() },
      { type: 'output', content: 'Virginia Beach (2024): 0.071 m/year erosion rate', timestamp: new Date() },
      { type: 'output', content: 'Portsmouth (2024): 0.043 m/year erosion rate', timestamp: new Date() }
    ]);
  };

  // Additional helper functions for other libraries...
  const showNumpyStats = () => {
    setEntries(prev => [
      ...prev,
      { type: 'output', content: 'Array statistics:', timestamp: new Date() },
      { type: 'output', content: 'Mean: 2.34, Std: 0.89, Min: 0.12, Max: 4.56', timestamp: new Date() }
    ]);
  };

  const generateRandomData = (dataType: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: `Generated ${dataType} random data: [1.23, 2.45, 1.67, 3.21, 0.98]`, timestamp: new Date() }
    ]);
  };

  const createHistogram = () => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: 'Histogram created! Shows normal distribution of tide levels', timestamp: new Date() }
    ]);
  };

  const savePlot = (filename: string) => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: `Plot saved as: ${filename}`, timestamp: new Date() }
    ]);
  };

  const createPairplot = () => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: 'Pairplot created! Shows relationships between all variables', timestamp: new Date() }
    ]);
  };

  const createDistplot = () => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: 'Distribution plot created for erosion rates', timestamp: new Date() }
    ]);
  };

  const startJupyterNotebook = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Starting Jupyter Notebook server...', timestamp: new Date() },
      { type: 'success', content: 'Notebook server running at http://localhost:8888', timestamp: new Date() }
    ]);
  };

  const startJupyterLab = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Starting JupyterLab...', timestamp: new Date() },
      { type: 'success', content: 'JupyterLab running at http://localhost:8888/lab', timestamp: new Date() }
    ]);
  };

  const manageKernels = () => {
    setEntries(prev => [
      ...prev,
      { type: 'output', content: 'Active kernels:', timestamp: new Date() },
      { type: 'output', content: '- Python 3 (data-science)', timestamp: new Date() },
      { type: 'output', content: '- R (coastal-analysis)', timestamp: new Date() }
    ]);
  };

  const createInteractivePlot = () => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: 'Interactive plot created! Hover and zoom enabled', timestamp: new Date() }
    ]);
  };

  const create3DVisualization = () => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: '3D visualization created! Shows tide levels across Hampton Roads region', timestamp: new Date() }
    ]);
  };

  const createDashboard = () => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: 'Interactive dashboard created! Real-time coastal monitoring available', timestamp: new Date() }
    ]);
  };

  const runOptimization = () => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: 'Optimization complete! Minimized erosion prediction error by 15%', timestamp: new Date() }
    ]);
  };

  const runStatisticalTests = () => {
    setEntries(prev => [
      ...prev,
      { type: 'output', content: 'Statistical tests completed:', timestamp: new Date() },
      { type: 'output', content: 'T-test p-value: 0.023 (significant)', timestamp: new Date() },
      { type: 'output', content: 'ANOVA F-statistic: 12.45', timestamp: new Date() }
    ]);
  };

  const runIntegration = () => {
    setEntries(prev => [
      ...prev,
      { type: 'success', content: 'Numerical integration completed! Total erosion volume: 1,245.7 m³', timestamp: new Date() }
    ]);
  };

  const switchMode = (mode: 'shell' | 'agent' | 'explorer') => {
    setTerminalMode(mode);
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Switched to ${mode} mode.`, timestamp: new Date() }
    ]);
    
    if (mode === 'shell') {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Data science libraries loaded: pandas, numpy, matplotlib, seaborn, sklearn, scipy', timestamp: new Date() },
        { type: 'info', content: 'Type library name (e.g., "pandas", "sql") for available commands', timestamp: new Date() }
      ]);
    }
  };

  // File/Directory Icon Component
  const FileIcon: React.FC<{ item: FileSystemItem, className?: string }> = ({ item, className }) => {
    if (item.type === 'directory') {
      return item.expanded ? <ChevronDown size={16} className={className} /> : <ChevronRight size={16} className={className} />;
    }
    return <FileText size={16} className={className} />;
  };

  // File Explorer Renderer
  const renderFileExplorer = (items: FileSystemItem[], path: string[] = []) => {
    return items.map((item, index) => (
      <div key={index}>
        <div 
          className={`flex items-center py-1 px-2 text-xs hover:bg-slate-700 cursor-pointer ${item.active ? 'bg-slate-700' : ''}`}
          style={{ paddingLeft: `${(path.length) * 12 + 4}px` }}
          onClick={() => toggleItem([...path, item.name])}
        >
          <span className="mr-1">
            {item.type === 'directory' 
              ? (item.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)
              : <FileText size={16} />
            }
          </span>
          <span className="ml-1">{item.name}</span>
        </div>
        
        {item.type === 'directory' && item.expanded && item.children && 
          renderFileExplorer(item.children, [...path, item.name])}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col text-white bg-[#1e1e1e] font-sans overflow-hidden">
      {/* Top Menu Bar */}
      <div className="flex items-center justify-between h-8 bg-[#252526] px-2 text-xs">
        <div className="flex items-center space-x-3">
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer">View</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-[#1e1e1e] border-[#3e3e3e] text-white">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer hover:bg-[#2a2d2e]">
                  <div className="flex items-center">
                    {theme === "light" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    <span>Theme</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-[#1e1e1e] border-[#3e3e3e] text-white">
                  <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as "light" | "dark")}>
                    <DropdownMenuRadioItem value="light" className="cursor-pointer hover:bg-[#2a2d2e]">
                      <Sun className="h-4 w-4 mr-2" /> Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="cursor-pointer hover:bg-[#2a2d2e]">
                      <Moon className="h-4 w-4 mr-2" /> Dark
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="bg-[#3e3e3e]" />
              <DropdownMenuItem className="cursor-pointer hover:bg-[#2a2d2e]">
                Appearance
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#2a2d2e]">
                Editor Layout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span>Go</span>
          <span>Debug</span>
          <span>Terminal</span>
          <span>Help</span>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 cursor-pointer" />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-10 bg-[#333333] flex flex-col items-center py-2">
          <button className="p-2 text-white opacity-80 hover:opacity-100">
            <FileText size={20} />
          </button>
          <button className="p-2 text-white opacity-80 hover:opacity-100">
            <Folder size={20} />
          </button>
          <button className="p-2 text-white opacity-80 hover:opacity-100">
            <Settings size={20} />
          </button>
        </div>
        
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
          <div className="h-9 bg-[#252526] flex border-b border-[#3e3e3e]">
            <div className="px-3 py-2 bg-[#1e1e1e] text-white text-xs flex items-center border-r border-[#3e3e3e]">
              <FileText size={14} className="mr-2" />
              vCodeOpenFolder.reg
            </div>
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 overflow-auto bg-[#1e1e1e]">
            <div className="flex">
              {/* Line Numbers */}
              <div className="text-gray-500 text-xs text-right pr-2 select-none bg-[#1e1e1e]">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i} className="px-2 leading-6">{i+1}</div>
                ))}
              </div>
              
              {/* Code Content */}
              <pre className="text-white text-xs leading-6 flex-1">
{`Windows Registry Editor Version 5.00

; Open files
[HKEY_CLASSES_ROOT\\*\\shell\\Open with VS Code]
@="Edit with VS Code"
"Icon"="E:\\VSCode\\Code.exe,0"
[HKEY_CLASSES_ROOT\\*\\shell\\Open with VS Code\\command]
@="\\"E:\\VSCode\\Code.exe\\" \\"%1\\""

; This will make it appear when you right click on a folder
; If you don't want the icon to appear, remove the "Icon" line
[HKEY_CLASSES_ROOT\\Directory\\shell\\vscode]
@="Open Folder as VS Code Project"
"Icon"="E:\\VSCode\\Code.exe,0"
[HKEY_CLASSES_ROOT\\Directory\\shell\\vscode\\command]
@="\\"E:\\VSCode\\Code.exe\\" \\"%1\\""

; This will make it appear when you right click INSIDE a folder
; If you don't want the icon to appear, remove the "Icon" line
[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\vscode]
@="Open Folder as VS Code Project"
"Icon"="E:\\VSCode\\Code.exe,0"
[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\vscode\\command]
@="\\"E:\\VSCode\\Code.exe\\" \\"%V\\""
`}</pre>
            </div>
          </div>
          
          {/* Terminal */}
          <div className="h-1/4 border-t border-[#3e3e3e]">
            <div className="flex bg-[#252526] text-xs border-b border-[#3e3e3e]">
              <div className="px-3 py-1 flex items-center">
                <Terminal size={14} className="mr-1" />
                TERMINAL
              </div>
            </div>
            <div className="h-[calc(100%-25px)] bg-[#1e1e1e] text-white text-xs p-2 overflow-auto">
              {terminalHistory.map((item, index) => (
                <div key={index} className={`${item.type === 'error' ? 'text-red-400' : ''}`}>
                  {item.type === 'command' && <span className="text-blue-400">λ </span>}
                  {item.content}
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-blue-400">λ </span>
                <input
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleCommandSubmit}
                  className="flex-1 bg-transparent outline-none border-none text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white text-xs flex justify-between items-center px-3">
        <div>2: cmd</div>
        <div className="flex items-center space-x-3">
          <span>In 21, Col 40</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span>CRLF</span>
          <span>REG</span>
        </div>
      </div>
    </div>
  );
};

export default VSCodeLayout;