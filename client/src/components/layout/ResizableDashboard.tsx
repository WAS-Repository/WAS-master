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
    const updatedFiles = openFiles.filter(f => f.path !== path);
    setOpenFiles(updatedFiles);
    
    if (activeFile === path) {
      // Set active file to the next available tab, or empty if none
      if (updatedFiles.length > 0) {
        const currentIndex = openFiles.findIndex(f => f.path === path);
        const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        setActiveFile(updatedFiles[nextIndex]?.path || '');
      } else {
        setActiveFile('');
      }
    }
  };

  // Drag and drop for tab reordering
  const handleTabDragStart = (e: React.DragEvent, draggedPath: string) => {
    e.dataTransfer.setData('text/plain', draggedPath);
  };

  const handleTabDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTabDrop = (e: React.DragEvent, targetPath: string) => {
    e.preventDefault();
    const draggedPath = e.dataTransfer.getData('text/plain');
    
    if (draggedPath !== targetPath) {
      const draggedIndex = openFiles.findIndex(f => f.path === draggedPath);
      const targetIndex = openFiles.findIndex(f => f.path === targetPath);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newFiles = [...openFiles];
        const [removed] = newFiles.splice(draggedIndex, 1);
        newFiles.splice(targetIndex, 0, removed);
        setOpenFiles(newFiles);
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

  // Get file content based on file path
  const getFileContent = (path: string) => {
    const contentMap: Record<string, string> = {
      '/Documents/Research Reports/coastal-erosion-study.md': `# Coastal Erosion Impact Study
## Hampton Roads Region Analysis

### Executive Summary
This comprehensive study examines the accelerating coastal erosion rates across the Hampton Roads metropolitan area, analyzing the intersection of sea-level rise, storm surge intensity, and human development patterns.

### Key Findings
- Sea level rise: 3.2mm/year (NOAA tide gauge data)
- Erosion rate increase: 15% since 2010
- Infrastructure at risk: $2.3B total value
- Critical facilities affected: 12 wastewater treatment plants, 3 hospitals
- Population in high-risk zones: 45,000 residents

### Methodology
1. **Data Collection**: LIDAR surveys, satellite imagery analysis
2. **Modeling**: SWAN wave model integration with ADCIRC storm surge
3. **Risk Assessment**: Monte Carlo simulations for 100-year projections

### Recommendations
1. Implement adaptive shoreline management strategies
2. Enhance early warning systems with IoT sensor networks
3. Develop resilient infrastructure standards for new construction
4. Establish managed retreat protocols for highest-risk areas

### Data Sources
- NOAA National Ocean Service
- USGS Coastal Change and Transport
- Virginia Institute of Marine Science`,

      '/Documents/Research Reports/infrastructure-assessment.md': `# Infrastructure Vulnerability Assessment
## Hampton Roads Critical Infrastructure Analysis

### Overview
Systematic evaluation of infrastructure vulnerability to sea-level rise and extreme weather events across the Hampton Roads metropolitan region.

### Critical Infrastructure Categories
1. **Transportation Networks**
   - Interstate highways: I-64, I-264, I-664
   - Port facilities: Norfolk International Terminals
   - Airports: Norfolk International, Newport News/Williamsburg

2. **Utilities & Energy**
   - Power generation facilities: 4 major plants
   - Natural gas infrastructure: 200+ miles of pipeline
   - Water treatment facilities: 18 regional plants

3. **Emergency Services**
   - Hospitals: 12 facilities in flood-prone areas
   - Fire stations: 8 requiring elevation/relocation
   - Emergency shelters: Capacity analysis for 50,000 residents

### Risk Matrix Analysis
- **High Risk**: Tunnels, low-lying roads, pump stations
- **Medium Risk**: Elevated highways, substations
- **Low Risk**: Elevated facilities, redundant systems

### Adaptation Strategies
1. Flood-proofing critical facilities
2. Infrastructure redundancy planning
3. Smart monitoring systems deployment
4. Emergency response protocol updates`,

      '/Documents/Research Reports/climate-projection-analysis.md': `# Climate Projection Analysis
## 21st Century Climate Scenarios for Hampton Roads

### Projection Models
- **Global Models**: CMIP6 ensemble (15 models)
- **Regional Downscaling**: WRF 4km resolution
- **Scenarios**: SSP1-2.6, SSP2-4.5, SSP5-8.5

### Temperature Projections (2050)
- Average increase: 2.1°C - 3.8°C
- Summer heat days (>90°F): +25-45 days annually
- Winter freeze days: -15 to -30 days annually

### Precipitation Changes
- Annual total: +5% to +15%
- Extreme events (>50mm/day): +20% frequency
- Drought periods: Extended duration, increased intensity

### Sea Level Rise Projections
- 2050: 0.3m - 0.6m above 2000 baseline
- 2100: 0.8m - 2.1m above 2000 baseline
- Uncertainty ranges include ice sheet dynamics

### Storm Surge Analysis
- Category 3+ hurricane frequency: +15% by 2050
- Maximum surge heights: +0.5m to +1.2m
- Storm timing shifts: Peak season extension

### Confidence Levels
- Temperature: High confidence (>90%)
- Precipitation: Medium confidence (70-80%)
- Extreme events: Medium-low confidence (60-70%)`,

      '/Documents/Technical Reports/sea-level-monitoring.pdf': `# Sea Level Monitoring Technical Report
## NOAA Tide Gauge Network Analysis

### Monitoring Network
- **Primary Stations**: Sewells Point, Chesapeake Bay Bridge Tunnel
- **Secondary Stations**: 8 regional gauges
- **Data Period**: 1927-2023 (96 years continuous)

### Technical Specifications
- **Instrument Type**: Acoustic tide gauges
- **Sampling Rate**: 6-minute intervals
- **Accuracy**: ±1mm vertical resolution
- **Data Transmission**: Real-time satellite uplink

### Quality Control Procedures
1. Automated range checks
2. Inter-station comparisons
3. Manual verification protocols
4. Datum adjustments (NAVD88)

### Key Measurements (2023)
- Mean Sea Level: 1.47m above MLLW
- Highest Recorded: 2.89m (Hurricane Ian)
- Lowest Recorded: -0.43m (Winter storm)
- Annual Rate of Change: +3.4mm/year

### Data Applications
- Navigation safety
- Flood warning systems
- Climate research
- Infrastructure planning`,

      '/Datasets/NOAA/sea-level-data-2023.csv': `# NOAA Sea Level Data 2023
## Tide Gauge Measurements - Sewells Point Station

Date,Time,Water_Level_m,Temperature_C,Barometric_Pressure_mb
2023-01-01,00:00,1.234,8.2,1013.2
2023-01-01,00:06,1.245,8.1,1013.4
2023-01-01,00:12,1.251,8.0,1013.3
2023-01-01,00:18,1.248,7.9,1013.5
...

## Data Description
- 87,600 measurements (6-minute intervals)
- Quality flags: 0=good, 1=questionable, 9=missing
- Vertical datum: NAVD88
- Coordinates: 36.9467°N, 76.3303°W

## Statistics
- Mean: 1.47m
- Standard Deviation: 0.68m
- Maximum: 2.89m (Oct 15, Hurricane)
- Minimum: -0.43m (Feb 23, Cold front)

## Usage Notes
- Data gaps during maintenance: Mar 15-17, Aug 3-5
- Instrument upgrade: June 2023 (improved accuracy)
- Verified against backup pressure sensor`,

      '/Maps/hampton-roads-base.geojson': `{
  "type": "FeatureCollection",
  "name": "Hampton Roads Base Map",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Norfolk",
        "population": 238005,
        "area_sq_mi": 96.3,
        "elevation_ft": 12
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-76.335, 36.947],
          [-76.198, 36.947],
          [-76.198, 36.815],
          [-76.335, 36.815],
          [-76.335, 36.947]
        ]]
      }
    }
  ]
}`
    };

    return contentMap[path] || `# ${path.split('/').pop()}
## Document Content

This document is part of the Hampton Roads Research Platform.

**File Path**: ${path}
**Type**: ${path.split('.').pop()?.toUpperCase() || 'Unknown'}

Select different files from the explorer to view their specific content.
Each document contains research data, analysis, and findings related to coastal resilience in the Hampton Roads region.

### Available Documents
- Research reports with detailed analysis
- Technical specifications and monitoring data  
- GIS datasets and mapping information
- Climate projections and risk assessments`;
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
                        draggable
                        onDragStart={(e) => handleTabDragStart(e, file.path)}
                        onDragOver={handleTabDragOver}
                        onDrop={(e) => handleTabDrop(e, file.path)}
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