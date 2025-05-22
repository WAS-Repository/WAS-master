import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Moon, 
  Sun, 
  Search,
  Map,
  Code,
  Eye,
  Save,
  FileDown
} from 'lucide-react';

// Workspace settings based on VS Code workspace protocol
interface WorkspaceSettings {
  "editor.fontSize": number;
  "editor.fontFamily": string;
  "workbench.colorTheme": string;
  "workbench.colorCustomizations": {
    "terminal.background": string;
    "terminal.foreground": string;
    "terminalCursor.background": string;
    "terminalCursor.foreground": string;
  };
  "window.zoomLevel": number;
  "editor.minimap.enabled": boolean;
  "breadcrumbs.enabled": boolean;
  "editor.lineHeight": number;
  "terminal.integrated.fontSize": number;
  "explorer.compactFolders": boolean;
}

// Research workspace configuration
export interface ResearchWorkspace {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  settings: WorkspaceSettings;
  layout: {
    panels: string[];
    activePanel: string;
    terminalHeight: number;
    sidebarWidth: number;
  };
  ambience: {
    brightness: number;
    soundscape: string;
    volume: number;
  };
}

// Preset research workspaces
export const researchWorkspaces: ResearchWorkspace[] = [
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    description: 'Minimalist environment for intensive research and deep reading',
    icon: <Brain className="h-5 w-5" />,
    settings: {
      "editor.fontSize": 14,
      "editor.fontFamily": "Menlo, Monaco, 'Courier New', monospace",
      "workbench.colorTheme": "Dark+",
      "workbench.colorCustomizations": {
        "terminal.background": "#000000",
        "terminal.foreground": "#00ff00",
        "terminalCursor.background": "#000000",
        "terminalCursor.foreground": "#00ff00"
      },
      "window.zoomLevel": 0,
      "editor.minimap.enabled": false,
      "breadcrumbs.enabled": false,
      "editor.lineHeight": 20,
      "terminal.integrated.fontSize": 14,
      "explorer.compactFolders": true
    },
    layout: {
      panels: ['document', 'terminal'],
      activePanel: 'document',
      terminalHeight: 25,
      sidebarWidth: 20
    },
    ambience: {
      brightness: 30,
      soundscape: 'white-noise',
      volume: 20
    }
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Data-centric workspace for quantitative research',
    icon: <Search className="h-5 w-5" />,
    settings: {
      "editor.fontSize": 13,
      "editor.fontFamily": "'Source Code Pro', monospace",
      "workbench.colorTheme": "Light+",
      "workbench.colorCustomizations": {
        "terminal.background": "#1a1a1a",
        "terminal.foreground": "#00ffff",
        "terminalCursor.background": "#1a1a1a",
        "terminalCursor.foreground": "#00ffff"
      },
      "window.zoomLevel": 0,
      "editor.minimap.enabled": true,
      "breadcrumbs.enabled": true,
      "editor.lineHeight": 18,
      "terminal.integrated.fontSize": 13,
      "explorer.compactFolders": false
    },
    layout: {
      panels: ['graph', 'document', 'terminal'],
      activePanel: 'graph',
      terminalHeight: 30,
      sidebarWidth: 25
    },
    ambience: {
      brightness: 70,
      soundscape: 'ambient',
      volume: 15
    }
  },
  {
    id: 'spatial-research',
    name: 'Spatial Research',
    description: 'Map-based exploration for geographical analysis',
    icon: <Map className="h-5 w-5" />,
    settings: {
      "editor.fontSize": 14,
      "editor.fontFamily": "'Fira Code', monospace",
      "workbench.colorTheme": "Monokai",
      "workbench.colorCustomizations": {
        "terminal.background": "#2a2a2a",
        "terminal.foreground": "#ffffff",
        "terminalCursor.background": "#2a2a2a",
        "terminalCursor.foreground": "#ffffff"
      },
      "window.zoomLevel": 1,
      "editor.minimap.enabled": true,
      "breadcrumbs.enabled": true,
      "editor.lineHeight": 22,
      "terminal.integrated.fontSize": 14,
      "explorer.compactFolders": false
    },
    layout: {
      panels: ['map', 'document', 'terminal'],
      activePanel: 'map',
      terminalHeight: 20,
      sidebarWidth: 20
    },
    ambience: {
      brightness: 60,
      soundscape: 'city',
      volume: 25
    }
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Low-light environment for evening research sessions',
    icon: <Moon className="h-5 w-5" />,
    settings: {
      "editor.fontSize": 15,
      "editor.fontFamily": "'JetBrains Mono', monospace",
      "workbench.colorTheme": "Night Owl",
      "workbench.colorCustomizations": {
        "terminal.background": "#011627",
        "terminal.foreground": "#7fdbca",
        "terminalCursor.background": "#011627",
        "terminalCursor.foreground": "#7fdbca"
      },
      "window.zoomLevel": 0.5,
      "editor.minimap.enabled": false,
      "breadcrumbs.enabled": false,
      "editor.lineHeight": 24,
      "terminal.integrated.fontSize": 15,
      "explorer.compactFolders": true
    },
    layout: {
      panels: ['document', 'terminal', 'graph'],
      activePanel: 'document',
      terminalHeight: 30,
      sidebarWidth: 15
    },
    ambience: {
      brightness: 10,
      soundscape: 'rain',
      volume: 30
    }
  },
  {
    id: 'coding-docs',
    name: 'Coding & Documentation',
    description: 'Developer-friendly setup for technical documentation',
    icon: <Code className="h-5 w-5" />,
    settings: {
      "editor.fontSize": 14,
      "editor.fontFamily": "'Cascadia Code', monospace",
      "workbench.colorTheme": "GitHub Dark",
      "workbench.colorCustomizations": {
        "terminal.background": "#24292e",
        "terminal.foreground": "#e1e4e8",
        "terminalCursor.background": "#24292e",
        "terminalCursor.foreground": "#e1e4e8"
      },
      "window.zoomLevel": 0,
      "editor.minimap.enabled": true,
      "breadcrumbs.enabled": true,
      "editor.lineHeight": 20,
      "terminal.integrated.fontSize": 14,
      "explorer.compactFolders": false
    },
    layout: {
      panels: ['document', 'terminal', 'graph'],
      activePanel: 'terminal',
      terminalHeight: 40,
      sidebarWidth: 25
    },
    ambience: {
      brightness: 50,
      soundscape: 'keyboard',
      volume: 15
    }
  }
];

// Function to generate VS Code workspace file content
export const generateWorkspaceConfig = (workspace: ResearchWorkspace) => {
  const workspaceConfig = {
    "folders": [
      {
        "path": "."
      }
    ],
    "settings": {
      ...workspace.settings,
      "window.title": `Research - ${workspace.name}`,
      "workbench.activityBar.visible": true,
      "workbench.statusBar.visible": true
    },
    "extensions": {
      "recommendations": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "ms-azuretools.vscode-docker",
        "streetsidesoftware.code-spell-checker",
        "yzhang.markdown-all-in-one"
      ]
    },
    "launch": {
      "configurations": [],
      "compounds": []
    }
  };
  
  return JSON.stringify(workspaceConfig, null, 2);
};

export interface ResearchWorkspacesMenuProps {
  onSelectWorkspace: (workspace: ResearchWorkspace) => void;
  onExportWorkspace?: (configJson: string, workspaceName: string) => void;
  currentWorkspaceId?: string;
}

export default function ResearchWorkspacesMenu({
  onSelectWorkspace,
  onExportWorkspace,
  currentWorkspaceId = 'deep-focus'
}: ResearchWorkspacesMenuProps) {
  const { toast } = useToast();
  
  const currentWorkspace = researchWorkspaces.find(w => w.id === currentWorkspaceId) || researchWorkspaces[0];

  const handleSelectWorkspace = (workspace: ResearchWorkspace) => {
    onSelectWorkspace(workspace);
    
    toast({
      title: "Workspace Changed",
      description: `Now using the "${workspace.name}" research workspace`,
    });
  };

  const handleExportWorkspace = (workspace: ResearchWorkspace) => {
    const config = generateWorkspaceConfig(workspace);
    
    if (onExportWorkspace) {
      onExportWorkspace(config, workspace.name);
    } else {
      // Fallback: create a downloadable file
      const blob = new Blob([config], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workspace.id}.code-workspace`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    toast({
      title: "Workspace Configuration Exported",
      description: `VS Code workspace file for "${workspace.name}" has been downloaded`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-black text-green-500 border-green-900 hover:bg-green-900 hover:text-black"
        >
          <Eye className="mr-1 h-4 w-4" />
          <span>View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black border-green-900 text-green-500">
        <DropdownMenuLabel className="text-green-300">Research Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-green-900" />
        
        {researchWorkspaces.map((workspace) => (
          <DropdownMenuItem 
            key={workspace.id}
            className={`flex items-center gap-2 cursor-pointer ${currentWorkspaceId === workspace.id ? 'bg-green-900 text-black' : 'hover:bg-green-900 hover:text-black'}`}
            onClick={() => handleSelectWorkspace(workspace)}
          >
            <div className="flex items-center gap-2 flex-1">
              {React.cloneElement(workspace.icon as React.ReactElement, { 
                className: `h-4 w-4 ${currentWorkspaceId === workspace.id ? 'text-black' : 'text-green-500'}` 
              })}
              <span>{workspace.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-green-800 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleExportWorkspace(workspace);
              }}
            >
              <FileDown className="h-3 w-3" />
            </Button>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-green-900" />
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-green-900 hover:text-black">
          <Save className="h-4 w-4" />
          <span>Save Current as Workspace...</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}