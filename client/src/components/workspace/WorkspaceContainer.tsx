import React, { useState } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { WorkspacePanel } from './WorkspacePanel';
import DocumentViewer from '../visualization/DocumentViewer';
import MapView from '../visualization/MapView';
import KnowledgeGraph from '../visualization/KnowledgeGraph';
import Terminal from '../layout/Terminal';

// Panel types that can be added to the workspace
type PanelType = 'document' | 'terminal' | 'map' | 'graph' | 'calendar' | 'funding';

interface WorkspacePanel {
  id: string;
  type: PanelType;
  title: string;
  isMaximized: boolean;
  isMinimized: boolean;
  position: 'left' | 'right' | 'top' | 'bottom' | 'center';
  size: 'sm' | 'md' | 'lg';
}

export function WorkspaceContainer() {
  // State for managing workspace panels
  const [panels, setPanels] = useState<WorkspacePanel[]>([
    {
      id: 'doc-1',
      type: 'document',
      title: 'Document Viewer',
      isMaximized: false,
      isMinimized: false,
      position: 'left',
      size: 'lg'
    },
    {
      id: 'terminal-1',
      type: 'terminal',
      title: 'Terminal',
      isMaximized: false,
      isMinimized: false,
      position: 'bottom',
      size: 'md'
    }
  ]);

  // Function to add a new panel
  const addPanel = (type: PanelType) => {
    const newPanel: WorkspacePanel = {
      id: `${type}-${Date.now()}`,
      type,
      title: getPanelTitle(type),
      isMaximized: false,
      isMinimized: false,
      position: 'center',
      size: 'md'
    };
    
    setPanels([...panels, newPanel]);
  };

  // Get panel title based on type
  const getPanelTitle = (type: PanelType): string => {
    switch (type) {
      case 'document': return 'Document Viewer';
      case 'terminal': return 'Terminal';
      case 'map': return 'Map View';
      case 'graph': return 'Knowledge Graph';
      case 'calendar': return 'Event Calendar';
      case 'funding': return 'Public Funding Data';
      default: return 'Panel';
    }
  };

  // Function to remove a panel
  const removePanel = (id: string) => {
    setPanels(panels.filter(panel => panel.id !== id));
  };

  // Function to maximize a panel
  const toggleMaximize = (id: string) => {
    setPanels(panels.map(panel => 
      panel.id === id 
        ? { ...panel, isMaximized: !panel.isMaximized, isMinimized: false } 
        : panel
    ));
  };

  // Function to minimize a panel
  const toggleMinimize = (id: string) => {
    setPanels(panels.map(panel => 
      panel.id === id 
        ? { ...panel, isMinimized: !panel.isMinimized, isMaximized: false } 
        : panel
    ));
  };

  // Render panel content based on type
  const renderPanelContent = (panel: WorkspacePanel) => {
    switch (panel.type) {
      case 'document':
        return <DocumentViewer />;
      case 'terminal':
        return <Terminal height={300} />;
      case 'map':
        return <MapView />;
      case 'graph':
        return <KnowledgeGraph />;
      case 'calendar':
        return <div>Calendar View (Coming Soon)</div>;
      case 'funding':
        return <div>Public Funding Data (Coming Soon)</div>;
      default:
        return <div>Empty Panel</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Workspace Toolbar */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center space-x-2">
          <LayoutGrid size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">Workspace</span>
        </div>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Plus size={14} className="mr-1" />
                Add Panel
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => addPanel('document')}>
                Document Viewer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addPanel('terminal')}>
                Terminal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addPanel('map')}>
                Map View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addPanel('graph')}>
                Knowledge Graph
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => addPanel('calendar')}>
                Event Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addPanel('funding')}>
                Public Funding Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Workspace Grid Container */}
      <div className="flex-1 p-2 grid grid-cols-2 grid-rows-2 gap-2 overflow-auto">
        {panels.map(panel => (
          <WorkspacePanel
            key={panel.id}
            title={panel.title}
            defaultSize={panel.size}
            defaultPosition={panel.position}
            isMaximized={panel.isMaximized}
            isMinimized={panel.isMinimized}
            onClose={() => removePanel(panel.id)}
            onMaximize={() => toggleMaximize(panel.id)}
            onMinimize={() => toggleMinimize(panel.id)}
          >
            {renderPanelContent(panel)}
          </WorkspacePanel>
        ))}
      </div>
    </div>
  );
}