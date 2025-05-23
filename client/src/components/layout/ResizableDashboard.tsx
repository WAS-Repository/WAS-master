import React, { useState, useRef, useEffect } from 'react';
import { Terminal, MessageSquare, Search, FileText, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import UbuntuFileExplorer from './UbuntuFileExplorer';

interface ResizableDashboardProps {
  onOpenVisualization?: (type: string) => void;
}

export default function ResizableDashboard({ onOpenVisualization }: ResizableDashboardProps) {
  const [terminalMode, setTerminalMode] = useState<'shell' | 'agent'>('shell');
  const [openFiles, setOpenFiles] = useState<Array<{ name: string; path: string }>>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [entries, setEntries] = useState<Array<{
    type: 'input' | 'output' | 'info' | 'error' | 'success' | 'command';
    content: string;
    timestamp: Date;
  }>>([
    { type: 'info', content: 'Hampton Roads Research Terminal initialized', timestamp: new Date() },
    { type: 'info', content: 'Type commands or switch to Agent mode for AI assistance', timestamp: new Date() }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentPath] = useState('~/hampton-roads');
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle file selection from Ubuntu explorer
  const handleFileSelect = (file: any) => {
    const newFile = { name: file.name, path: file.path };
    if (!openFiles.find(f => f.path === file.path)) {
      setOpenFiles(prev => [...prev, newFile]);
    }
    setActiveFile(file.path);
  };

  // Close file tab
  const closeFile = (path: string) => {
    setOpenFiles(prev => prev.filter(f => f.path !== path));
    if (activeFile === path) {
      setActiveFile(openFiles.length > 1 ? openFiles[0].path : '');
    }
  };

  // Switch terminal mode
  const switchMode = (mode: 'shell' | 'agent') => {
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
        { type: 'info', content: '• source-data [locality/topic] - Find and integrate datasets', timestamp: new Date() }
      ]);
    }
  };

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentCommand.trim()) {
        setEntries(prev => [
          ...prev,
          { type: 'command', content: currentCommand, timestamp: new Date() }
        ]);
        
        // Process command
        setTimeout(() => {
          if (terminalMode === 'agent') {
            handleAgentCommand(currentCommand);
          } else {
            handleShellCommand(currentCommand);
          }
        }, 100);
        
        setCurrentCommand('');
      }
    }
  };

  // Handle shell commands
  const handleShellCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'ls' || cmd === 'dir') {
      setEntries(prev => [
        ...prev,
        { type: 'output', content: 'Documents/  Maps/  Datasets/  README.md', timestamp: new Date() }
      ]);
    } else if (cmd === 'pwd') {
      setEntries(prev => [
        ...prev,
        { type: 'output', content: currentPath, timestamp: new Date() }
      ]);
    } else if (cmd === 'help') {
      setEntries(prev => [
        ...prev,
        { type: 'success', content: 'Available shell commands:', timestamp: new Date() },
        { type: 'output', content: 'ls, dir - List directory contents', timestamp: new Date() },
        { type: 'output', content: 'pwd - Show current directory', timestamp: new Date() },
        { type: 'output', content: 'clear - Clear terminal', timestamp: new Date() },
        { type: 'output', content: 'help - Show this help', timestamp: new Date() }
      ]);
    } else if (cmd === 'clear') {
      setEntries([]);
    } else {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `Command not found: ${command}`, timestamp: new Date() }
      ]);
    }
  };

  // Handle agent commands
  const handleAgentCommand = (command: string) => {
    const cmd = command.toLowerCase();
    
    if (cmd.startsWith('create-viz')) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: '🎨 Creating visualization...', timestamp: new Date() },
        { type: 'success', content: '📊 Visualization generated! Opening in new panel...', timestamp: new Date() }
      ]);
      
      if (onOpenVisualization) {
        setTimeout(() => onOpenVisualization('chart'), 1000);
      }
    } else if (cmd.startsWith('story-dashboard')) {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: '📖 Creating story dashboard...', timestamp: new Date() },
        { type: 'success', content: '🎬 Interactive story dashboard created!', timestamp: new Date() }
      ]);
      
      if (onOpenVisualization) {
        setTimeout(() => onOpenVisualization('dashboard'), 1000);
      }
    } else {
      setEntries(prev => [
        ...prev,
        { type: 'success', content: '🤖 AI processing your request...', timestamp: new Date() },
        { type: 'output', content: 'Analysis complete. Results integrated into research database.', timestamp: new Date() }
      ]);
    }
  };

  // Get file content
  const getFileContent = (path: string) => {
    if (path.includes('coastal-erosion')) {
      return `# Coastal Erosion Impact Study
## Hampton Roads Region Analysis

### Executive Summary
This comprehensive study examines the accelerating coastal erosion rates across the Hampton Roads metropolitan area...

### Key Findings
- Sea level rise: 3.2mm/year (NOAA data)
- Erosion rate increase: 15% since 2010
- Infrastructure at risk: $2.3B value

### Recommendations
1. Implement adaptive shoreline management
2. Enhance early warning systems
3. Develop resilient infrastructure standards`;
    }
    
    return `# Hampton Roads Research Document
## Loading content...

This document contains research data and analysis for the Hampton Roads coastal resilience project.
Select a specific document from the file explorer to view its contents.`;
  };

  // Focus terminal input
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="h-full flex flex-col text-white bg-[#1e1e1e]">
      {/* Top Menu Bar */}
      <div className="h-8 bg-[#2d2d2d] flex items-center justify-between px-4 text-xs border-b border-[#3e3e3e]">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Hampton Roads Research Platform</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">File</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">Edit</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">View</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">Terminal</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">Help</span>
        </div>
      </div>
      
      {/* Resizable Main Content Area */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Document Explorer Panel - Resizable */}
        <Panel defaultSize={25} minSize={15} maxSize={40}>
          <UbuntuFileExplorer onFileSelect={handleFileSelect} />
        </Panel>

        <PanelResizeHandle className="w-1 bg-[#3e3e3e] hover:bg-[#007acc] transition-colors cursor-col-resize" />

        {/* Editor and Terminal Panel - Resizable */}
        <Panel defaultSize={75} minSize={60}>
          <PanelGroup direction="vertical" className="h-full">
            {/* Editor Panel - Resizable */}
            <Panel defaultSize={70} minSize={30}>
              <div className="h-full flex flex-col">
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
                        <p className="text-xs text-gray-500">
                          💡 Drag the borders between panels to resize them!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="h-1 bg-[#3e3e3e] hover:bg-[#007acc] transition-colors cursor-row-resize" />

            {/* Terminal Panel - Resizable */}
            <Panel defaultSize={30} minSize={20} maxSize={60}>
              <div className="h-full border-t border-[#3e3e3e]">
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
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
      
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
}