import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Terminal as TerminalIcon, 
  FolderOpen, 
  Search, 
  HelpCircle, 
  Maximize2, 
  AlertCircle,
  FileText,
  Database,
  Map,
  Network
} from "lucide-react";

interface TerminalProps {
  height: number;
}

type TerminalEntry = {
  type: 'input' | 'output' | 'info' | 'error' | 'success' | 'command';
  content: string;
  timestamp: Date;
};

type FileEntry = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modifiedAt?: Date;
  children?: FileEntry[];
};

export default function Terminal({ height }: TerminalProps) {
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
  
  // Sample document data
  const [documents] = useState([
    { id: 1, title: "Coastal Erosion Impact Study", year: 2023, type: "research" },
    { id: 2, title: "Tidal Pattern Analysis for Hampton Roads", year: 2023, type: "research" },
    { id: 3, title: "Naval Base Protection Systems", year: 2022, type: "engineering" },
    { id: 4, title: "Sea Level Rise Projections", year: 2024, type: "research" },
    { id: 5, title: "Flood Mitigation Techniques", year: 2023, type: "policy" }
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
        case 'cat':
          viewFile(args[0]);
          break;
        // Research commands
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
        case 'connect':
          connectDocuments(args);
          break;
        case 'export':
          exportData(args);
          break;
        case 'stats':
          showStats();
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
      
      toast({
        title: "Command Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }

    // Clear the input
    setCurrentCommand('');
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
      { type: 'info', content: '  connect <id> <id> - Connect documents in graph', timestamp: new Date() },
      { type: 'info', content: '  export <type>     - Export data (types: graph, map, docs)', timestamp: new Date() },
      { type: 'info', content: '  stats             - Show research statistics', timestamp: new Date() },
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
      listing = 'Documents/  Data/  Downloads/  Applications/';
    } else if (currentPath === '/home/user/Documents') {
      listing = 'Research/  Reports/  Policy/';
    } else if (currentPath === '/home/user/Data') {
      listing = 'localities.json  flood_maps/  research_data.csv';
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
      '/home/user/Data', 
      '/home/user/Downloads',
      '/home/user/Applications'
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

  const viewFile = (filename: string) => {
    if (!filename) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: 'cat: missing file operand', timestamp: new Date() }
      ]);
      return;
    }
    
    // Simulate file content based on filename
    if (filename === 'localities.json' && currentPath === '/home/user/Data') {
      setEntries(prev => [
        ...prev,
        { 
          type: 'output', 
          content: '{\n  "localities": [\n    {"name": "Norfolk", "population": 242742},\n    {"name": "Virginia Beach", "population": 449974},\n    {"name": "Chesapeake", "population": 244835}\n  ]\n}', 
          timestamp: new Date() 
        }
      ]);
    } else {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `cat: ${filename}: No such file or directory`, timestamp: new Date() }
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
      
      // In a real app, this would communicate with the map component
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

  const connectDocuments = (args: string[]) => {
    if (args.length < 2) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: 'connect: requires two document IDs', timestamp: new Date() }
      ]);
      return;
    }
    
    const id1 = args[0];
    const id2 = args[1];
    
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Connecting documents #${id1} and #${id2}...`, timestamp: new Date() },
      { type: 'success', content: `Connection established between documents #${id1} and #${id2}.`, timestamp: new Date() }
    ]);
  };

  const exportData = (args: string[]) => {
    if (!args.length) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: 'export: missing export type', timestamp: new Date() }
      ]);
      return;
    }
    
    const exportType = args[0];
    
    setEntries(prev => [
      ...prev,
      { type: 'info', content: `Exporting ${exportType} data...`, timestamp: new Date() },
      { type: 'success', content: `${exportType}_export_${new Date().toISOString().split('T')[0]}.json created.`, timestamp: new Date() }
    ]);
  };

  const showStats = () => {
    setEntries(prev => [
      ...prev,
      { type: 'info', content: 'Research Database Statistics:', timestamp: new Date() },
      { type: 'output', content: 'Total Documents: 5', timestamp: new Date() },
      { type: 'output', content: 'Document Types:', timestamp: new Date() },
      { type: 'output', content: '  - Research Papers: 3', timestamp: new Date() },
      { type: 'output', content: '  - Engineering Docs: 1', timestamp: new Date() },
      { type: 'output', content: '  - Policy Documents: 1', timestamp: new Date() },
      { type: 'output', content: 'Localities Coverage:', timestamp: new Date() },
      { type: 'output', content: '  - Norfolk: 4 documents', timestamp: new Date() },
      { type: 'output', content: '  - Virginia Beach: 3 documents', timestamp: new Date() },
      { type: 'output', content: '  - Chesapeake: 2 documents', timestamp: new Date() }
    ]);
  };

  // Handle command history
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

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [entries]);

  // Focus input when clicking anywhere in the terminal
  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="bg-bg-terminal font-mono text-sm p-2 border-t border-border-color overflow-auto"
      style={{ height }}
      ref={terminalRef}
    >
      {/* Terminal Header with Title */}
      <div className="flex justify-between items-center mb-2 border-b border-border-color pb-1">
        <div className="flex items-center">
          <TerminalIcon size={14} className="mr-2 text-primary" />
          <span className="font-semibold">Hampton Roads Terminal</span>
          <span className="text-xs ml-2 text-text-secondary">v1.0.0</span>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <span className="sr-only">Maximize</span>
            <Maximize2 size={14} />
          </Button>
        </div>
      </div>

      {/* Command helper bar */}
      <div className="bg-bg-dark p-1 rounded mb-2 text-xs flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" className="h-5 px-2 py-0 text-xs" onClick={() => setCurrentCommand('help')}>
            <HelpCircle size={12} className="mr-1" />
            Help
          </Button>
          <Button variant="ghost" size="sm" className="h-5 px-2 py-0 text-xs" onClick={() => setCurrentCommand('search ')}>
            <Search size={12} className="mr-1" />
            Search
          </Button>
          <Button variant="ghost" size="sm" className="h-5 px-2 py-0 text-xs" onClick={() => setCurrentCommand('map show-docs')}>
            <Map size={12} className="mr-1" />
            Map
          </Button>
          <Button variant="ghost" size="sm" className="h-5 px-2 py-0 text-xs" onClick={() => setCurrentCommand('graph view')}>
            <Network size={12} className="mr-1" />
            Graph
          </Button>
        </div>
      </div>
      
      {/* Terminal output display */}
      <div className="space-y-1 max-h-[calc(100%-100px)] overflow-y-auto bg-bg-terminal rounded p-1" onClick={focusInput}>
        {entries.map((entry, index) => (
          <div key={index} className={`${entry.type === 'command' ? 'flex' : ''} ${index > 0 ? 'mt-1' : ''}`}>
            {entry.type === 'command' && <span className="text-primary font-bold opacity-80 pr-1">{entry.content.split('$')[0]}$</span>}
            <span 
              className={`
                ${entry.type === 'command' ? 'text-text-primary' : ''}
                ${entry.type === 'output' ? 'text-text-primary pl-4' : ''}
                ${entry.type === 'info' ? 'text-text-secondary' : ''}
                ${entry.type === 'error' ? 'text-error' : ''}
                ${entry.type === 'success' ? 'text-secondary' : ''}
              `}
            >
              {entry.type === 'command' ? entry.content.split('$')[1] : entry.content}
            </span>
          </div>
        ))}
      </div>
      
      {/* Terminal input line */}
      <div className="flex items-center mt-2 bg-bg-dark rounded p-1">
        <span className="text-primary font-bold opacity-80 pr-1">{currentPath}$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={e => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent outline-none text-text-primary"
          placeholder="Type command or 'help' for available commands..."
          autoFocus
        />
        <Button variant="ghost" size="sm" className="h-6 px-2 py-0 text-xs" onClick={handleCommand}>
          Execute
        </Button>
      </div>
    </div>
  );
}