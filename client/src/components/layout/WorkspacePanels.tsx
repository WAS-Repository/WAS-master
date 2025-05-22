import React, { useState, useRef, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Maximize,
  Minimize,
  Plus,
  X,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  FileText,
  Map,
  Network,
  Calendar,
  Terminal as TerminalIcon,
  Layers
} from 'lucide-react';
import DocumentViewer from '../visualization/DocumentViewer';
import MapView from '../visualization/MapView';
import KnowledgeGraph from '../visualization/KnowledgeGraph';

export type PaneType = 'document' | 'map' | 'graph' | 'terminal' | 'calendar';

interface PaneConfig {
  id: string;
  type: PaneType;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function WorkspacePanels() {
  // Default layout with document viewer as the main panel
  const [layout, setLayout] = useState<{ 
    direction: 'horizontal' | 'vertical'; 
    panes: Array<{
      id: string;
      size: number;
      content: PaneConfig[];
      activePane: string;
    }>;
  }>({
    direction: 'horizontal',
    panes: [
      {
        id: 'main',
        size: 70,
        content: [
          {
            id: 'doc1',
            type: 'document',
            title: 'Document Viewer',
            icon: <FileText size={16} />,
            component: <DocumentViewer />
          }
        ],
        activePane: 'doc1'
      },
      {
        id: 'side',
        size: 30,
        content: [
          {
            id: 'map1',
            type: 'map',
            title: 'Map View',
            icon: <Map size={16} />,
            component: <MapView />
          },
          {
            id: 'graph1',
            type: 'graph',
            title: 'Knowledge Graph',
            icon: <Network size={16} />,
            component: <KnowledgeGraph />
          }
        ],
        activePane: 'map1'
      }
    ]
  });

  // Handler for adding a new pane
  const addPane = (paneGroupId: string, paneType: PaneType) => {
    const newId = `${paneType}${Date.now()}`;
    let newContent;
    
    switch (paneType) {
      case 'document':
        newContent = {
          id: newId,
          type: paneType,
          title: 'Document Viewer',
          icon: <FileText size={16} />,
          component: <DocumentViewer />
        };
        break;
      case 'map':
        newContent = {
          id: newId,
          type: paneType,
          title: 'Map View',
          icon: <Map size={16} />,
          component: <MapView />
        };
        break;
      case 'graph':
        newContent = {
          id: newId,
          type: paneType,
          title: 'Knowledge Graph',
          icon: <Network size={16} />,
          component: <KnowledgeGraph />
        };
        break;
      case 'terminal':
        newContent = {
          id: newId,
          type: paneType,
          title: 'Terminal',
          icon: <TerminalIcon size={16} />,
          component: <div className="p-4 text-sm">Terminal content will go here</div>
        };
        break;
      case 'calendar':
        newContent = {
          id: newId,
          type: paneType,
          title: 'Event Calendar',
          icon: <Calendar size={16} />,
          component: <div className="p-4 text-sm">Calendar content will go here</div>
        };
        break;
      default:
        return;
    }
    
    setLayout(prev => {
      const newLayout = {...prev};
      const paneIndex = newLayout.panes.findIndex(p => p.id === paneGroupId);
      
      if (paneIndex >= 0) {
        newLayout.panes[paneIndex].content.push(newContent as PaneConfig);
        newLayout.panes[paneIndex].activePane = newId;
      }
      
      return newLayout;
    });
  };

  // Handler for removing a pane
  const removePane = (paneGroupId: string, paneId: string) => {
    setLayout(prev => {
      const newLayout = {...prev};
      const paneIndex = newLayout.panes.findIndex(p => p.id === paneGroupId);
      
      if (paneIndex >= 0) {
        const contentIndex = newLayout.panes[paneIndex].content.findIndex(c => c.id === paneId);
        
        if (contentIndex >= 0) {
          newLayout.panes[paneIndex].content.splice(contentIndex, 1);
          
          // If we removed the active pane, set a new active pane
          if (newLayout.panes[paneIndex].activePane === paneId && newLayout.panes[paneIndex].content.length > 0) {
            newLayout.panes[paneIndex].activePane = newLayout.panes[paneIndex].content[0].id;
          }
        }
      }
      
      return newLayout;
    });
  };

  // Handler for switching the active pane
  const setActivePane = (paneGroupId: string, paneId: string) => {
    setLayout(prev => {
      const newLayout = {...prev};
      const paneIndex = newLayout.panes.findIndex(p => p.id === paneGroupId);
      
      if (paneIndex >= 0) {
        newLayout.panes[paneIndex].activePane = paneId;
      }
      
      return newLayout;
    });
  };

  // Handler for adding a new pane group (split pane)
  const addPaneGroup = (direction: 'horizontal' | 'vertical') => {
    setLayout(prev => {
      const newLayout = {...prev};
      newLayout.direction = direction;
      
      // Add a new empty pane group
      newLayout.panes.push({
        id: `pane${Date.now()}`,
        size: 30,
        content: [],
        activePane: ''
      });
      
      // Adjust sizes proportionally
      const newSize = 100 / newLayout.panes.length;
      newLayout.panes = newLayout.panes.map(pane => ({
        ...pane,
        size: newSize
      }));
      
      return newLayout;
    });
  };

  // Handler for resizing panes
  const handlePaneSizeChange = (sizes: number[]) => {
    setLayout(prev => {
      const newLayout = {...prev};
      
      newLayout.panes = newLayout.panes.map((pane, index) => ({
        ...pane,
        size: sizes[index]
      }));
      
      return newLayout;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Workspace Controls */}
      <div className="bg-bg-dark p-1 text-xs flex justify-between items-center border-b border-border-color">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-6 px-2" title="Add Horizontal Split">
            <PanelLeft size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2" title="Add Vertical Split">
            <PanelTop size={14} />
          </Button>
          <span className="border-r border-border-color h-4 mx-1"></span>
          <Button variant="ghost" size="sm" className="h-6 px-2" title="Add Document">
            <FileText size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2" title="Add Map">
            <Map size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2" title="Add Knowledge Graph">
            <Network size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2" title="Add Terminal">
            <TerminalIcon size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2" title="Add Calendar">
            <Calendar size={14} />
          </Button>
        </div>
        <div>
          <Button variant="ghost" size="sm" className="h-6 px-2" title="Reset Layout">
            <Layers size={14} />
          </Button>
        </div>
      </div>
      
      {/* Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction={layout.direction}
          className="h-full"
          onLayout={(sizes) => handlePaneSizeChange(sizes)}
        >
          {layout.panes.map((pane, index) => (
            <React.Fragment key={pane.id}>
              {index > 0 && <ResizableHandle />}
              <ResizablePanel defaultSize={pane.size} minSize={20}>
                <div className="h-full flex flex-col border border-border-color rounded overflow-hidden">
                  {/* Pane Tabs */}
                  <div className="bg-bg-dark flex items-center p-1">
                    <Tabs value={pane.activePane} className="w-full">
                      <TabsList className="bg-transparent h-6">
                        {pane.content.map(contentItem => (
                          <TabsTrigger
                            key={contentItem.id}
                            value={contentItem.id}
                            className="text-xs h-5 px-2 py-0 data-[state=active]:bg-accent"
                            onClick={() => setActivePane(pane.id, contentItem.id)}
                          >
                            <span className="flex items-center">
                              {contentItem.icon}
                              <span className="ml-1">{contentItem.title}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePane(pane.id, contentItem.id);
                                }}
                              >
                                <X size={10} />
                              </Button>
                            </span>
                          </TabsTrigger>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1"
                          onClick={() => addPane(pane.id, 'document')}
                        >
                          <Plus size={12} />
                        </Button>
                      </TabsList>
                      
                      {pane.content.map(contentItem => (
                        <TabsContent 
                          key={contentItem.id} 
                          value={contentItem.id}
                          className="h-[calc(100%-2rem)] mt-0 overflow-auto"
                        >
                          {contentItem.component}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                  
                  {/* Empty State */}
                  {pane.content.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary bg-bg-panel">
                      <p className="mb-2 text-sm">Add content to this pane</p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => addPane(pane.id, 'document')}
                        >
                          <FileText size={14} className="mr-1" />
                          Document
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => addPane(pane.id, 'map')}
                        >
                          <Map size={14} className="mr-1" />
                          Map
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => addPane(pane.id, 'graph')}
                        >
                          <Network size={14} className="mr-1" />
                          Graph
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </React.Fragment>
          ))}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}