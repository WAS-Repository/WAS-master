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

// Sample file structure
const sampleFileTree: FileTreeItem[] = [
  {
    name: 'OPEN EDITORS',
    type: 'folder',
    expanded: true,
    path: '/open-editors',
    children: [
      { name: 'Settings', type: 'file', path: '/open-editors/settings' },
      { name: 'User Settings', type: 'file', path: '/open-editors/user-settings' },
      { name: 'vCodeOpenFolder.reg', type: 'file', path: '/open-editors/vCodeOpenFolder.reg' }
    ]
  },
  {
    name: 'WORKSPACE',
    type: 'folder',
    expanded: true,
    path: '/workspace',
    children: [
      { name: 'vscode.bat', type: 'file', path: '/workspace/vscode.bat' },
      { name: 'vscode-setup.sh', type: 'file', path: '/workspace/vscode-setup.sh' },
      { 
        name: 'HELLO-WORLD-REACT-APP', 
        type: 'folder', 
        expanded: false,
        path: '/workspace/hello-world-react-app',
        children: [
          { name: 'README.md', type: 'file', path: '/workspace/hello-world-react-app/README.md' },
          { name: 'package.json', type: 'file', path: '/workspace/hello-world-react-app/package.json' },
          { name: 'index.js', type: 'file', path: '/workspace/hello-world-react-app/index.js' }
        ]
      }
    ]
  },
  {
    name: 'RECENT PROJECTS',
    type: 'folder',
    expanded: false,
    path: '/recent-projects',
    children: [
      { name: 'coastal-research', type: 'file', path: '/recent-projects/coastal-research' },
      { name: 'flood-analysis', type: 'file', path: '/recent-projects/flood-analysis' },
      { name: 'sea-level-metrics', type: 'file', path: '/recent-projects/sea-level-metrics' }
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
  // In a real app, this would fetch the content based on the path
  const getFileContent = (path: string) => {
    if (path === '/open-editors/vCodeOpenFolder.reg') {
      return `Windows Registry Editor Version 5.00
      
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

; This will make it appear when you right click INSIDE a folder
; If you don't want the icon to appear, remove the "Icon" line
[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\vscode\\command]
@="\\"E:\\VSCode\\Code.exe\\" \\"%V\\""`;
    } else if (path === '/workspace/hello-world-react-app/README.md') {
      return `# Hello World React App
      
This is a simple React application that demonstrates the basic concepts of React.

## Getting Started

1. Clone this repository
2. Run \`npm install\`
3. Run \`npm start\`

## Features

- React components
- Hooks
- State management
- Props passing`;
    } else {
      return `File content for ${path}\n\nThis is a placeholder content for the selected file.`;
    }
  };
  
  return (
    <div className="h-full overflow-auto p-2 text-xs font-mono">
      <pre>{getFileContent(filePath)}</pre>
    </div>
  );
};

export default function TerminalInterface() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'terminal' | 'system' | 'keyboard'>('system');
  const [showSidebar, setShowSidebar] = useState(true);
  const [fileTree, setFileTree] = useState<FileTreeItem[]>(sampleFileTree);
  const [openTabs, setOpenTabs] = useState<{id: string; name: string; path: string}[]>([
    {id: '1', name: 'vCodeOpenFolder.reg', path: '/open-editors/vCodeOpenFolder.reg'}
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(null);
  
  // System data
  const systemData = {
    hostname: 'batcore-home',
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
  
  return (
    <div className="h-full flex flex-col bg-black text-green-500 font-mono border border-green-900 rounded">
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
            <div className="flex border-b border-green-900">
              <button 
                className={`px-4 py-1 border-r border-green-900 ${activeTab === 'terminal' ? 'bg-green-900 text-black' : ''}`}
                onClick={() => setActiveTab('terminal')}
              >
                <TerminalIcon size={12} className="inline mr-1" />
                TERMINAL
              </button>
              <button 
                className={`px-4 py-1 border-r border-green-900 ${activeTab === 'system' ? 'bg-green-900 text-black' : ''}`}
                onClick={() => setActiveTab('system')}
              >
                <Monitor size={12} className="inline mr-1" />
                SYSTEM
              </button>
              {isMobile && (
                <button 
                  className={`px-4 py-1 ${activeTab === 'keyboard' ? 'bg-green-900 text-black' : ''}`}
                  onClick={() => setActiveTab('keyboard')}
                >
                  <Smartphone size={12} className="inline mr-1" />
                  KEYBOARD
                </button>
              )}
            </div>
            
            <div className="h-[calc(100%-28px)] overflow-hidden">
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
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="border-t border-green-900 p-1 text-xxs flex justify-between">
        <div>2: cmd</div>
        <div className="flex items-center gap-4">
          <span>In 21, Col 40</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span>CRLF</span>
          <span>REG</span>
        </div>
      </div>
    </div>
  );
}