import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Bug, 
  Play, 
  Square, 
  Search, 
  Settings, 
  GitBranch, 
  Terminal,
  Folder,
  ChevronRight,
  ChevronDown,
  File,
  Code2,
  Zap,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

interface TheiaIDEProps {
  openFiles: Array<{ name: string; path: string }>;
  activeFile: string;
  onFileSelect: (file: { name: string; path: string }) => void;
  onFileClose: (path: string) => void;
}

interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: TreeNode[];
  expanded?: boolean;
}

const projectStructure: TreeNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: '/src',
    expanded: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        path: '/src/components',
        expanded: true,
        children: [
          { name: 'Dashboard.tsx', type: 'file', path: '/src/components/Dashboard.tsx' },
          { name: 'Layout.tsx', type: 'file', path: '/src/components/Layout.tsx' },
          { name: 'Terminal.tsx', type: 'file', path: '/src/components/Terminal.tsx' }
        ]
      },
      {
        name: 'hooks',
        type: 'folder',
        path: '/src/hooks',
        expanded: false,
        children: [
          { name: 'useAuth.ts', type: 'file', path: '/src/hooks/useAuth.ts' },
          { name: 'useAPI.ts', type: 'file', path: '/src/hooks/useAPI.ts' }
        ]
      },
      { name: 'App.tsx', type: 'file', path: '/src/App.tsx' },
      { name: 'main.tsx', type: 'file', path: '/src/main.tsx' }
    ]
  },
  {
    name: 'server',
    type: 'folder',
    path: '/server',
    expanded: false,
    children: [
      { name: 'index.ts', type: 'file', path: '/server/index.ts' },
      { name: 'routes.ts', type: 'file', path: '/server/routes.ts' }
    ]
  },
  { name: 'package.json', type: 'file', path: '/package.json' },
  { name: 'tsconfig.json', type: 'file', path: '/tsconfig.json' },
  { name: 'README.md', type: 'file', path: '/README.md' }
];

export default function TheiaIDE({ openFiles, activeFile, onFileSelect, onFileClose }: TheiaIDEProps) {
  const [sidebarPanel, setSidebarPanel] = useState<'explorer' | 'search' | 'git' | 'debug' | 'extensions'>('explorer');
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [problems, setProblems] = useState([
    { file: 'Dashboard.tsx', line: 45, message: 'Type string is not assignable to type number', severity: 'error' },
    { file: 'Layout.tsx', line: 12, message: 'Unused variable userAuth', severity: 'warning' }
  ]);

  const getFileContent = (filePath: string): string => {
    const contents: Record<string, string> = {
      '/src/App.tsx': `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;`,
      '/src/components/Dashboard.tsx': `import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DataPoint {
  id: number;
  value: string;
  timestamp: Date;
}

export default function Dashboard() {
  const [data, setData] = useState<DataPoint[]>([]);
  
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: () => fetch('/api/data').then(res => res.json())
  });
  
  useEffect(() => {
    if (apiData) {
      setData(apiData);
    }
  }, [apiData]);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Research Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {data.map(item => (
          <div key={item.id} className="p-4 border rounded">
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}`,
      '/package.json': `{
  "name": "hampton-roads-platform",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "typescript": "^5.0.0"
  }
}`
    };
    return contents[filePath] || `// File: ${filePath}\n// Content not available in preview`;
  };

  const renderFileTree = (nodes: TreeNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div 
          className={`flex items-center py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer text-xs`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'file') {
              onFileSelect({ name: node.name, path: node.path });
            }
          }}
        >
          {node.type === 'folder' && (
            node.expanded ? <ChevronDown size={12} className="mr-1" /> : <ChevronRight size={12} className="mr-1" />
          )}
          {node.type === 'folder' ? <Folder size={12} className="mr-2 text-blue-400" /> : <File size={12} className="mr-2 text-gray-400" />}
          <span className={activeFile === node.path ? 'text-white font-semibold' : 'text-gray-300'}>{node.name}</span>
        </div>
        {node.type === 'folder' && node.expanded && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white">
      {/* Activity Bar */}
      <div className="flex h-full">
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 ${sidebarPanel === 'explorer' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSidebarPanel('explorer')}
          >
            <Folder size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 ${sidebarPanel === 'search' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSidebarPanel('search')}
          >
            <Search size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 ${sidebarPanel === 'git' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSidebarPanel('git')}
          >
            <GitBranch size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 ${sidebarPanel === 'debug' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSidebarPanel('debug')}
          >
            <Bug size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 ${sidebarPanel === 'extensions' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSidebarPanel('extensions')}
          >
            <Package size={16} />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <PanelGroup direction="horizontal">
            {/* Sidebar Panel */}
            <Panel defaultSize={25} minSize={15} maxSize={40}>
              <div className="h-full bg-[#252526] border-r border-[#3e3e3e]">
                {sidebarPanel === 'explorer' && (
                  <div>
                    <div className="p-2 text-xs font-semibold border-b border-[#3e3e3e]">EXPLORER</div>
                    <div className="p-1">
                      <div className="text-xs font-semibold text-gray-400 mb-2">HAMPTON ROADS PLATFORM</div>
                      {renderFileTree(projectStructure)}
                    </div>
                  </div>
                )}
                
                {sidebarPanel === 'search' && (
                  <div>
                    <div className="p-2 text-xs font-semibold border-b border-[#3e3e3e]">SEARCH</div>
                    <div className="p-2">
                      <input 
                        type="text" 
                        placeholder="Search files..." 
                        className="w-full bg-[#3c3c3c] text-white text-xs p-2 rounded border border-[#3e3e3e]"
                      />
                      <div className="mt-2 text-xs text-gray-400">
                        <div>🔍 Advanced search capabilities</div>
                        <div>📁 File and symbol search</div>
                        <div>🔄 Real-time indexing</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {sidebarPanel === 'debug' && (
                  <div>
                    <div className="p-2 text-xs font-semibold border-b border-[#3e3e3e]">RUN AND DEBUG</div>
                    <div className="p-2">
                      <Button size="sm" className="w-full mb-2 bg-[#007acc] hover:bg-[#005a9e]">
                        <Play size={12} className="mr-1" />
                        Start Debugging
                      </Button>
                      <div className="text-xs text-gray-400">
                        <div>🐛 Breakpoint management</div>
                        <div>📊 Variable inspection</div>
                        <div>⚡ Live debugging</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-[#3e3e3e] hover:bg-[#007acc] transition-colors cursor-col-resize" />

            {/* Editor Area */}
            <Panel defaultSize={75}>
              <PanelGroup direction="vertical">
                {/* Editor */}
                <Panel defaultSize={terminalVisible ? 70 : 100}>
                  <div className="h-full flex flex-col">
                    {/* Editor Tabs */}
                    <div className="h-9 bg-[#252526] flex items-center border-b border-[#3e3e3e] overflow-auto">
                      {openFiles.length > 0 ? (
                        openFiles.map((file) => (
                          <div 
                            key={file.path}
                            className={`px-3 py-2 text-white text-xs flex items-center border-r border-[#3e3e3e] cursor-pointer transition-colors hover:bg-[#2a2d2e] ${
                              activeFile === file.path ? 'bg-[#1e1e1e] border-t-2 border-t-[#007acc]' : 'bg-[#2d2d2d]'
                            }`}
                            onClick={() => onFileSelect(file)}
                          >
                            <Code2 size={14} className="mr-2" />
                            <span className="truncate max-w-[120px]">{file.name}</span>
                            <span 
                              className="ml-2 text-gray-400 hover:text-white hover:bg-[#3e3e3e] rounded px-1" 
                              onClick={(e) => { e.stopPropagation(); onFileClose(file.path); }}
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
                    <div className="flex-1 overflow-auto bg-[#1e1e1e] relative">
                      {activeFile ? (
                        <div className="flex h-full">
                          {/* Line numbers */}
                          <div className="text-gray-500 text-xs text-right pr-3 select-none bg-[#1e1e1e] border-r border-[#3e3e3e] min-w-[50px]">
                            {getFileContent(activeFile).split('\n').map((_, i) => (
                              <div key={i} className="px-2 leading-6 hover:bg-[#2a2d2e]">{i+1}</div>
                            ))}
                          </div>
                          
                          {/* Code content */}
                          <div className="flex-1 relative">
                            <pre className="text-white text-xs leading-6 h-full whitespace-pre-wrap p-3 font-mono">
                              {getFileContent(activeFile)}
                            </pre>
                            
                            {/* IDE Features Overlay */}
                            <div className="absolute top-2 right-2 text-xs">
                              <div className="bg-[#252526] border border-[#3e3e3e] rounded p-2 mb-2">
                                <div className="flex items-center text-green-400 mb-1">
                                  <Zap size={12} className="mr-1" />
                                  Theia IDE
                                </div>
                                <div className="text-gray-400">Code intelligence active</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-center">
                          <div>
                            <Code2 size={48} className="mx-auto mb-4 text-blue-400" />
                            <h2 className="text-lg mb-4">Theia IDE Ready</h2>
                            <p className="text-sm text-gray-400 mb-8">
                              Professional development environment powered by Eclipse Theia
                            </p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>🎯 Advanced code editing and navigation</div>
                              <div>🐛 Integrated debugging capabilities</div>
                              <div>🔍 Powerful search and file management</div>
                              <div>📦 Extensible plugin architecture</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>

                {terminalVisible && (
                  <>
                    <PanelResizeHandle className="h-1 bg-[#3e3e3e] hover:bg-[#007acc] transition-colors cursor-row-resize" />
                    
                    {/* Problems/Terminal Panel */}
                    <Panel defaultSize={30} minSize={20}>
                      <div className="h-full bg-[#1e1e1e]">
                        {/* Panel tabs */}
                        <div className="h-8 bg-[#252526] flex items-center border-b border-[#3e3e3e]">
                          <div className="px-3 py-1 text-xs bg-[#1e1e1e] border-t-2 border-t-[#007acc]">
                            Problems ({problems.length})
                          </div>
                          <div className="px-3 py-1 text-xs hover:bg-[#2a2d2e] cursor-pointer">
                            Terminal
                          </div>
                          <div className="px-3 py-1 text-xs hover:bg-[#2a2d2e] cursor-pointer">
                            Output
                          </div>
                        </div>
                        
                        {/* Problems content */}
                        <div className="p-2 text-xs">
                          {problems.map((problem, index) => (
                            <div key={index} className="flex items-center py-1 hover:bg-[#2a2d2e] cursor-pointer">
                              <div className={`w-3 h-3 rounded-full mr-2 ${problem.severity === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                              <span className="text-white mr-2">{problem.file}</span>
                              <span className="text-gray-400 mr-2">:{problem.line}</span>
                              <span className="text-gray-300">{problem.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Panel>
                  </>
                )}
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}