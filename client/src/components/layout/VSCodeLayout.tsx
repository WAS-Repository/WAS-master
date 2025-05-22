import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  FileText, 
  Folder, 
  ChevronDown, 
  ChevronRight, 
  Terminal, 
  Settings,
  Code,
  Command
} from 'lucide-react';

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

// Terminal command history type
type TerminalCommand = {
  type: 'command' | 'output' | 'error';
  content: string;
};

const VSCodeLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(fileSystemData);
  const [terminalHistory, setTerminalHistory] = useState<TerminalCommand[]>([
    { type: 'output', content: 'Git + click to follow link' },
    { type: 'command', content: 'git config --global core.editor "E:/VSCode/Code.exe" --wait' },
    { type: 'output', content: 'D:\\Documents\nλ git config --global -e\nhint: Waiting for your editor to close the file...\nerror: There was a problem with the editor \'E:/VSCode/Code.exe\' --wait\'.' },
    { type: 'command', content: 'git config --global core.editor "E:/VSCode/Code.exe" --wait --new-window --disable-extensions*' },
    { type: 'output', content: 'D:\\Documents\nλ git config --global -e\nhint: Waiting for your editor to close the file...' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');

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

  // Handle terminal command submission
  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      setTerminalHistory([
        ...terminalHistory,
        { type: 'command', content: currentCommand },
        { type: 'output', content: 'D:\\Documents\nλ ' }
      ]);
      setCurrentCommand('');
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
      <div className="flex items-center h-8 bg-[#252526] px-2 text-xs">
        <div className="flex items-center space-x-3">
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <span>View</span>
          <span>Go</span>
          <span>Debug</span>
          <span>Terminal</span>
          <span>Help</span>
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