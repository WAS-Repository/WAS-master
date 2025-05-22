import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Terminal as TerminalIcon, 
  FolderOpen, 
  MessageSquare, 
  FileText, 
  Search, 
  HelpCircle, 
  Maximize2, 
  Trash2, 
  AlertCircle 
} from "lucide-react";

interface TerminalProps {
  height: number;
}

type TerminalEntry = {
  type: 'input' | 'output' | 'info' | 'error' | 'success';
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

type TerminalMode = 'shell' | 'agent' | 'explorer';

export default function Terminal({ height }: TerminalProps) {
  // Terminal mode state
  const [activeMode, setActiveMode] = useState<TerminalMode>('shell');
  
  // Shell mode state
  const [shellEntries, setShellEntries] = useState<TerminalEntry[]>([
    { 
      type: 'info', 
      content: 'Hampton Roads Terminal v1.0.0', 
      timestamp: new Date() 
    },
    { 
      type: 'info', 
      content: 'Type \'help\' for a list of available commands.', 
      timestamp: new Date() 
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  
  // Agent mode state
  const [agentEntries, setAgentEntries] = useState<TerminalEntry[]>([
    { 
      type: 'info', 
      content: 'Document Research Agent v1.0.0', 
      timestamp: new Date() 
    },
    { 
      type: 'info', 
      content: 'Type \'help\' for a list of available agent commands.', 
      timestamp: new Date() 
    }
  ]);
  const [agentCommand, setAgentCommand] = useState('');
  
  // File explorer mode state
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([
    {
      name: 'Documents',
      path: '/Documents',
      type: 'directory',
      children: [
        {
          name: 'Research Papers',
          path: '/Documents/Research Papers',
          type: 'directory',
          children: [
            {
              name: 'coastal_erosion.pdf',
              path: '/Documents/Research Papers/coastal_erosion.pdf',
              type: 'file',
              size: 2400000,
              modifiedAt: new Date('2025-04-15')
            },
            {
              name: 'sea_level_rise.pdf',
              path: '/Documents/Research Papers/sea_level_rise.pdf',
              type: 'file',
              size: 1800000,
              modifiedAt: new Date('2025-04-10')
            }
          ]
        },
        {
          name: 'Policy Documents',
          path: '/Documents/Policy Documents',
          type: 'directory',
          children: [
            {
              name: 'flood_mitigation_policy.docx',
              path: '/Documents/Policy Documents/flood_mitigation_policy.docx',
              type: 'file',
              size: 500000,
              modifiedAt: new Date('2025-03-22')
            }
          ]
        }
      ]
    },
    {
      name: 'Data',
      path: '/Data',
      type: 'directory',
      children: [
        {
          name: 'localities.json',
          path: '/Data/localities.json',
          type: 'file',
          size: 750000,
          modifiedAt: new Date('2025-02-18')
        },
        {
          name: 'flood_maps',
          path: '/Data/flood_maps',
          type: 'directory',
          children: [
            {
              name: 'norfolk_2025.geojson',
              path: '/Data/flood_maps/norfolk_2025.geojson',
              type: 'file',
              size: 1200000,
              modifiedAt: new Date('2025-01-30')
            }
          ]
        }
      ]
    }
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle shell command submission
  const handleShellCommand = async () => {
    if (!currentCommand.trim()) return;
    
    // Add command to terminal output
    setShellEntries(prev => [
      ...prev, 
      { type: 'input', content: currentCommand, timestamp: new Date() }
    ]);

    try {
      // Process basic shell commands
      if (currentCommand === 'help') {
        setShellEntries(prev => [
          ...prev,
          { type: 'info', content: 'Available shell commands:', timestamp: new Date() },
          { type: 'info', content: '  ls - List directory contents', timestamp: new Date() },
          { type: 'info', content: '  cd <dir> - Change directory', timestamp: new Date() },
          { type: 'info', content: '  pwd - Print working directory', timestamp: new Date() },
          { type: 'info', content: '  cat <file> - View file contents', timestamp: new Date() },
          { type: 'info', content: '  clear - Clear terminal output', timestamp: new Date() },
          { type: 'info', content: '  echo <message> - Print a message', timestamp: new Date() },
          { type: 'info', content: '  date - Display current date and time', timestamp: new Date() },
        ]);
      } else if (currentCommand === 'clear') {
        setShellEntries([
          { type: 'info', content: 'Terminal cleared.', timestamp: new Date() }
        ]);
      } else if (currentCommand === 'date') {
        setShellEntries(prev => [
          ...prev,
          { type: 'output', content: new Date().toString(), timestamp: new Date() }
        ]);
      } else if (currentCommand === 'pwd') {
        setShellEntries(prev => [
          ...prev,
          { type: 'output', content: '/home/user', timestamp: new Date() }
        ]);
      } else if (currentCommand === 'ls') {
        setShellEntries(prev => [
          ...prev,
          { type: 'output', content: 'Documents  Data  Applications  Downloads', timestamp: new Date() }
        ]);
      } else if (currentCommand.startsWith('echo ')) {
        const message = currentCommand.substring(5);
        setShellEntries(prev => [
          ...prev,
          { type: 'output', content: message, timestamp: new Date() }
        ]);
      } else {
        // Generic command processing
        setShellEntries(prev => [
          ...prev,
          { type: 'error', content: `Command not found: ${currentCommand}`, timestamp: new Date() }
        ]);
      }
    } catch (error) {
      setShellEntries(prev => [
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

  // Handle agent command submission
  const handleAgentCommand = async () => {
    if (!agentCommand.trim()) return;
    
    // Add command to terminal output
    setAgentEntries(prev => [
      ...prev, 
      { type: 'input', content: agentCommand, timestamp: new Date() }
    ]);

    try {
      // Process command
      if (agentCommand === 'help') {
        setAgentEntries(prev => [
          ...prev,
          { type: 'info', content: 'Available agent commands:', timestamp: new Date() },
          { type: 'info', content: '  search <query> - Search for documents', timestamp: new Date() },
          { type: 'info', content: '  extract metadata doc:<id> - Extract metadata from document', timestamp: new Date() },
          { type: 'info', content: '  graph add doc:<id> - Add document to knowledge graph', timestamp: new Date() },
          { type: 'info', content: '  map show-docs - Show documents on map', timestamp: new Date() },
          { type: 'info', content: '  connect doc:<id> doc:<id> - Connect documents', timestamp: new Date() },
          { type: 'info', content: '  export graph - Export knowledge graph', timestamp: new Date() },
          { type: 'info', content: '  clear - Clear terminal output', timestamp: new Date() },
        ]);
      } else if (agentCommand === 'clear') {
        setAgentEntries([
          { type: 'info', content: 'Agent terminal cleared.', timestamp: new Date() }
        ]);
      } else if (agentCommand.startsWith('search')) {
        // Process search command
        const query = agentCommand.substring(7);
        setAgentEntries(prev => [
          ...prev,
          { type: 'info', content: `Searching for ${query}...`, timestamp: new Date() }
        ]);
        
        // In a real implementation, this would call an actual API endpoint
        // Simulating some results for now
        setTimeout(() => {
          setAgentEntries(prev => [
            ...prev,
            { type: 'success', content: `Found 3 documents matching "${query}"`, timestamp: new Date() },
            { type: 'output', content: "1. Coastal Erosion Impact Study (2023)", timestamp: new Date() },
            { type: 'output', content: "2. Tidal Pattern Analysis for Hampton Roads (2023)", timestamp: new Date() },
            { type: 'output', content: "3. Naval Base Protection Systems (2022)", timestamp: new Date() }
          ]);
        }, 500);
      } else {
        // Generic command processing for agent
        setAgentEntries(prev => [
          ...prev,
          { type: 'info', content: `Processing agent command: ${agentCommand}`, timestamp: new Date() },
          { type: 'output', content: 'Command processed successfully', timestamp: new Date() }
        ]);
      }
    } catch (error) {
      setAgentEntries(prev => [
        ...prev,
        { type: 'error', content: `Error: ${(error as Error).message}`, timestamp: new Date() }
      ]);
      
      toast({
        title: "Agent Command Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }

    // Clear the input
    setAgentCommand('');
  };

  // Navigate file system in explorer mode
  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const handleFileSelect = (file: FileEntry) => {
    setSelectedFile(file);
    if (file.type === 'directory') {
      navigateToPath(file.path);
    }
  };

  // Get current directory listing based on path
  const getCurrentDirectoryListing = (): FileEntry[] => {
    if (currentPath === '/') {
      return fileEntries;
    }
    
    // Find the correct directory based on path
    const pathParts = currentPath.split('/').filter(Boolean);
    let currentEntries = fileEntries;
    
    for (const part of pathParts) {
      const foundDir = currentEntries.find(entry => 
        entry.type === 'directory' && entry.name === part
      );
      
      if (foundDir && foundDir.children) {
        currentEntries = foundDir.children;
      } else {
        return [];
      }
    }
    
    return currentEntries;
  };

  // Calculate parent directory path
  const getParentPath = (path: string): string => {
    if (path === '/' || !path.includes('/')) return '/';
    return path.substring(0, path.lastIndexOf('/')) || '/';
  };

  // Format file size for display
  const formatFileSize = (bytes?: number): string => {
    if (bytes === undefined) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [shellEntries, agentEntries]);

  // Focus input when clicking anywhere in the terminal
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Helper to determine if we should show breadcrumbs
  const shouldShowBreadcrumbs = activeMode === 'explorer' && currentPath !== '/';

  return (
    <div 
      className="bg-bg-terminal font-mono text-sm p-2 border-t border-border-color overflow-auto"
      style={{ height }}
      ref={terminalRef}
    >
      {/* Terminal Header with Tabs */}
      <div className="flex justify-between items-center mb-2 border-b border-border-color pb-1">
        <div className="flex space-x-4">
          <div 
            className={`flex items-center gap-1 cursor-pointer ${activeMode === 'shell' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary'}`}
            onClick={() => setActiveMode('shell')}
          >
            <TerminalIcon size={14} />
            <span>Shell</span>
          </div>
          <div 
            className={`flex items-center gap-1 cursor-pointer ${activeMode === 'agent' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary'}`}
            onClick={() => setActiveMode('agent')}
          >
            <MessageSquare size={14} />
            <span>Agent</span>
          </div>
          <div 
            className={`flex items-center gap-1 cursor-pointer ${activeMode === 'explorer' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary'}`}
            onClick={() => setActiveMode('explorer')}
          >
            <FolderOpen size={14} />
            <span>Explorer</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <span className="sr-only">Maximize</span>
            <Maximize2 size={14} />
          </Button>
        </div>
      </div>

      {/* Shell Mode */}
      {activeMode === 'shell' && (
        <>
          {/* Shell Help Bar */}
          <div className="bg-bg-dark p-1 rounded mb-2 text-xs flex justify-between items-center">
            <div>
              <span className="text-primary font-medium">Shell Commands:</span>
              <span className="text-text-secondary ml-2">ls, cd, pwd, cat, clear, echo, date</span>
            </div>
            <div>
              <Button variant="ghost" size="sm" className="h-5 px-2 py-0 text-xs">
                <HelpCircle size={12} className="mr-1" />
                Help
              </Button>
            </div>
          </div>
          
          {/* Shell output display */}
          <div className="space-y-1 max-h-[calc(100%-80px)] overflow-y-auto" onClick={focusInput}>
            {shellEntries.map((entry, index) => (
              <div key={index} className={`${entry.type === 'input' ? 'flex' : ''}`}>
                {entry.type === 'input' && <span className="text-secondary pr-1">&gt;</span>}
                <span 
                  className={`
                    ${entry.type === 'input' ? 'text-text-primary' : ''}
                    ${entry.type === 'output' ? 'text-text-primary ml-4' : ''}
                    ${entry.type === 'info' ? 'text-text-secondary' : ''}
                    ${entry.type === 'error' ? 'text-error' : ''}
                    ${entry.type === 'success' ? 'text-secondary' : ''}
                  `}
                >
                  {entry.content}
                </span>
              </div>
            ))}
          </div>
          
          {/* Shell input line */}
          <div className="flex items-center mt-2 bg-bg-dark rounded p-1">
            <span className="text-secondary pr-1">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={e => setCurrentCommand(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleShellCommand();
                }
              }}
              className="flex-grow bg-transparent outline-none text-text-primary"
              placeholder="Type shell command (e.g., ls, pwd, echo 'hello')..."
              autoFocus
            />
            <Button variant="ghost" size="sm" className="h-6 px-2 py-0 text-xs" onClick={handleShellCommand}>
              Execute
            </Button>
          </div>
        </>
      )}

      {/* Agent Mode */}
      {activeMode === 'agent' && (
        <>
          {/* Agent Help Bar */}
          <div className="bg-bg-dark p-1 rounded mb-2 text-xs flex justify-between items-center">
            <div>
              <span className="text-primary font-medium">Agent Commands:</span>
              <span className="text-text-secondary ml-2">search, extract, graph, map, connect, export</span>
            </div>
            <div>
              <Button variant="ghost" size="sm" className="h-5 px-2 py-0 text-xs">
                <HelpCircle size={12} className="mr-1" />
                Help
              </Button>
            </div>
          </div>
          
          {/* Agent output display */}
          <div className="space-y-1 max-h-[calc(100%-80px)] overflow-y-auto" onClick={focusInput}>
            {agentEntries.map((entry, index) => (
              <div key={index} className={`${entry.type === 'input' ? 'flex' : ''}`}>
                {entry.type === 'input' && <span className="text-secondary pr-1">&gt;</span>}
                <span 
                  className={`
                    ${entry.type === 'input' ? 'text-text-primary' : ''}
                    ${entry.type === 'output' ? 'text-text-primary ml-4' : ''}
                    ${entry.type === 'info' ? 'text-text-secondary' : ''}
                    ${entry.type === 'error' ? 'text-error' : ''}
                    ${entry.type === 'success' ? 'text-secondary' : ''}
                  `}
                >
                  {entry.content}
                </span>
              </div>
            ))}
          </div>
          
          {/* Agent input line */}
          <div className="flex items-center mt-2 bg-bg-dark rounded p-1">
            <span className="text-secondary pr-1">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={agentCommand}
              onChange={e => setAgentCommand(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleAgentCommand();
                }
              }}
              className="flex-grow bg-transparent outline-none text-text-primary"
              placeholder="Type agent command (e.g., search 'coastal erosion' locality:Norfolk)..."
              autoFocus
            />
            <Button variant="ghost" size="sm" className="h-6 px-2 py-0 text-xs" onClick={handleAgentCommand}>
              Execute
            </Button>
          </div>
        </>
      )}

      {/* File Explorer Mode */}
      {activeMode === 'explorer' && (
        <>
          {/* Explorer Toolbar */}
          <div className="bg-bg-dark p-1 rounded mb-2 text-xs flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 px-2 py-0 text-xs"
                onClick={() => navigateToPath('/')}
              >
                Root
              </Button>
              
              {currentPath !== '/' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 px-2 py-0 text-xs"
                  onClick={() => navigateToPath(getParentPath(currentPath))}
                >
                  Up
                </Button>
              )}
              
              <Button variant="ghost" size="sm" className="h-5 px-2 py-0 text-xs">
                New Folder
              </Button>
              
              <Button variant="ghost" size="sm" className="h-5 px-2 py-0 text-xs">
                <Trash2 size={12} className="mr-1" />
                Delete
              </Button>
            </div>
            
            <div>
              <input 
                type="text" 
                placeholder="Search files..." 
                className="h-5 px-2 py-0 text-xs bg-bg-terminal border border-border-color rounded"
              />
            </div>
          </div>
          
          {/* Path breadcrumbs */}
          {shouldShowBreadcrumbs && (
            <div className="mb-2 text-xs text-text-secondary flex items-center">
              <span className="mr-1">Path:</span>
              <span 
                className="cursor-pointer hover:underline text-primary"
                onClick={() => navigateToPath('/')}
              >
                /
              </span>
              
              {currentPath.split('/').filter(Boolean).map((part, index, array) => {
                const pathSoFar = '/' + array.slice(0, index + 1).join('/');
                return (
                  <span key={index}>
                    <span className="mx-1 text-text-secondary">/</span>
                    <span 
                      className="cursor-pointer hover:underline text-primary"
                      onClick={() => navigateToPath(pathSoFar)}
                    >
                      {part}
                    </span>
                  </span>
                );
              })}
            </div>
          )}
          
          {/* File listing */}
          <div className="bg-bg-dark rounded p-1 mb-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-color">
                  <th className="py-1 px-2 text-left">Name</th>
                  <th className="py-1 px-2 text-left">Size</th>
                  <th className="py-1 px-2 text-left">Type</th>
                  <th className="py-1 px-2 text-left">Modified</th>
                </tr>
              </thead>
              <tbody>
                {currentPath !== '/' && (
                  <tr 
                    className="hover:bg-bg-panel cursor-pointer"
                    onClick={() => navigateToPath(getParentPath(currentPath))}
                  >
                    <td className="py-1 px-2 flex items-center">
                      <FolderOpen size={14} className="mr-2 text-yellow-400" />
                      ..
                    </td>
                    <td className="py-1 px-2">-</td>
                    <td className="py-1 px-2">Directory</td>
                    <td className="py-1 px-2">-</td>
                  </tr>
                )}
                
                {getCurrentDirectoryListing().map((entry, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-bg-panel cursor-pointer ${selectedFile?.path === entry.path ? 'bg-bg-panel' : ''}`}
                    onClick={() => handleFileSelect(entry)}
                    onDoubleClick={() => {
                      if (entry.type === 'directory') {
                        navigateToPath(entry.path);
                      }
                    }}
                  >
                    <td className="py-1 px-2 flex items-center">
                      {entry.type === 'directory' ? (
                        <FolderOpen size={14} className="mr-2 text-yellow-400" />
                      ) : (
                        <FileText size={14} className="mr-2 text-blue-400" />
                      )}
                      {entry.name}
                    </td>
                    <td className="py-1 px-2">{entry.type === 'directory' ? '-' : formatFileSize(entry.size)}</td>
                    <td className="py-1 px-2">{entry.type === 'directory' ? 'Directory' : 'File'}</td>
                    <td className="py-1 px-2">{entry.modifiedAt?.toLocaleDateString() || '-'}</td>
                  </tr>
                ))}
                
                {getCurrentDirectoryListing().length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-text-secondary">
                      <AlertCircle size={18} className="inline-block mr-2" />
                      This directory is empty
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* File preview (when a file is selected) */}
          {selectedFile && selectedFile.type === 'file' && (
            <div className="bg-bg-dark rounded p-2 text-xs">
              <div className="flex justify-between items-center mb-1 pb-1 border-b border-border-color">
                <div className="font-medium">
                  <FileText size={14} className="inline-block mr-2" />
                  {selectedFile.name}
                </div>
                <div className="text-text-secondary">
                  {formatFileSize(selectedFile.size)}
                </div>
              </div>
              <div className="bg-bg-terminal p-2 rounded opacity-70 text-xs">
                {/* File preview content would go here */}
                {selectedFile.name.endsWith('.pdf') && 'PDF preview not available in terminal'}
                {selectedFile.name.endsWith('.docx') && 'DOCX preview not available in terminal'}
                {selectedFile.name.endsWith('.json') && '{ "preview": "Sample JSON content would be displayed here" }'}
                {selectedFile.name.endsWith('.geojson') && '{ "type": "FeatureCollection", "features": [...] }'}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}