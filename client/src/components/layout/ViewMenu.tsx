import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Moon, 
  Sun, 
  Search,
  Map,
  Network,
  FileText,
  Code,
  ChevronDown,
  BookOpen,
  Glasses,
  CheckCircle2,
  History,
  ListFilter,
  Database,
  Building2,
  Binoculars,
  Rocket,
  Zap
} from 'lucide-react';

// Research workspace types
export interface ResearchWorkspace {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  layout: {
    activePanel: string;
    panels: string[];
    terminalHeight: number;
    sidebarWidth: number;
  };
  features: {
    focusMode: boolean;
    ambientSound: string;
    volume: number;
    brightness: number;
  };
  recommended: string[];
  category: 'general' | 'specialized' | 'collaborative' | 'analysis';
  new?: boolean;
}

// Predefined research workspaces
export const researchWorkspaces: ResearchWorkspace[] = [
  // General research workspaces
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    description: 'Minimalist, distraction-free environment for intensive research',
    icon: <Brain className="h-4 w-4" />,
    layout: {
      activePanel: 'document',
      panels: ['document', 'terminal'],
      terminalHeight: 25,
      sidebarWidth: 20
    },
    features: {
      focusMode: true,
      ambientSound: 'white-noise',
      volume: 20,
      brightness: 30
    },
    recommended: ['Reading long documents', 'Writing research papers', 'Literature review'],
    category: 'general'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Low-light environment optimized for evening research sessions',
    icon: <Moon className="h-4 w-4" />,
    layout: {
      activePanel: 'document',
      panels: ['document', 'terminal', 'graph'],
      terminalHeight: 30,
      sidebarWidth: 15
    },
    features: {
      focusMode: true,
      ambientSound: 'rain',
      volume: 25,
      brightness: 15
    },
    recommended: ['Late night sessions', 'Reduced eye strain', 'Quiet environments'],
    category: 'general'
  },
  {
    id: 'standard',
    name: 'Standard Research',
    description: 'Balanced workspace for everyday research tasks',
    icon: <FileText className="h-4 w-4" />,
    layout: {
      activePanel: 'document',
      panels: ['document', 'terminal', 'map'],
      terminalHeight: 30,
      sidebarWidth: 25
    },
    features: {
      focusMode: false,
      ambientSound: 'none',
      volume: 0,
      brightness: 60
    },
    recommended: ['General research', 'Collaborative sessions', 'Mixed document types'],
    category: 'general'
  },
  
  // Specialized research workspaces
  {
    id: 'spatial-analysis',
    name: 'Spatial Analysis',
    description: 'Map-centric environment for geographical research',
    icon: <Map className="h-4 w-4" />,
    layout: {
      activePanel: 'map',
      panels: ['map', 'document', 'terminal'],
      terminalHeight: 20,
      sidebarWidth: 20
    },
    features: {
      focusMode: false,
      ambientSound: 'ambient',
      volume: 15,
      brightness: 70
    },
    recommended: ['GIS data analysis', 'Location-based studies', 'Urban planning research'],
    category: 'specialized'
  },
  {
    id: 'network-explorer',
    name: 'Network Explorer',
    description: 'Graph-centric layout for relationship analysis',
    icon: <Network className="h-4 w-4" />,
    layout: {
      activePanel: 'graph',
      panels: ['graph', 'document', 'terminal'],
      terminalHeight: 25,
      sidebarWidth: 20
    },
    features: {
      focusMode: false,
      ambientSound: 'none',
      volume: 0,
      brightness: 50
    },
    recommended: ['Network analysis', 'Social science research', 'Citation networks'],
    category: 'specialized'
  },
  {
    id: 'citation-manager',
    name: 'Citation Manager',
    description: 'Optimized for managing and organizing research sources',
    icon: <ListFilter className="h-4 w-4" />,
    layout: {
      activePanel: 'document',
      panels: ['document', 'graph', 'terminal'],
      terminalHeight: 20,
      sidebarWidth: 30
    },
    features: {
      focusMode: false,
      ambientSound: 'lofi',
      volume: 10,
      brightness: 60
    },
    recommended: ['Literature organization', 'Citation management', 'Research planning'],
    category: 'specialized',
    new: true
  },
  
  // Analysis workspaces
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Terminal-focused environment for data processing',
    icon: <Database className="h-4 w-4" />,
    layout: {
      activePanel: 'terminal',
      panels: ['terminal', 'document', 'graph'],
      terminalHeight: 60,
      sidebarWidth: 20
    },
    features: {
      focusMode: false,
      ambientSound: 'none',
      volume: 0,
      brightness: 70
    },
    recommended: ['Statistical analysis', 'Data processing', 'Research computation'],
    category: 'analysis'
  },
  {
    id: 'multi-document',
    name: 'Multi-Document Analysis',
    description: 'Layout optimized for comparing multiple research documents',
    icon: <Glasses className="h-4 w-4" />,
    layout: {
      activePanel: 'document',
      panels: ['document', 'terminal', 'graph'],
      terminalHeight: 20,
      sidebarWidth: 25
    },
    features: {
      focusMode: false,
      ambientSound: 'none',
      volume: 0,
      brightness: 65
    },
    recommended: ['Document comparison', 'Literature surveys', 'Cross-reference analysis'],
    category: 'analysis'
  },
  {
    id: 'expert-system',
    name: 'Expert System',
    description: 'AI-augmented research environment with extensive analysis tools',
    icon: <Zap className="h-4 w-4" />,
    layout: {
      activePanel: 'terminal',
      panels: ['terminal', 'document', 'graph', 'map'],
      terminalHeight: 40,
      sidebarWidth: 25
    },
    features: {
      focusMode: false,
      ambientSound: 'ambient',
      volume: 10,
      brightness: 60
    },
    recommended: ['AI-assisted research', 'Complex analysis', 'Multi-modal data'],
    category: 'analysis',
    new: true
  },
  
  // Collaborative workspaces
  {
    id: 'presentation-mode',
    name: 'Presentation Mode',
    description: 'Clear, high-contrast display for sharing research findings',
    icon: <Rocket className="h-4 w-4" />,
    layout: {
      activePanel: 'document',
      panels: ['document', 'graph', 'map'],
      terminalHeight: 20,
      sidebarWidth: 20
    },
    features: {
      focusMode: false,
      ambientSound: 'none',
      volume: 0,
      brightness: 90
    },
    recommended: ['Research presentations', 'Team meetings', 'Stakeholder updates'],
    category: 'collaborative'
  },
  {
    id: 'field-research',
    name: 'Field Research',
    description: 'Mobile-optimized interface for on-site data collection',
    icon: <Binoculars className="h-4 w-4" />,
    layout: {
      activePanel: 'map',
      panels: ['map', 'document', 'terminal'],
      terminalHeight: 30,
      sidebarWidth: 15
    },
    features: {
      focusMode: false,
      ambientSound: 'none',
      volume: 0,
      brightness: 100
    },
    recommended: ['On-site research', 'Field data collection', 'Mobile research'],
    category: 'collaborative'
  },
  {
    id: 'institutional-review',
    name: 'Institutional Review',
    description: 'Formal environment for regulatory and compliance research',
    icon: <Building2 className="h-4 w-4" />,
    layout: {
      activePanel: 'document',
      panels: ['document', 'terminal'],
      terminalHeight: 20,
      sidebarWidth: 30
    },
    features: {
      focusMode: true,
      ambientSound: 'none',
      volume: 0,
      brightness: 80
    },
    recommended: ['Regulatory compliance', 'IRB submissions', 'Policy research'],
    category: 'collaborative',
    new: true
  }
];

// Generate VS Code workspace file
const generateVSCodeWorkspace = (workspace: ResearchWorkspace): string => {
  const workspaceConfig = {
    "folders": [
      {
        "path": "."
      }
    ],
    "settings": {
      // Theme settings based on brightness and focus mode
      "workbench.colorTheme": workspace.features.brightness < 50 ? "GitHub Dark" : "GitHub Light",
      "window.zoomLevel": 0,
      "workbench.colorCustomizations": {
        "terminal.background": workspace.features.brightness < 30 ? "#000000" : 
                              workspace.features.brightness < 50 ? "#1a1a1a" : 
                              workspace.features.brightness < 70 ? "#f5f5f5" : "#ffffff",
        "terminal.foreground": workspace.features.brightness < 50 ? "#00ff00" : "#333333",
        "editor.background": workspace.features.brightness < 50 
          ? `rgba(30, 30, 30, ${workspace.features.brightness/100})`
          : `rgba(255, 255, 255, ${workspace.features.brightness/100})`
      },
      
      // Focus mode settings
      "editor.minimap.enabled": !workspace.features.focusMode,
      "breadcrumbs.enabled": !workspace.features.focusMode,
      "workbench.activityBar.visible": !workspace.features.focusMode,
      "editor.lineNumbers": workspace.features.focusMode ? "off" : "on",
      "zenMode.fullScreen": workspace.features.focusMode,
      
      // Custom application settings
      "hampton.workspace": workspace.id,
      "hampton.activePanel": workspace.layout.activePanel,
      "hampton.panels": workspace.layout.panels,
      "hampton.terminalHeight": workspace.layout.terminalHeight,
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

interface ViewMenuProps {
  onSelectWorkspace: (workspace: ResearchWorkspace) => void;
  currentWorkspaceId: string;
}

export default function ViewMenu({ onSelectWorkspace, currentWorkspaceId }: ViewMenuProps) {
  const { toast } = useToast();
  
  const handleSelectWorkspace = (workspace: ResearchWorkspace) => {
    onSelectWorkspace(workspace);
    
    toast({
      title: `${workspace.name} Activated`,
      description: workspace.description,
    });
  };
  
  const handleExportWorkspace = (e: React.MouseEvent, workspace: ResearchWorkspace) => {
    e.stopPropagation(); // Prevent triggering the dropdown item click
    
    // Generate and download the VS Code workspace file
    const config = generateVSCodeWorkspace(workspace);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workspace.id}.code-workspace`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "VS Code Workspace Created",
      description: `Exported "${workspace.name}" configuration as .code-workspace file`,
    });
  };
  
  const currentWorkspace = researchWorkspaces.find(w => w.id === currentWorkspaceId) || researchWorkspaces[0];
  
  // Organize workspaces by category
  const generalWorkspaces = researchWorkspaces.filter(w => w.category === 'general');
  const specializedWorkspaces = researchWorkspaces.filter(w => w.category === 'specialized');
  const analysisWorkspaces = researchWorkspaces.filter(w => w.category === 'analysis');
  const collaborativeWorkspaces = researchWorkspaces.filter(w => w.category === 'collaborative');
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-2 text-green-500">
          View
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-56 bg-black border-green-900 text-green-500">
        <DropdownMenuLabel className="text-green-300">Research Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-green-900" />
        
        {/* Recently used workspaces */}
        <DropdownMenuLabel className="text-green-300 text-xs py-1">Recent</DropdownMenuLabel>
        {[currentWorkspace, ...generalWorkspaces.filter(w => w.id !== currentWorkspaceId).slice(0, 1)].map(workspace => (
          <DropdownMenuItem 
            key={`recent-${workspace.id}`}
            className={`flex items-center justify-between cursor-pointer ${currentWorkspaceId === workspace.id ? 'bg-green-900 text-black' : 'hover:bg-green-900 hover:text-black'}`}
            onClick={() => handleSelectWorkspace(workspace)}
          >
            <div className="flex items-center gap-2">
              {React.cloneElement(workspace.icon as React.ReactElement, { 
                className: `h-4 w-4 ${currentWorkspaceId === workspace.id ? 'text-black' : 'text-green-500'}` 
              })}
              <span>{workspace.name}</span>
              {currentWorkspaceId === workspace.id && (
                <CheckCircle2 className="h-3 w-3 ml-1" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        
        {/* General workspaces */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-green-900 hover:text-black">
            <FileText className="h-4 w-4 mr-2" />
            <span>General Research</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-black border-green-900 text-green-500">
            {generalWorkspaces.map(workspace => (
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
                <div className="flex items-center">
                  {currentWorkspaceId === workspace.id && (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  )}
                  <Code 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-white"
                    onClick={(e) => handleExportWorkspace(e, workspace)}
                  />
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        {/* Specialized workspaces */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-green-900 hover:text-black">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>Specialized Research</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-black border-green-900 text-green-500">
            {specializedWorkspaces.map(workspace => (
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
                  {workspace.new && (
                    <span className="text-xs bg-green-900 text-black px-1 rounded-sm">New</span>
                  )}
                </div>
                <div className="flex items-center">
                  {currentWorkspaceId === workspace.id && (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  )}
                  <Code 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-white"
                    onClick={(e) => handleExportWorkspace(e, workspace)}
                  />
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        {/* Analysis workspaces */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-green-900 hover:text-black">
            <Search className="h-4 w-4 mr-2" />
            <span>Data Analysis</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-black border-green-900 text-green-500">
            {analysisWorkspaces.map(workspace => (
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
                  {workspace.new && (
                    <span className="text-xs bg-green-900 text-black px-1 rounded-sm">New</span>
                  )}
                </div>
                <div className="flex items-center">
                  {currentWorkspaceId === workspace.id && (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  )}
                  <Code 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-white"
                    onClick={(e) => handleExportWorkspace(e, workspace)}
                  />
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        {/* Collaborative workspaces */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-green-900 hover:text-black">
            <Binoculars className="h-4 w-4 mr-2" />
            <span>Collaborative Research</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-black border-green-900 text-green-500">
            {collaborativeWorkspaces.map(workspace => (
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
                  {workspace.new && (
                    <span className="text-xs bg-green-900 text-black px-1 rounded-sm">New</span>
                  )}
                </div>
                <div className="flex items-center">
                  {currentWorkspaceId === workspace.id && (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  )}
                  <Code 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-white"
                    onClick={(e) => handleExportWorkspace(e, workspace)}
                  />
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator className="bg-green-900" />
        
        {/* View history */}
        <DropdownMenuItem className="hover:bg-green-900 hover:text-black">
          <History className="h-4 w-4 mr-2" />
          <span>Workspace History</span>
        </DropdownMenuItem>
        
        {/* Save current layout */}
        <DropdownMenuItem className="hover:bg-green-900 hover:text-black">
          <Code className="h-4 w-4 mr-2" />
          <span>Export Current Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}