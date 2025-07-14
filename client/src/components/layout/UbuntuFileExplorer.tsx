import React, { useState, useRef } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Search, FolderPlus, Upload, Archive, Download, Trash2, MoreHorizontal, FileText, Database, Image, Move, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemItem[];
  expanded?: boolean;
  path: string;
}

interface ResearchSource {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'archive';
  size?: string;
  dateModified: string;
  children?: ResearchSource[];
  expanded?: boolean;
  path: string;
  description?: string;
  tags?: string[];
  selected?: boolean;
}

interface UbuntuFileExplorerProps {
  onFileSelect: (file: FileSystemItem) => void;
  workspaceMode?: 'research' | 'story' | 'developer';
  onWorkspaceFileChange?: (files: FileSystemItem[]) => void;
}

interface DragItem {
  id: string;
  type: 'file' | 'folder' | 'research-source';
  item: FileSystemItem | ResearchSource;
  source: 'master' | 'workspace' | 'research';
}

export default function UbuntuFileExplorer({ 
  onFileSelect, 
  workspaceMode = 'research',
  onWorkspaceFileChange 
}: UbuntuFileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const dragCounter = useRef(0);
  
  // Workspace-specific files (subset of master files)
  const [workspaceFiles, setWorkspaceFiles] = useState<FileSystemItem[]>([
    // Research mode gets research-related files
    ...(workspaceMode === 'research' ? [
      {
        name: 'Active Research',
        type: 'folder' as const,
        path: '/workspace/research',
        expanded: true,
        children: [
          { name: 'coastal-erosion-study.md', type: 'file' as const, path: '/workspace/research/coastal-erosion-study.md' },
          { name: 'sea-level-analysis.md', type: 'file' as const, path: '/workspace/research/sea-level-analysis.md' }
        ]
      }
    ] : []),
    // Story mode gets story-related files
    ...(workspaceMode === 'story' ? [
      {
        name: 'Story Projects',
        type: 'folder' as const,
        path: '/workspace/stories',
        expanded: true,
        children: [
          { name: 'hampton-roads-narrative.md', type: 'file' as const, path: '/workspace/stories/hampton-roads-narrative.md' },
          { name: 'community-impact-story.md', type: 'file' as const, path: '/workspace/stories/community-impact-story.md' }
        ]
      }
    ] : []),
    // Developer mode gets code-related files
    ...(workspaceMode === 'developer' ? [
      {
        name: 'Development',
        type: 'folder' as const,
        path: '/workspace/dev',
        expanded: true,
        children: [
          { name: 'data-analysis.py', type: 'file' as const, path: '/workspace/dev/data-analysis.py' },
          { name: 'visualization.js', type: 'file' as const, path: '/workspace/dev/visualization.js' }
        ]
      }
    ] : [])
  ]);
  const [researchSources, setResearchSources] = useState<ResearchSource[]>([
    {
      id: '1',
      name: 'Sea Level Data',
      type: 'folder',
      dateModified: '2024-01-15',
      path: '/sources/sea-level-data',
      expanded: false,
      children: [
        {
          id: '1-1',
          name: 'NOAA_SeaLevel_2020-2024.csv',
          type: 'file',
          size: '25.4 MB',
          dateModified: '2024-01-15',
          path: '/sources/sea-level-data/NOAA_SeaLevel_2020-2024.csv',
          description: 'Historical sea level measurements from NOAA tide gauges',
          tags: ['NOAA', 'sea-level', 'historical']
        }
      ]
    },
    {
      id: '2',
      name: 'Infrastructure Studies',
      type: 'folder',
      dateModified: '2024-01-12',
      path: '/sources/infrastructure',
      expanded: false,
      children: [
        {
          id: '2-1',
          name: 'Vulnerability_Assessment.pdf',
          type: 'file',
          size: '45.2 MB',
          dateModified: '2024-01-12',
          path: '/sources/infrastructure/Vulnerability_Assessment.pdf',
          description: 'Critical infrastructure vulnerability analysis',
          tags: ['infrastructure', 'vulnerability']
        }
      ]
    }
  ]);
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([
    {
      name: 'Documents',
      type: 'folder',
      path: '/Documents',
      expanded: true,
      children: [
        {
          name: 'Research Reports',
          type: 'folder',
          path: '/Documents/Research Reports',
          expanded: true,
          children: [
            { name: 'coastal-erosion-study.md', type: 'file', path: '/Documents/Research Reports/coastal-erosion-study.md' },
            { name: 'infrastructure-assessment.md', type: 'file', path: '/Documents/Research Reports/infrastructure-assessment.md' },
            { name: 'climate-projection-analysis.md', type: 'file', path: '/Documents/Research Reports/climate-projection-analysis.md' }
          ]
        },
        {
          name: 'Technical Reports',
          type: 'folder',
          path: '/Documents/Technical Reports',
          children: [
            { name: 'sea-level-monitoring.pdf', type: 'file', path: '/Documents/Technical Reports/sea-level-monitoring.pdf' },
            { name: 'flood-risk-models.pdf', type: 'file', path: '/Documents/Technical Reports/flood-risk-models.pdf' }
          ]
        }
      ]
    },
    {
      name: 'Datasets',
      type: 'folder',
      path: '/Datasets',
      expanded: true,
      children: [
        {
          name: 'NOAA',
          type: 'folder',
          path: '/Datasets/NOAA',
          children: [
            { name: 'sea-level-data-2023.csv', type: 'file', path: '/Datasets/NOAA/sea-level-data-2023.csv' },
            { name: 'tide-gauge-readings.csv', type: 'file', path: '/Datasets/NOAA/tide-gauge-readings.csv' }
          ]
        },
        {
          name: 'USGS',
          type: 'folder',
          path: '/Datasets/USGS',
          children: [
            { name: 'groundwater-levels.csv', type: 'file', path: '/Datasets/USGS/groundwater-levels.csv' },
            { name: 'coastal-mapping.geojson', type: 'file', path: '/Datasets/USGS/coastal-mapping.geojson' }
          ]
        },
        {
          name: 'Census',
          type: 'folder',
          path: '/Datasets/Census',
          children: [
            { name: 'population-density.csv', type: 'file', path: '/Datasets/Census/population-density.csv' },
            { name: 'housing-vulnerability.csv', type: 'file', path: '/Datasets/Census/housing-vulnerability.csv' }
          ]
        }
      ]
    },
    {
      name: 'Maps',
      type: 'folder',
      path: '/Maps',
      children: [
        { name: 'hampton-roads-base.geojson', type: 'file', path: '/Maps/hampton-roads-base.geojson' },
        { name: 'flood-zones.kml', type: 'file', path: '/Maps/flood-zones.kml' }
      ]
    }
  ]);

  const toggleFolder = (item: FileSystemItem, items: FileSystemItem[]): FileSystemItem[] => {
    return items.map(fileItem => {
      if (fileItem.path === item.path && fileItem.type === 'folder') {
        return { ...fileItem, expanded: !fileItem.expanded };
      }
      if (fileItem.children) {
        return { ...fileItem, children: toggleFolder(item, fileItem.children) };
      }
      return fileItem;
    });
  };

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setFileSystem(prev => toggleFolder(item, prev));
    } else {
      onFileSelect(item);
    }
  };

  // Drag and Drop Functions
  const handleDragStart = (e: React.DragEvent, item: FileSystemItem | ResearchSource, source: 'master' | 'workspace' | 'research') => {
    const dragItem: DragItem = {
      id: 'path' in item ? item.path : item.id,
      type: 'type' in item ? item.type : (item as ResearchSource).type === 'archive' ? 'file' : item.type,
      item,
      source
    };
    setDraggedItem(dragItem);
    e.dataTransfer.setData('text/plain', JSON.stringify(dragItem));
    e.dataTransfer.effectAllowed = 'copyMove';
    
    // Add visual feedback
    const dragImage = document.createElement('div');
    dragImage.innerHTML = `
      <div style="
        background: #2d2d2d; 
        color: white; 
        padding: 4px 8px; 
        border-radius: 4px; 
        font-size: 12px; 
        border: 1px solid #007acc;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${source === 'master' ? '📁' : source === 'research' ? '📚' : '💼'} ${'name' in item ? item.name : (item as ResearchSource).name}
      </div>
    `;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: React.DragEvent, targetPath: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverTarget(targetPath);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetPath: string, targetType: 'master' | 'workspace' | 'research') => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverTarget(null);

    if (!draggedItem) return;

    const isMovingBetweenSections = draggedItem.source !== targetType;
    
    if (isMovingBetweenSections) {
      // Create a copy of the item for the target section
      const newItem: FileSystemItem = {
        name: 'name' in draggedItem.item ? draggedItem.item.name : (draggedItem.item as ResearchSource).name,
        type: draggedItem.type === 'research-source' ? 'file' : draggedItem.type,
        path: `${targetPath}/${('name' in draggedItem.item ? draggedItem.item.name : (draggedItem.item as ResearchSource).name)}`,
        children: draggedItem.type === 'folder' ? [] : undefined
      };

      if (targetType === 'workspace') {
        // Add to workspace files
        setWorkspaceFiles(prev => [...prev, newItem]);
        onWorkspaceFileChange?.(workspaceFiles);
      } else if (targetType === 'master') {
        // Add to master file system
        setFileSystem(prev => [...prev, newItem]);
      }
    }

    setDraggedItem(null);
  };

  const addToWorkspace = (item: FileSystemItem | ResearchSource) => {
    const newWorkspaceItem: FileSystemItem = {
      name: 'name' in item ? item.name : (item as ResearchSource).name,
      type: 'type' in item ? item.type : (item as ResearchSource).type === 'archive' ? 'file' : item.type,
      path: `/workspace/${('name' in item ? item.name : (item as ResearchSource).name)}`,
      children: item.type === 'folder' ? [] : undefined
    };
    
    setWorkspaceFiles(prev => [...prev, newWorkspaceItem]);
    onWorkspaceFileChange?.(workspaceFiles);
  };

  const renderFileSystemItem = (item: FileSystemItem, depth: number = 0, source: 'master' | 'workspace' = 'master') => {
    const isExpanded = item.type === 'folder' && item.expanded;
    const paddingLeft = `${depth * 16 + 8}px`;
    const isDragOver = dragOverTarget === item.path;

    return (
      <div key={item.path}>
        <div 
          className={`flex items-center justify-between py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer text-xs group ${
            isDragOver ? 'bg-blue-500/20 border border-blue-500/50' : ''
          }`}
          style={{ paddingLeft }}
          onClick={() => handleItemClick(item)}
          draggable
          onDragStart={(e) => handleDragStart(e, item, source)}
          onDragOver={(e) => handleDragOver(e, item.path)}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item.path, source)}
        >
          <div className="flex items-center flex-1">
            {item.type === 'folder' && (
              <span className="mr-1">
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </span>
            )}
            {item.type === 'folder' ? (
              <Folder size={14} className="mr-2 text-yellow-500" />
            ) : (
              <File size={14} className="mr-2 text-blue-400" />
            )}
            <span className="text-white">{item.name}</span>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
            {source === 'master' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0" 
                title="Add to workspace"
                onClick={(e) => {
                  e.stopPropagation();
                  addToWorkspace(item);
                }}
              >
                <Copy size={10} />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0" title="More options">
              <MoreHorizontal size={10} />
            </Button>
          </div>
        </div>
        
        {isExpanded && item.children && (
          <div>
            {item.children.map(child => renderFileSystemItem(child, depth + 1, source))}
          </div>
        )}
      </div>
    );
  };

  const filteredFileSystem = fileSystem.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-[#252526] text-white flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[#3e3e3e]">
        <h3 className="text-xs font-semibold mb-2 text-gray-300">EXPLORER</h3>
        
        {/* Search Box */}
        <div className="relative">
          <Search size={12} className="absolute left-2 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-7 pr-2 py-1 text-xs bg-[#3c3c3c] border border-[#3e3e3e] rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#007acc]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* File Tree with Sources Section */}
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          {/* Research Sources Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-blue-400">📚 RESEARCH SOURCES</div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                  onClick={() => {
                    const folderName = prompt('Enter folder name:');
                    if (folderName) {
                      const newFolder: ResearchSource = {
                        id: Date.now().toString(),
                        name: folderName,
                        type: 'folder',
                        dateModified: new Date().toISOString().split('T')[0],
                        path: `/sources/${folderName.toLowerCase().replace(/\s+/g, '-')}`,
                        expanded: false,
                        children: []
                      };
                      setResearchSources(prev => [...prev, newFolder]);
                    }
                  }}
                  title="New Folder"
                >
                  <FolderPlus size={12} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) {
                        const newFiles: ResearchSource[] = Array.from(files).map(file => ({
                          id: Date.now().toString() + Math.random(),
                          name: file.name,
                          type: 'file',
                          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                          dateModified: new Date().toISOString().split('T')[0],
                          path: `/sources/uploads/${file.name}`,
                          description: `Uploaded file: ${file.name}`,
                          tags: ['uploaded']
                        }));
                        setResearchSources(prev => [...prev, ...newFiles]);
                      }
                    };
                    input.click();
                  }}
                  title="Upload Document"
                >
                  <Upload size={12} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                  onClick={() => {
                    const selected = researchSources.filter(source => source.selected);
                    if (selected.length === 0) {
                      alert('Please select files to compress');
                      return;
                    }
                    
                    const archiveName = prompt('Enter archive name:') || 'archive';
                    const newArchive: ResearchSource = {
                      id: Date.now().toString(),
                      name: `${archiveName}.zip`,
                      type: 'archive',
                      size: `${selected.reduce((total, item) => total + parseFloat(item.size || '0'), 0).toFixed(1)} MB`,
                      dateModified: new Date().toISOString().split('T')[0],
                      path: `/sources/archives/${archiveName}.zip`,
                      description: `Compressed archive containing ${selected.length} items`,
                      tags: ['compressed', 'archive']
                    };
                    
                    setResearchSources(prev => [
                      ...prev.filter(source => !source.selected),
                      newArchive
                    ]);
                  }}
                  title="Compress Selected"
                >
                  <Archive size={12} />
                </Button>
              </div>
            </div>
            
            {/* Research Sources Tree */}
            <div className="ml-2 border-l border-[#3e3e3e] pl-2">
              {researchSources.map(item => (
                <div key={item.id} className="mb-1">
                  <div 
                    className={`flex items-center justify-between py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer group ${
                      dragOverTarget === item.path ? 'bg-blue-500/20 border border-blue-500/50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'research')}
                    onDragOver={(e) => handleDragOver(e, item.path)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, item.path, 'research')}
                  >
                    <div className="flex items-center flex-1">
                      <div className="flex items-center mr-2">
                        {item.type === 'folder' && <Folder size={14} className="text-blue-400" />}
                        {item.type === 'file' && <FileText size={14} className="text-gray-400" />}
                        {item.type === 'archive' && <Archive size={14} className="text-yellow-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-white">{item.name}</div>
                        {item.size && <div className="text-xs text-gray-500">{item.size}</div>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0" 
                        title="Add to workspace"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWorkspace(item);
                        }}
                      >
                        <Copy size={10} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0" title="Download">
                        <Download size={10} />
                      </Button>
                    </div>
                  </div>
                  {item.children && item.expanded && (
                    <div className="ml-4">
                      {item.children.map(child => (
                        <div 
                          key={child.id} 
                          className="flex items-center justify-between py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer group"
                          draggable
                          onDragStart={(e) => handleDragStart(e, child, 'research')}
                        >
                          <div className="flex items-center flex-1">
                            <div className="flex items-center mr-2">
                              {child.type === 'file' && <File size={12} className="text-gray-400" />}
                              {child.type === 'archive' && <Archive size={12} className="text-yellow-400" />}
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-white">{child.name}</div>
                              {child.size && <div className="text-xs text-gray-500">{child.size}</div>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-4 w-4 p-0" 
                              title="Add to workspace"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToWorkspace(child);
                              }}
                            >
                              <Copy size={10} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Workspace Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-green-400">
                💼 CURRENT WORKSPACE ({workspaceMode.toUpperCase()})
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 text-gray-400 hover:text-white"
                  title="Clear workspace"
                  onClick={() => {
                    setWorkspaceFiles([]);
                    onWorkspaceFileChange?.([]);
                  }}
                >
                  <Trash2 size={10} />
                </Button>
              </div>
            </div>
            
            <div 
              className={`ml-2 border-l border-[#3e3e3e] pl-2 min-h-[40px] ${
                dragOverTarget === '/workspace' ? 'bg-green-500/20 border border-green-500/50 rounded' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, '/workspace')}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, '/workspace', 'workspace')}
            >
              {workspaceFiles.length === 0 ? (
                <div className="text-xs text-gray-500 py-2 px-2 flex items-center">
                  Drop files here or click <Copy size={10} className="inline mx-1" /> to add to workspace
                </div>
              ) : (
                workspaceFiles.map(item => renderFileSystemItem(item, 0, 'workspace'))
              )}
            </div>
          </div>

          {/* Master Files Section */}
          <div>
            <div className="text-xs font-semibold text-yellow-400 mb-2">📁 MASTER FILES</div>
            {filteredFileSystem.map(item => renderFileSystemItem(item, 0, 'master'))}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="p-2 border-t border-[#3e3e3e] text-xs text-gray-400">
        {fileSystem.reduce((count, item) => {
          const countFiles = (items: FileSystemItem[]): number => {
            return items.reduce((acc, file) => {
              if (file.type === 'file') return acc + 1;
              if (file.children) return acc + countFiles(file.children);
              return acc;
            }, 0);
          };
          return count + countFiles([item]);
        }, 0)} files
      </div>
    </div>
  );
}