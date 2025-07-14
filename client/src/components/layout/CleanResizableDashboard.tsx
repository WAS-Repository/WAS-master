import React, { useState, useRef, useEffect } from 'react';
import { Terminal, MessageSquare, FileText, Maximize2, Search, BookOpen, Palette, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import UbuntuFileExplorer from './UbuntuFileExplorer';
import VisualizationPanel from './VisualizationPanel';
import ResearchNotepad from './ResearchNotepad';
import StoryWhiteboard from './StoryWhiteboard';
import TheiaIDE from './TheiaIDE';
import WasVersionControl from './WasVersionControl';
import WelcomeScreen from './WelcomeScreen';
import { sessionPersistence } from '@/lib/sessionPersistence';
import { visualizationManager, availableVisualizations } from '@/lib/visualizations';

type WorkspaceMode = 'research' | 'story' | 'developer';

interface ResizableDashboardProps {
  onOpenVisualization?: (type: string) => void;
  visualizationPanels?: Array<{ id: string; type: string; title: string }>;
  onCloseVisualization?: (id: string) => void;
}

export default function CleanResizableDashboard({ 
  onOpenVisualization, 
  visualizationPanels = [], 
  onCloseVisualization 
}: ResizableDashboardProps) {
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('research');
  const [terminalMode, setTerminalMode] = useState<'shell' | 'agent'>('shell');
  const [openFiles, setOpenFiles] = useState<Array<{ name: string; path: string }>>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [notepadContent, setNotepadContent] = useState<string>('# Research Notes\n\n## Key Findings\n- \n\n## Questions\n- \n\n## Next Steps\n- ');
  const [whiteboardElements, setWhiteboardElements] = useState<Array<{ id: string; type: 'text' | 'rectangle' | 'circle' | 'sticky'; content: string; x: number; y: number; width?: number; height?: number; color?: string }>>([]);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  // Initialize session on component mount
  useEffect(() => {
    const initSession = async () => {
      const userId = 'user-' + Date.now(); // In real app, get from auth
      const session = await sessionPersistence.initializeSession(userId);
      
      // Restore workspace data
      setWorkspaceMode(session.currentWorkspaceMode);
      setNotepadContent(session.workspaceData.research.notepadContent);
      setOpenFiles(session.workspaceData.research.openFiles);
      setActiveFile(session.workspaceData.research.activeFile);
      setWhiteboardElements(session.workspaceData.story.whiteboardElements);
    };
    initSession();
  }, []);

  // Auto-save workspace mode changes
  const handleWorkspaceModeChange = async (mode: WorkspaceMode) => {
    setWorkspaceMode(mode);
    await sessionPersistence.setWorkspaceMode(mode);
  };

  // Auto-save research data changes
  const handleNotepadChange = async (content: string) => {
    setNotepadContent(content);
    await sessionPersistence.updateResearchData({ 
      notepadContent: content,
      openFiles,
      activeFile 
    });
  };

  // Auto-save story data changes
  const handleWhiteboardChange = async (elements: any[]) => {
    setWhiteboardElements(elements);
    await sessionPersistence.updateStoryData({ 
      whiteboardElements: elements 
    });
  };
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

  // Handle welcome screen actions
  const handleWelcomeAction = (action: string) => {
    if (action.startsWith('open-recent:')) {
      const path = action.replace('open-recent:', '');
      const fileName = path.split('/').pop() || 'untitled';
      handleFileSelect({ name: fileName, path });
    } else if (action === 'new-file' || action === 'new-research' || action === 'new-story') {
      const fileName = workspaceMode === 'research' ? 'new-research.md' : 
                     workspaceMode === 'story' ? 'new-story.md' : 
                     'new-file.txt';
      const path = `/${workspaceMode}/${fileName}`;
      handleFileSelect({ name: fileName, path });
    } else if (action === 'open-dataset' || action === 'import-media' || action === 'open-template') {
      // These could trigger file browser or other actions
      console.log('Action:', action);
    } else if (action.startsWith('walkthrough:')) {
      const walkthrough = action.replace('walkthrough:', '');
      console.log('Open walkthrough:', walkthrough);
    }
  };

  // Close file tab
  const closeFile = (path: string) => {
    const updatedFiles = openFiles.filter(f => f.path !== path);
    setOpenFiles(updatedFiles);
    
    if (activeFile === path) {
      if (updatedFiles.length > 0) {
        const currentIndex = openFiles.findIndex(f => f.path === path);
        const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        setActiveFile(updatedFiles[nextIndex]?.path || '');
      } else {
        setActiveFile('');
      }
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
        { type: 'info', content: '• analyze [query] - Analyze documents and data', timestamp: new Date() }
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
        { type: 'output', content: 'Documents/  Maps/  Datasets/  visualizations/  README.md', timestamp: new Date() }
      ]);
    } else if (cmd === 'clear') {
      setEntries([]);
    } else if (cmd === 'help') {
      setEntries(prev => [
        ...prev,
        { type: 'info', content: 'Available commands:\n  Shell: ls, clear, help, pwd, date\n  D3 Visualizations: viz help, viz list, viz create [type]\n  WAS Protocol: was create [type], was help, was list', timestamp: new Date() }
      ]);
    } else if (cmd === 'pwd') {
      setEntries(prev => [
        ...prev,
        { type: 'output', content: '/home/hampton-roads-research', timestamp: new Date() }
      ]);
    } else if (cmd === 'date') {
      setEntries(prev => [
        ...prev,
        { type: 'output', content: new Date().toString(), timestamp: new Date() }
      ]);
    } else if (command.startsWith('viz ') || command.startsWith('was ')) {
      // D3 Visualization Commands (supports both 'viz' and 'was' prefixes)
      try {
        // Convert 'was' commands to 'viz' commands for compatibility
        const normalizedCommand = command.startsWith('was ') ? command.replace('was ', 'viz ') : command;
        const result = visualizationManager.executeTerminalCommand(normalizedCommand);
        
        setEntries(prev => [
          ...prev,
          { type: result.success ? 'success' : 'error', content: result.message, timestamp: new Date() }
        ]);
        
        // If a visualization was created and we have the callback, open it
        if (result.success && result.instanceId && onOpenVisualization) {
          const instance = visualizationManager.getVisualization(result.instanceId);
          if (instance) {
            setTimeout(() => onOpenVisualization(instance.configId), 500);
          }
        }
      } catch (error) {
        setEntries(prev => [
          ...prev,
          { type: 'error', content: 'Error executing visualization command: ' + (error as Error).message, timestamp: new Date() }
        ]);
      }
    } else {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `Command not found: ${command}. Try 'help' for available commands.`, timestamp: new Date() }
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
        { type: 'success', content: '🤖 AI processing your request...', timestamp: new Date() }
      ]);
    }
  };

  // Get file content based on path
  const getFileContent = (path: string) => {
    if (path.includes('coastal-erosion')) {
      return `# Coastal Erosion Impact Study
## Hampton Roads Region Analysis

### Executive Summary
This comprehensive study examines the accelerating coastal erosion rates across the Hampton Roads metropolitan area.

### Key Findings
- Sea level rise: 3.2mm/year (NOAA tide gauge data)
- Erosion rate increase: 15% since 2010
- Infrastructure at risk: $2.3B total value
- Critical facilities affected: 12 wastewater treatment plants, 3 hospitals

### Recommendations
1. Implement adaptive shoreline management strategies
2. Enhance early warning systems with IoT sensor networks
3. Develop resilient infrastructure standards for new construction`;
    }
    
    return `# ${path.split('/').pop()}
## Document Content

This document is part of the Hampton Roads Research Platform.

**File Path**: ${path}
**Type**: ${path.split('.').pop()?.toUpperCase() || 'Unknown'}

Select different files from the explorer to view their specific content.`;
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

  const hasVisualizationPanels = visualizationPanels.length > 0;

  return (
    <div className="h-full flex flex-col text-white bg-[#1e1e1e]">
      {/* Top Menu Bar */}
      <div className="h-8 bg-[#2d2d2d] flex items-center justify-between px-4 text-xs border-b border-[#3e3e3e]">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Hampton Roads Research Platform</span>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">File</span>
          <div className="relative" ref={viewMenuRef}>
            <span 
              className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer"
              onClick={() => setShowViewMenu(!showViewMenu)}
            >
              View
            </span>
            {showViewMenu && (
              <div className="absolute top-full left-0 mt-1 bg-[#252526] border border-[#3e3e3e] rounded shadow-lg z-50 w-80 max-h-96 overflow-auto">
                <div className="p-2 border-b border-[#3e3e3e]">
                  <div className="text-xs font-semibold text-gray-300 mb-2">D3 Visualizations Available</div>
                </div>
                
                {/* Coastal Visualizations */}
                <div className="p-2">
                  <div className="text-xs font-semibold text-blue-400 mb-1">🌊 COASTAL</div>
                  {availableVisualizations.filter(viz => viz.category === 'coastal').map(viz => (
                    <div 
                      key={viz.id}
                      className="py-1 px-2 hover:bg-[#3e3e3e] rounded cursor-pointer text-xs"
                      onClick={() => {
                        if (onOpenVisualization) onOpenVisualization(viz.id);
                        setShowViewMenu(false);
                      }}
                    >
                      <div className="text-white font-medium">{viz.name}</div>
                      <div className="text-gray-400 text-xs">{viz.description}</div>
                      {viz.terminalCommand && (
                        <div className="text-green-400 text-xs mt-1">Terminal: {viz.terminalCommand}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Environmental Visualizations */}
                <div className="p-2">
                  <div className="text-xs font-semibold text-green-400 mb-1">🌿 ENVIRONMENTAL</div>
                  {availableVisualizations.filter(viz => viz.category === 'environmental').map(viz => (
                    <div 
                      key={viz.id}
                      className="py-1 px-2 hover:bg-[#3e3e3e] rounded cursor-pointer text-xs"
                      onClick={() => {
                        if (onOpenVisualization) onOpenVisualization(viz.id);
                        setShowViewMenu(false);
                      }}
                    >
                      <div className="text-white font-medium">{viz.name}</div>
                      <div className="text-gray-400 text-xs">{viz.description}</div>
                      {viz.terminalCommand && (
                        <div className="text-green-400 text-xs mt-1">Terminal: {viz.terminalCommand}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Infrastructure Visualizations */}
                <div className="p-2">
                  <div className="text-xs font-semibold text-orange-400 mb-1">🏗️ INFRASTRUCTURE</div>
                  {availableVisualizations.filter(viz => viz.category === 'infrastructure').map(viz => (
                    <div 
                      key={viz.id}
                      className="py-1 px-2 hover:bg-[#3e3e3e] rounded cursor-pointer text-xs"
                      onClick={() => {
                        if (onOpenVisualization) onOpenVisualization(viz.id);
                        setShowViewMenu(false);
                      }}
                    >
                      <div className="text-white font-medium">{viz.name}</div>
                      <div className="text-gray-400 text-xs">{viz.description}</div>
                      {viz.terminalCommand && (
                        <div className="text-green-400 text-xs mt-1">Terminal: {viz.terminalCommand}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Categories */}
                <div className="p-2">
                  <div className="text-xs font-semibold text-purple-400 mb-1">👥 DEMOGRAPHIC & 💰 ECONOMIC</div>
                  {availableVisualizations.filter(viz => viz.category === 'demographic' || viz.category === 'economic').map(viz => (
                    <div 
                      key={viz.id}
                      className="py-1 px-2 hover:bg-[#3e3e3e] rounded cursor-pointer text-xs"
                      onClick={() => {
                        if (onOpenVisualization) onOpenVisualization(viz.id);
                        setShowViewMenu(false);
                      }}
                    >
                      <div className="text-white font-medium">{viz.name}</div>
                      <div className="text-gray-400 text-xs">{viz.description}</div>
                      {viz.terminalCommand && (
                        <div className="text-green-400 text-xs mt-1">Terminal: {viz.terminalCommand}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-[#3e3e3e] text-xs text-gray-400">
                  💡 Use Developer Mode terminal with "viz" commands to customize visualizations
                </div>
              </div>
            )}
          </div>
          <span className="hover:bg-[#3e3e3e] px-2 py-1 rounded cursor-pointer">Terminal</span>
        </div>
        
        {/* Workspace Mode Switcher */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 px-2 py-0 rounded-sm text-xs ${workspaceMode === 'research' ? 'bg-[#007acc] text-white' : 'hover:bg-[#3e3e3e]'}`}
            onClick={() => handleWorkspaceModeChange('research')}
          >
            <Search size={12} className="mr-1" />
            Research
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 px-2 py-0 rounded-sm text-xs ${workspaceMode === 'story' ? 'bg-[#007acc] text-white' : 'hover:bg-[#3e3e3e]'}`}
            onClick={() => handleWorkspaceModeChange('story')}
          >
            <Palette size={12} className="mr-1" />
            Story
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 px-2 py-0 rounded-sm text-xs ${workspaceMode === 'developer' ? 'bg-[#007acc] text-white' : 'hover:bg-[#3e3e3e]'}`}
            onClick={() => handleWorkspaceModeChange('developer')}
          >
            <Code size={12} className="mr-1" />
            Developer
          </Button>
        </div>
      </div>
      
      {/* Resizable Main Content Area - Layout changes based on workspace mode */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Always show file explorer */}
        <Panel defaultSize={25} minSize={15} maxSize={40}>
          <UbuntuFileExplorer 
            onFileSelect={handleFileSelect} 
            workspaceMode={workspaceMode}
            onWorkspaceFileChange={(files) => {
              // Handle workspace file changes based on mode
              console.log('Workspace files updated:', files);
            }}
          />
        </Panel>

        <PanelResizeHandle className="w-1 bg-[#3e3e3e] hover:bg-[#007acc] transition-colors cursor-col-resize" />

        {/* Main Content Area */}
        <Panel defaultSize={workspaceMode === 'research' ? 50 : workspaceMode === 'story' ? 60 : 75} minSize={40} id="main-content">
          {workspaceMode === 'developer' ? (
            /* Developer Mode - Theia IDE or Welcome Screen */
            openFiles.length > 0 || activeFile ? (
              <TheiaIDE 
                openFiles={openFiles}
                activeFile={activeFile}
                onFileSelect={handleFileSelect}
                onFileClose={closeFile}
              />
            ) : (
              <WelcomeScreen 
                workspaceMode={workspaceMode} 
                onAction={handleWelcomeAction}
              />
            )
          ) : (
            /* Research and Story Modes - Simplified Layout */
            <PanelGroup direction="vertical" className="h-full" id="basic-panels">
              {/* Standard Editor Panel */}
              <Panel defaultSize={70} minSize={30} id="basic-editor">
                <div className="h-full flex flex-col">
                  {/* Standard Editor Tabs */}
                  <div className="h-9 bg-[#252526] flex border-b border-[#3e3e3e] overflow-auto">
                    {openFiles.length > 0 ? (
                      openFiles.map((file) => (
                        <div 
                          key={file.path}
                          className={`px-3 py-2 text-white text-xs flex items-center border-r border-[#3e3e3e] cursor-pointer transition-colors hover:bg-[#2a2d2e] ${
                            activeFile === file.path ? 'bg-[#1e1e1e] border-t-2 border-t-[#007acc]' : 'bg-[#2d2d2d]'
                          }`}
                          onClick={() => setActiveFile(file.path)}
                        >
                          <FileText size={14} className="mr-2" />
                          <span className="truncate max-w-[120px]">{file.name}</span>
                          <span 
                            className="ml-2 text-gray-400 hover:text-white hover:bg-[#3e3e3e] rounded px-1" 
                            onClick={(e) => { e.stopPropagation(); closeFile(file.path); }}
                            title="Close"
                          >
                            ×
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-400 text-xs">No files open</div>
                    )}
                  </div>
                  
                  {/* Standard Editor Content */}
                  <div className="flex-1 overflow-auto bg-[#1e1e1e]">
                    {activeFile ? (
                      <div className="flex h-full">
                        <div className="text-gray-500 text-xs text-right pr-2 select-none bg-[#1e1e1e]">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="px-2 leading-6">{i+1}</div>
                          ))}
                        </div>
                        <pre className="text-white text-xs leading-6 flex-1 whitespace-pre-wrap p-2">
                          {getFileContent(activeFile)}
                        </pre>
                      </div>
                    ) : (
                      <WelcomeScreen 
                        workspaceMode={workspaceMode} 
                        onAction={handleWelcomeAction}
                      />
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1 bg-[#3e3e3e] hover:bg-[#007acc] transition-colors cursor-row-resize" />

              {/* Standard Terminal Panel */}
              <Panel defaultSize={30} minSize={20} maxSize={60} id="basic-terminal">
                <div className="h-full border-t border-[#3e3e3e]">
                {/* Terminal Header */}
                <div className="flex justify-between items-center bg-[#252526] px-3 py-1 border-b border-[#3e3e3e]">
                  <div className="flex items-center">
                    <Terminal size={14} className="mr-2" />
                    <span className="text-xs font-semibold">Hampton Roads Terminal</span>
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
          )}
        </Panel>

        {/* Right Panel - Mode-specific content */}
        {(workspaceMode === 'research' || workspaceMode === 'story' || hasVisualizationPanels) && (
          <>
            <PanelResizeHandle className="w-1 bg-[#3e3e3e] hover:bg-[#007acc] transition-colors cursor-col-resize" />
            
            <Panel defaultSize={25} minSize={20} maxSize={50}>
              {workspaceMode === 'research' && (
                <PanelGroup direction="vertical">
                  <Panel defaultSize={50} minSize={30}>
                    <ResearchNotepad 
                      content={notepadContent}
                      onChange={handleNotepadChange}
                    />
                  </Panel>
                  <PanelResizeHandle className="h-1 bg-[#3e3e3e] hover:bg-[#007acc] transition-colors cursor-row-resize" />
                  <Panel defaultSize={50} minSize={30}>
                    <WasVersionControl 
                      currentDocument={activeFile}
                      documentContent={notepadContent}
                      onDocumentLoad={setNotepadContent}
                    />
                  </Panel>
                </PanelGroup>
              )}
              {workspaceMode === 'story' && (
                <StoryWhiteboard 
                  elements={whiteboardElements}
                  onChange={handleWhiteboardChange}
                />
              )}
              {workspaceMode === 'developer' && hasVisualizationPanels && (
                <VisualizationPanel 
                  panels={visualizationPanels} 
                  onClose={onCloseVisualization || (() => {})} 
                />
              )}
            </Panel>
          </>
        )}
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