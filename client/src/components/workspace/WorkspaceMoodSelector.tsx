import React, { useState } from 'react';
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
  Code,
  Eye,
  Settings,
  FileText,
  Save,
  Map,
  Network
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Workspace configuration
export interface ResearchWorkspaceMood {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  layout: {
    // Main active view
    activeView: 'document' | 'map' | 'graph';
    // Panel sizes
    documentPanelSize: number;
    mapPanelSize: number;
    graphPanelSize: number;
    terminalHeight: number;
    // Panel visibility
    showDocument: boolean;
    showMap: boolean;
    showGraph: boolean;
    showTerminal: boolean;
  };
  theme: {
    mode: 'dark' | 'light';
    terminalColors: {
      background: string;
      foreground: string;
    };
    brightness: number; // 0-100
  };
  features: {
    focusMode: boolean;
    ambientSound: string; // 'none', 'rain', 'whitenoise', 'lofi'
    volume: number; // 0-100
  };
}

// Predefined workspaces
const workspaceMoods: ResearchWorkspaceMood[] = [
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    description: 'Distraction-free environment for focused reading and research',
    icon: <Brain className="h-4 w-4" />,
    layout: {
      activeView: 'document',
      documentPanelSize: 70,
      mapPanelSize: 0,
      graphPanelSize: 0,
      terminalHeight: 30,
      showDocument: true,
      showMap: false,
      showGraph: false,
      showTerminal: true
    },
    theme: {
      mode: 'dark',
      terminalColors: {
        background: '#000000',
        foreground: '#00ff00'
      },
      brightness: 30
    },
    features: {
      focusMode: true,
      ambientSound: 'whitenoise',
      volume: 20
    }
  },
  {
    id: 'spatial-analysis',
    name: 'Spatial Analysis',
    description: 'Map-focused environment for geographic data analysis',
    icon: <Map className="h-4 w-4" />,
    layout: {
      activeView: 'map',
      documentPanelSize: 40,
      mapPanelSize: 60,
      graphPanelSize: 0,
      terminalHeight: 25,
      showDocument: true,
      showMap: true,
      showGraph: false,
      showTerminal: true
    },
    theme: {
      mode: 'dark',
      terminalColors: {
        background: '#0a1c1a',
        foreground: '#00ff9c'
      },
      brightness: 40
    },
    features: {
      focusMode: false,
      ambientSound: 'ambient',
      volume: 15
    }
  },
  {
    id: 'network-explorer',
    name: 'Network Explorer',
    description: 'Graph-focused environment for relationship analysis',
    icon: <Network className="h-4 w-4" />,
    layout: {
      activeView: 'graph',
      documentPanelSize: 40,
      mapPanelSize: 0,
      graphPanelSize: 60,
      terminalHeight: 25,
      showDocument: true,
      showMap: false,
      showGraph: true,
      showTerminal: true
    },
    theme: {
      mode: 'dark',
      terminalColors: {
        background: '#1a1a2e',
        foreground: '#7f5af0'
      },
      brightness: 35
    },
    features: {
      focusMode: false,
      ambientSound: 'none',
      volume: 0
    }
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Low-light environment for evening research sessions',
    icon: <Moon className="h-4 w-4" />,
    layout: {
      activeView: 'document',
      documentPanelSize: 65,
      mapPanelSize: 0,
      graphPanelSize: 35,
      terminalHeight: 30,
      showDocument: true,
      showMap: false,
      showGraph: true,
      showTerminal: true
    },
    theme: {
      mode: 'dark',
      terminalColors: {
        background: '#011627',
        foreground: '#d6deeb'
      },
      brightness: 20
    },
    features: {
      focusMode: true,
      ambientSound: 'rain',
      volume: 25
    }
  },
  {
    id: 'coding',
    name: 'Coding & Documentation',
    description: 'Terminal-focused environment for programming tasks',
    icon: <Code className="h-4 w-4" />,
    layout: {
      activeView: 'document',
      documentPanelSize: 50,
      mapPanelSize: 0,
      graphPanelSize: 0,
      terminalHeight: 50,
      showDocument: true,
      showMap: false,
      showGraph: false,
      showTerminal: true
    },
    theme: {
      mode: 'dark',
      terminalColors: {
        background: '#24292e',
        foreground: '#e1e4e8'
      },
      brightness: 35
    },
    features: {
      focusMode: false,
      ambientSound: 'lofi',
      volume: 15
    }
  }
];

// Generate VS Code workspace file
export const generateVSCodeWorkspace = (workspace: ResearchWorkspaceMood): string => {
  const workspaceConfig = {
    "folders": [
      {
        "path": "."
      }
    ],
    "settings": {
      // Theme settings
      "workbench.colorTheme": workspace.theme.mode === 'dark' ? 'GitHub Dark' : 'GitHub Light',
      "window.zoomLevel": 0,
      "workbench.colorCustomizations": {
        "terminal.background": workspace.theme.terminalColors.background,
        "terminal.foreground": workspace.theme.terminalColors.foreground,
        "editor.background": workspace.theme.mode === 'dark' 
          ? `rgba(30, 30, 30, ${workspace.theme.brightness/100})` 
          : `rgba(255, 255, 255, ${workspace.theme.brightness/100})`
      },
      
      // Focus mode settings
      "editor.minimap.enabled": !workspace.features.focusMode,
      "breadcrumbs.enabled": !workspace.features.focusMode,
      "workbench.activityBar.visible": !workspace.features.focusMode,
      "editor.lineNumbers": workspace.features.focusMode ? "off" : "on",
      
      // Custom application settings
      "hampton.workspace": workspace.id,
      "hampton.activeView": workspace.layout.activeView,
      "hampton.panels.showMap": workspace.layout.showMap,
      "hampton.panels.showGraph": workspace.layout.showGraph,
      "hampton.panels.showTerminal": workspace.layout.showTerminal,
      "hampton.features.ambientSound": workspace.features.ambientSound,
      "hampton.features.volume": workspace.features.volume
    },
    "extensions": {
      "recommendations": [
        "github.github-vscode-theme",
        "pkief.material-icon-theme",
        "sdras.night-owl",
        "wesbos.theme-cobalt2"
      ]
    }
  };
  
  return JSON.stringify(workspaceConfig, null, 2);
};

interface WorkspaceMoodSelectorProps {
  onSelectWorkspace: (workspace: ResearchWorkspaceMood) => void;
  currentWorkspaceId?: string;
}

export default function WorkspaceMoodSelector({ 
  onSelectWorkspace, 
  currentWorkspaceId = 'deep-focus' 
}: WorkspaceMoodSelectorProps) {
  const { toast } = useToast();
  const currentWorkspace = workspaceMoods.find(w => w.id === currentWorkspaceId) || workspaceMoods[0];
  
  const handleSelectWorkspace = (workspace: ResearchWorkspaceMood) => {
    onSelectWorkspace(workspace);
    
    toast({
      title: `${workspace.name} Workspace`,
      description: `Switched to ${workspace.description.toLowerCase()}`,
    });
  };
  
  const handleExportVSCode = (e: React.MouseEvent, workspace: ResearchWorkspaceMood) => {
    e.stopPropagation();
    
    // Generate and download the VS Code workspace file
    const workspaceConfig = generateVSCodeWorkspace(workspace);
    const blob = new Blob([workspaceConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workspace.id}.code-workspace`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Workspace Exported",
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
          <span className="sr-only sm:not-sr-only">View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black border-green-900 text-green-500">
        <DropdownMenuLabel className="text-green-300">Research Workspace</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-green-900" />
        
        {workspaceMoods.map((workspace) => (
          <DropdownMenuItem 
            key={workspace.id}
            className={`flex items-center justify-between cursor-pointer ${currentWorkspaceId === workspace.id ? 'bg-green-900 text-black' : 'hover:bg-green-900 hover:text-black'}`}
            onClick={() => handleSelectWorkspace(workspace)}
          >
            <div className="flex items-center gap-2">
              {React.cloneElement(workspace.icon as React.ReactElement, { 
                className: `h-4 w-4 ${currentWorkspaceId === workspace.id ? 'text-black' : 'text-green-500'}` 
              })}
              <span>{workspace.name}</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-2 p-0 hover:bg-green-800 hover:text-white"
              onClick={(e) => handleExportVSCode(e, workspace)}
            >
              <Code className="h-3 w-3" />
            </Button>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-green-900" />
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-green-900 hover:text-black">
          <Save className="h-4 w-4" />
          <span>Save Current Layout...</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-green-900 hover:text-black">
          <Settings className="h-4 w-4" />
          <span>Customize Workspace...</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}