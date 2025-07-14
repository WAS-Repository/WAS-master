import React, { useState } from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Plus,
  FileText,
  Map,
  Network,
  Terminal as TerminalIcon,
  Calendar,
  X,
  Maximize2,
  Minimize2,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink
} from 'lucide-react';
import DocumentViewer from '../visualization/DocumentViewer';
import MapView from '../visualization/MapView';
import KnowledgeGraph from '../visualization/KnowledgeGraph';
import Terminal from '../layout/Terminal';

// Types of panels that can be added to the workspace
type PanelType = 'document' | 'map' | 'graph' | 'terminal' | 'calendar' | 'funding';

// Configuration for a panel tab
interface PanelTab {
  id: string;
  title: string;
  type: PanelType;
  content: React.ReactNode;
  icon: React.ReactNode;
}

// Configuration for a panel group (container for tabs)
interface PanelGroup {
  id: string;
  tabs: PanelTab[];
  activeTab: string;
  size: number;
}

export default function IDEWorkspace() {
  // Default workspace layout with document as the main view
  const [layout, setLayout] = useState<{
    direction: 'horizontal' | 'vertical';
    groups: PanelGroup[];
  }>({
    direction: 'horizontal',
    groups: [
      {
        id: 'main-panel',
        tabs: [
          {
            id: 'document-1',
            title: 'Document Viewer',
            type: 'document',
            content: <DocumentViewer />,
            icon: <FileText size={14} />
          }
        ],
        activeTab: 'document-1',
        size: 70
      },
      {
        id: 'side-panel',
        tabs: [
          {
            id: 'terminal-1',
            title: 'Terminal',
            type: 'terminal',
            content: <Terminal height={300} />,
            icon: <TerminalIcon size={14} />
          },
          {
            id: 'map-1',
            title: 'Map View',
            type: 'map',
            content: <MapView />,
            icon: <Map size={14} />
          },
          {
            id: 'graph-1',
            title: 'Knowledge Graph',
            type: 'graph',
            content: <KnowledgeGraph />,
            icon: <Network size={14} />
          }
        ],
        activeTab: 'terminal-1',
        size: 30
      }
    ]
  });

  // Add a new tab to a panel group
  const addTab = (groupId: string, type: PanelType) => {
    const newTabId = `${type}-${Date.now()}`;
    let newTab: PanelTab;
    
    // Create new tab based on type
    switch (type) {
      case 'document':
        newTab = {
          id: newTabId,
          title: 'Document Viewer',
          type,
          content: <DocumentViewer />,
          icon: <FileText size={14} />
        };
        break;
      case 'terminal':
        newTab = {
          id: newTabId,
          title: 'Terminal',
          type,
          content: <Terminal height={300} />,
          icon: <TerminalIcon size={14} />
        };
        break;
      case 'map':
        newTab = {
          id: newTabId,
          title: 'Map View',
          type,
          content: <MapView />,
          icon: <Map size={14} />
        };
        break;
      case 'graph':
        newTab = {
          id: newTabId,
          title: 'Knowledge Graph',
          type,
          content: <KnowledgeGraph />,
          icon: <Network size={14} />
        };
        break;
      case 'calendar':
        newTab = {
          id: newTabId,
          title: 'Event Calendar',
          type,
          content: <div className="p-4">Calendar View (Coming Soon)</div>,
          icon: <Calendar size={14} />
        };
        break;
      case 'funding':
        newTab = {
          id: newTabId,
          title: 'Funding Data',
          type,
          content: <div className="p-4">Public Funding Data (Coming Soon)</div>,
          icon: <FileText size={14} />
        };
        break;
      default:
        return;
    }
    
    // Update layout with new tab
    setLayout(prev => {
      const newLayout = {...prev};
      const groupIndex = newLayout.groups.findIndex(g => g.id === groupId);
      
      if (groupIndex >= 0) {
        newLayout.groups[groupIndex].tabs.push(newTab);
        newLayout.groups[groupIndex].activeTab = newTabId;
      }
      
      return newLayout;
    });
  };

  // Remove a tab from a panel group
  const removeTab = (groupId: string, tabId: string) => {
    setLayout(prev => {
      const newLayout = {...prev};
      const groupIndex = newLayout.groups.findIndex(g => g.id === groupId);
      
      if (groupIndex >= 0) {
        const group = newLayout.groups[groupIndex];
        const tabIndex = group.tabs.findIndex(t => t.id === tabId);
        
        if (tabIndex >= 0) {
          // Remove the tab
          group.tabs.splice(tabIndex, 1);
          
          // If the active tab was removed, set a new active tab
          if (group.activeTab === tabId && group.tabs.length > 0) {
            group.activeTab = group.tabs[0].id;
          }
        }
      }
      
      return newLayout;
    });
  };

  // Set the active tab in a panel group
  const setActiveTab = (groupId: string, tabId: string) => {
    setLayout(prev => {
      const newLayout = {...prev};
      const groupIndex = newLayout.groups.findIndex(g => g.id === groupId);
      
      if (groupIndex >= 0) {
        newLayout.groups[groupIndex].activeTab = tabId;
      }
      
      return newLayout;
    });
  };

  // Add a new panel group
  const addPanelGroup = () => {
    setLayout(prev => {
      const newLayout = {...prev};
      const newGroupId = `panel-${Date.now()}`;
      
      // Add a new empty panel group
      newLayout.groups.push({
        id: newGroupId,
        tabs: [],
        activeTab: '',
        size: 30
      });
      
      // Redistribute panel sizes
      const equalSize = 100 / newLayout.groups.length;
      newLayout.groups = newLayout.groups.map(group => ({
        ...group,
        size: equalSize
      }));
      
      return newLayout;
    });
  };

  // Handle panel resize
  const handlePanelResize = (sizes: number[]) => {
    setLayout(prev => {
      const newLayout = {...prev};
      
      // Update panel sizes
      newLayout.groups = newLayout.groups.map((group, index) => ({
        ...group,
        size: sizes[index]
      }));
      
      return newLayout;
    });
  };

  return (
    <div className="h-full flex flex-col border border-border-color overflow-hidden">
      {/* Workspace Toolbar */}
      <div className="bg-bg-dark p-1 flex items-center justify-between border-b border-border-color">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs flex items-center gap-1"
            onClick={() => addPanelGroup()}
          >
            <Plus size={12} />
            Add Panel
          </Button>
          
          <span className="h-4 w-px bg-border-color"></span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs flex items-center gap-1"
            onClick={() => setLayout(prev => ({...prev, direction: prev.direction === 'horizontal' ? 'vertical' : 'horizontal'}))}
          >
            {layout.direction === 'horizontal' ? 
              <ChevronsLeft size={12} /> : 
              <ChevronsRight size={12} />
            }
            {layout.direction === 'horizontal' ? 'Horizontal' : 'Vertical'}
          </Button>
        </div>
      </div>
      
      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction={layout.direction}
          onLayout={handlePanelResize}
          className="h-full"
        >
          {layout.groups.map((group, index) => (
            <React.Fragment key={group.id}>
              {index > 0 && <ResizableHandle />}
              <ResizablePanel defaultSize={group.size} minSize={20}>
                <div className="h-full flex flex-col border-border-color">
                  {/* Panel Tabs */}
                  <Tabs value={group.activeTab} className="flex flex-col h-full">
                    <div className="flex items-center bg-bg-dark border-b border-border-color p-1">
                      <TabsList className="bg-transparent h-6">
                        {group.tabs.map(tab => (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="text-xs h-5 px-2 py-0 data-[state=active]:bg-accent flex items-center gap-1"
                            onClick={() => setActiveTab(group.id, tab.id)}
                          >
                            {tab.icon}
                            <span>{tab.title}</span>
                            <button
                              className="ml-1 h-3 w-3 hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTab(group.id, tab.id);
                              }}
                            >
                              <X size={8} />
                            </button>
                          </TabsTrigger>
                        ))}
                        
                        {/* Add Tab Button */}
                        <div className="relative group ml-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                          >
                            <Plus size={12} />
                          </Button>
                          
                          <div className="absolute hidden group-hover:flex top-full left-0 mt-1 bg-background border border-border-color p-1 shadow-md flex-col z-10">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 justify-start text-xs"
                              onClick={() => addTab(group.id, 'document')}
                            >
                              <FileText size={12} className="mr-1" />
                              Document
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 justify-start text-xs"
                              onClick={() => addTab(group.id, 'terminal')}
                            >
                              <TerminalIcon size={12} className="mr-1" />
                              Terminal
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 justify-start text-xs"
                              onClick={() => addTab(group.id, 'map')}
                            >
                              <Map size={12} className="mr-1" />
                              Map
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 justify-start text-xs"
                              onClick={() => addTab(group.id, 'graph')}
                            >
                              <Network size={12} className="mr-1" />
                              Graph
                            </Button>
                          </div>
                        </div>
                      </TabsList>
                      
                      <div className="ml-auto flex items-center">
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <Maximize2 size={12} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Tab Content */}
                    {group.tabs.map(tab => (
                      <TabsContent 
                        key={tab.id} 
                        value={tab.id}
                        className="flex-1 p-0 m-0 overflow-auto"
                      >
                        {tab.content}
                      </TabsContent>
                    ))}
                    
                    {/* Empty Panel State */}
                    {group.tabs.length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center p-4 text-muted-foreground">
                        <p className="mb-2 text-sm">Add content to this panel</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs flex items-center"
                            onClick={() => addTab(group.id, 'document')}
                          >
                            <FileText size={12} className="mr-1" />
                            Document
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs flex items-center"
                            onClick={() => addTab(group.id, 'terminal')}
                          >
                            <TerminalIcon size={12} className="mr-1" />
                            Terminal
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs flex items-center"
                            onClick={() => addTab(group.id, 'map')}
                          >
                            <Map size={12} className="mr-1" />
                            Map
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs flex items-center"
                            onClick={() => addTab(group.id, 'graph')}
                          >
                            <Network size={12} className="mr-1" />
                            Graph
                          </Button>
                        </div>
                      </div>
                    )}
                  </Tabs>
                </div>
              </ResizablePanel>
            </React.Fragment>
          ))}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}