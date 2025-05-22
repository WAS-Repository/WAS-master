import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Sun, 
  Moon, 
  BookOpen,
  Search,
  Map,
  Network,
  Code,
  Settings,
  FileText,
  LayoutGrid,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResearchMood } from './ResearchMoodWidget';

// Workspace configurations based on different research tasks
export interface WorkspaceConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  layout: {
    panels: {
      id: string;
      type: 'document' | 'terminal' | 'map' | 'graph' | 'calendar' | 'search';
      size: number; // Percentage of available space
      position: 'main' | 'left' | 'right' | 'bottom';
      visible: boolean;
    }[];
    activePanel: string;
  };
  theme: {
    mode: 'dark' | 'light';
    colorScheme: string;
    terminalColors: {
      background: string;
      foreground: string;
      cursor: string;
      selection: string;
    };
  };
  exportable: boolean; // Whether this workspace can be exported as a VS Code workspace
}

// Predefined workspace configurations
const predefinedWorkspaces: WorkspaceConfig[] = [
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    icon: <Brain size={16} />,
    layout: {
      panels: [
        { id: 'document-viewer', type: 'document', size: 70, position: 'main', visible: true },
        { id: 'terminal', type: 'terminal', size: 30, position: 'bottom', visible: true },
        { id: 'map', type: 'map', size: 0, position: 'right', visible: false },
        { id: 'graph', type: 'graph', size: 0, position: 'right', visible: false },
      ],
      activePanel: 'document-viewer',
    },
    theme: {
      mode: 'dark',
      colorScheme: 'tron',
      terminalColors: {
        background: '#000000',
        foreground: '#00ff00',
        cursor: '#00ff00',
        selection: '#005500',
      },
    },
    exportable: true,
  },
  {
    id: 'spatial-analysis',
    name: 'Spatial Analysis',
    icon: <Map size={16} />,
    layout: {
      panels: [
        { id: 'map', type: 'map', size: 60, position: 'main', visible: true },
        { id: 'document-viewer', type: 'document', size: 40, position: 'right', visible: true },
        { id: 'terminal', type: 'terminal', size: 25, position: 'bottom', visible: true },
        { id: 'graph', type: 'graph', size: 0, position: 'right', visible: false },
      ],
      activePanel: 'map',
    },
    theme: {
      mode: 'dark',
      colorScheme: 'matrix',
      terminalColors: {
        background: '#0a1c1a',
        foreground: '#00ff9c',
        cursor: '#00ff9c',
        selection: '#003327',
      },
    },
    exportable: true,
  },
  {
    id: 'relationship-explorer',
    name: 'Relationship Explorer',
    icon: <Network size={16} />,
    layout: {
      panels: [
        { id: 'graph', type: 'graph', size: 60, position: 'main', visible: true },
        { id: 'document-viewer', type: 'document', size: 40, position: 'right', visible: true },
        { id: 'terminal', type: 'terminal', size: 20, position: 'bottom', visible: true },
        { id: 'map', type: 'map', size: 0, position: 'right', visible: false },
      ],
      activePanel: 'graph',
    },
    theme: {
      mode: 'dark',
      colorScheme: 'modern',
      terminalColors: {
        background: '#1a1a2e',
        foreground: '#7f5af0',
        cursor: '#7f5af0',
        selection: '#2e1e4a',
      },
    },
    exportable: true,
  },
  {
    id: 'multi-document',
    name: 'Multi-Document Analysis',
    icon: <FileText size={16} />,
    layout: {
      panels: [
        { id: 'document-viewer', type: 'document', size: 50, position: 'main', visible: true },
        { id: 'search', type: 'search', size: 30, position: 'left', visible: true },
        { id: 'terminal', type: 'terminal', size: 20, position: 'bottom', visible: true },
        { id: 'graph', type: 'graph', size: 0, position: 'right', visible: false },
        { id: 'map', type: 'map', size: 0, position: 'right', visible: false },
      ],
      activePanel: 'document-viewer',
    },
    theme: {
      mode: 'light',
      colorScheme: 'sepia',
      terminalColors: {
        background: '#f4ecd8',
        foreground: '#5c4b37',
        cursor: '#5c4b37',
        selection: '#e0d6c2',
      },
    },
    exportable: true,
  },
  {
    id: 'code-documentation',
    name: 'Code & Documentation',
    icon: <Code size={16} />,
    layout: {
      panels: [
        { id: 'terminal', type: 'terminal', size: 50, position: 'main', visible: true },
        { id: 'document-viewer', type: 'document', size: 50, position: 'right', visible: true },
        { id: 'graph', type: 'graph', size: 25, position: 'bottom', visible: true },
        { id: 'map', type: 'map', size: 0, position: 'right', visible: false },
      ],
      activePanel: 'terminal',
    },
    theme: {
      mode: 'dark',
      colorScheme: 'classic',
      terminalColors: {
        background: '#24292e',
        foreground: '#e1e4e8',
        cursor: '#e1e4e8',
        selection: '#3b4b5a',
      },
    },
    exportable: true,
  },
  {
    id: 'night-reading',
    name: 'Night Reading',
    icon: <Moon size={16} />,
    layout: {
      panels: [
        { id: 'document-viewer', type: 'document', size: 80, position: 'main', visible: true },
        { id: 'terminal', type: 'terminal', size: 20, position: 'bottom', visible: true },
        { id: 'map', type: 'map', size: 0, position: 'right', visible: false },
        { id: 'graph', type: 'graph', size: 0, position: 'right', visible: false },
      ],
      activePanel: 'document-viewer',
    },
    theme: {
      mode: 'dark',
      colorScheme: 'nightOwl',
      terminalColors: {
        background: '#011627',
        foreground: '#d6deeb',
        cursor: '#7fdbca',
        selection: '#1d3b53',
      },
    },
    exportable: true,
  },
];

// Convert workspace config to VS Code workspace file
export const convertToVSCodeWorkspace = (config: WorkspaceConfig): string => {
  // Map our theme names to VS Code theme extensions
  const themeMapping: Record<string, string> = {
    'tron': 'github.github-vscode-theme',
    'matrix': 'sdras.night-owl',
    'modern': 'akamud.vscode-theme-onedark',
    'sepia': 'dustinsanders.an-old-hope-theme-vscode',
    'classic': 'wesbos.theme-cobalt2',
    'nightOwl': 'sdras.night-owl',
  };
  
  // Build VS Code workspace configuration
  const workspaceConfig = {
    folders: [{ path: '.' }],
    settings: {
      // Editor settings
      'workbench.colorTheme': config.theme.mode === 'dark' ? 'GitHub Dark' : 'GitHub Light',
      'window.zoomLevel': 0,
      'editor.fontSize': 14,
      'editor.fontFamily': 'Consolas, monospace',
      'editor.lineHeight': 1.6,
      
      // Terminal settings
      'terminal.integrated.fontSize': 14,
      'terminal.integrated.fontFamily': 'monospace',
      'terminal.integrated.defaultProfile.linux': 'bash',
      'workbench.colorCustomizations': {
        'terminal.background': config.theme.terminalColors.background,
        'terminal.foreground': config.theme.terminalColors.foreground,
        'terminalCursor.background': config.theme.terminalColors.background,
        'terminalCursor.foreground': config.theme.terminalColors.cursor,
        'terminal.selectionBackground': config.theme.terminalColors.selection,
      },
      
      // UI settings based on workspace type
      'editor.minimap.enabled': config.id !== 'deep-focus',
      'workbench.activityBar.visible': config.id !== 'deep-focus',
      'zenMode.fullScreen': config.id === 'deep-focus' || config.id === 'night-reading',
      'zenMode.hideLineNumbers': config.id === 'deep-focus',
      'window.menuBarVisibility': config.id === 'deep-focus' ? 'toggle' : 'default',
      'editor.lineNumbers': config.id === 'deep-focus' ? 'off' : 'on',
      
      // Custom settings for our app
      'hampton.researchMode': config.id,
      'hampton.panels.showMap': config.layout.panels.some(p => p.type === 'map' && p.visible),
      'hampton.panels.showGraph': config.layout.panels.some(p => p.type === 'graph' && p.visible),
    },
    extensions: {
      recommendations: [
        themeMapping[config.theme.colorScheme] || 'github.github-vscode-theme',
        'pkief.material-icon-theme',
        'ritwickdey.liveserver',
        'esbenp.prettier-vscode',
        'yzhang.markdown-all-in-one',
      ]
    }
  };
  
  return JSON.stringify(workspaceConfig, null, 2);
};

// Helper function to download workspace file
const downloadWorkspaceFile = (config: WorkspaceConfig) => {
  const workspaceJson = convertToVSCodeWorkspace(config);
  const blob = new Blob([workspaceJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${config.id}-research-workspace.code-workspace`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
};

// Convert ResearchMood to WorkspaceConfig
export const convertMoodToWorkspace = (mood: ResearchMood): WorkspaceConfig => {
  // Map mood settings to workspace configuration
  const getIcon = () => {
    switch (mood.id) {
      case 'deep-focus': return <Brain size={16} />;
      case 'creative-exploration': return <Sun size={16} />;
      case 'night-owl': return <Moon size={16} />;
      case 'data-analysis': return <Code size={16} />;
      case 'reading-intensive': return <BookOpen size={16} />;
      default: return <Eye size={16} />;
    }
  };
  
  // Map color theme
  const getColorScheme = (): string => {
    switch (mood.settings.colorTheme) {
      case 'tron': return 'tron';
      case 'matrix': return 'matrix';
      case 'modern': return 'modern';
      case 'sepia': return 'sepia';
      case 'classic': return 'classic';
      default: return 'tron';
    }
  };
  
  // Map terminal colors based on theme
  const getTerminalColors = () => {
    if (mood.settings.colorTheme === 'tron') {
      return {
        background: '#000000',
        foreground: '#00ff00',
        cursor: '#00ff00',
        selection: '#005500',
      };
    } else if (mood.settings.colorTheme === 'matrix') {
      return {
        background: '#0a1c1a',
        foreground: '#00ff9c',
        cursor: '#00ff9c',
        selection: '#003327',
      };
    } else if (mood.settings.lightMode) {
      return {
        background: '#f4f4f4',
        foreground: '#333333',
        cursor: '#333333',
        selection: '#cccccc',
      };
    } else {
      return {
        background: '#1a1a1a',
        foreground: '#e1e1e1',
        cursor: '#e1e1e1',
        selection: '#3a3a3a',
      };
    }
  };
  
  return {
    id: mood.id,
    name: mood.name,
    icon: getIcon(),
    layout: {
      // Create panels based on focus mode
      panels: [
        { 
          id: 'document-viewer', 
          type: 'document', 
          size: mood.settings.focusMode ? 80 : 60, 
          position: 'main', 
          visible: true 
        },
        { 
          id: 'terminal', 
          type: 'terminal', 
          size: mood.settings.focusMode ? 20 : 25, 
          position: 'bottom', 
          visible: true 
        },
        { 
          id: 'map', 
          type: 'map', 
          size: mood.settings.focusMode ? 0 : 40, 
          position: 'right', 
          visible: !mood.settings.focusMode 
        },
        { 
          id: 'graph', 
          type: 'graph', 
          size: 0, 
          position: 'right', 
          visible: false 
        },
      ],
      activePanel: 'document-viewer',
    },
    theme: {
      mode: mood.settings.lightMode ? 'light' : 'dark',
      colorScheme: getColorScheme(),
      terminalColors: getTerminalColors(),
    },
    exportable: true,
  };
};

interface WorkspaceMoodSelectorProps {
  onSelectWorkspace: (workspace: WorkspaceConfig) => void;
  currentWorkspaceId?: string;
  className?: string;
}

export default function WorkspaceMoodSelector({
  onSelectWorkspace,
  currentWorkspaceId = 'deep-focus',
  className = ''
}: WorkspaceMoodSelectorProps) {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceConfig | null>(null);
  const { toast } = useToast();
  
  // Initialize current workspace from ID
  useEffect(() => {
    const workspace = predefinedWorkspaces.find(w => w.id === currentWorkspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
  }, [currentWorkspaceId]);
  
  // Handle workspace selection
  const handleSelectWorkspace = (workspace: WorkspaceConfig) => {
    setCurrentWorkspace(workspace);
    onSelectWorkspace(workspace);
    
    toast({
      title: `${workspace.name} View Applied`,
      description: "Your workspace has been reconfigured",
    });
  };
  
  // Handle exporting workspace to VS Code
  const handleExportWorkspace = (e: React.MouseEvent, workspace: WorkspaceConfig) => {
    e.stopPropagation();
    if (workspace.exportable) {
      downloadWorkspaceFile(workspace);
      
      toast({
        title: "Workspace Exported",
        description: "VS Code workspace file has been downloaded",
      });
    }
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Eye size={16} />
            <span className="hidden sm:inline">View:</span> 
            <span className="font-medium">
              {currentWorkspace?.name || "Select View"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Research Views</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {predefinedWorkspaces.map((workspace) => (
            <DropdownMenuItem 
              key={workspace.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleSelectWorkspace(workspace)}
            >
              <div className="flex items-center gap-2">
                {workspace.icon}
                <span>{workspace.name}</span>
              </div>
              
              {workspace.exportable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => handleExportWorkspace(e, workspace)}
                >
                  <Code size={14} />
                </Button>
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2">
            <Settings size={16} />
            <span>Customize View...</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}