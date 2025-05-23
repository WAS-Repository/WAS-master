import React, { useState } from 'react';
import { FolderOpen, Search } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  path?: string;
  icon?: string;
  children?: FileNode[];
  metadata?: {
    location?: string;
    year?: string;
    topic?: string;
  };
}

interface UbuntuFileExplorerProps {
  onFileSelect: (file: FileNode) => void;
}

export default function UbuntuFileExplorer({ onFileSelect }: UbuntuFileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['Hampton Roads Research', 'Documents'])
  );

  const fileTreeData: FileNode = {
    name: 'Hampton Roads Research',
    type: 'folder',
    children: [
      {
        name: 'Documents',
        type: 'folder',
        children: [
          {
            name: 'Research Reports',
            type: 'folder',
            children: [
              {
                name: 'Coastal Erosion Impact Study.pdf',
                type: 'file',
                path: '/documents/research/coastal-erosion.pdf',
                icon: '📄',
                metadata: { location: 'virginia-beach', year: '2023', topic: 'erosion' }
              },
              {
                name: 'Tidal Pattern Analysis Report.pdf',
                type: 'file',
                path: '/documents/research/tidal-patterns.pdf',
                icon: '📄',
                metadata: { location: 'norfolk', year: '2023', topic: 'flooding' }
              }
            ]
          },
          {
            name: 'Technical Reports',
            type: 'folder',
            children: [
              {
                name: 'Storm Water Management Implementation.pdf',
                type: 'file',
                path: '/documents/technical/storm-water.pdf',
                icon: '📋',
                metadata: { location: 'norfolk', year: '2023', topic: 'storm-water' }
              }
            ]
          }
        ]
      },
      {
        name: 'Maps',
        type: 'folder',
        children: [
          {
            name: 'Norfolk Flood Risk Assessment.map',
            type: 'file',
            path: '/maps/norfolk-flood.map',
            icon: '🗺️',
            metadata: { location: 'norfolk', year: '2023', topic: 'flooding' }
          }
        ]
      },
      {
        name: 'Datasets',
        type: 'folder',
        children: [
          {
            name: 'NOAA',
            type: 'folder',
            children: [
              {
                name: 'sea-level-trends.csv',
                type: 'file',
                path: '/datasets/noaa/sea-level.csv',
                icon: '📊',
                metadata: { location: 'norfolk', year: '2023', topic: 'climate' }
              }
            ]
          },
          {
            name: 'USGS',
            type: 'folder',
            children: [
              {
                name: 'coastal-change-database.geojson',
                type: 'file',
                path: '/datasets/usgs/coastal-change.geojson',
                icon: '🌍',
                metadata: { location: 'virginia-beach', year: '2023', topic: 'erosion' }
              }
            ]
          },
          {
            name: 'Census',
            type: 'folder',
            children: [
              {
                name: 'demographics-hampton-roads.json',
                type: 'file',
                path: '/datasets/census/demographics.json',
                icon: '👥',
                metadata: { location: 'norfolk', year: '2020', topic: 'demographics' }
              }
            ]
          }
        ]
      }
    ]
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const renderFileTree = (node: FileNode, depth: number = 0, parentPath: string = ''): React.ReactElement => {
    const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(fullPath);
    
    if (node.type === 'folder') {
      return (
        <div key={fullPath}>
          <div 
            className="flex items-center py-1 px-2 hover:bg-[#37373d] cursor-pointer text-xs text-white transition-colors"
            style={{ paddingLeft: `${8 + depth * 16}px` }}
            onClick={() => toggleFolder(fullPath)}
          >
            <span className="mr-2 text-orange-400">
              {isExpanded ? '📂' : '📁'}
            </span>
            <span className="flex-1 font-medium">{node.name}</span>
            <span className="text-gray-500 text-[10px] ml-2">
              {isExpanded ? '▼' : '▶'}
            </span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map((child) => renderFileTree(child, depth + 1, fullPath))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div 
          key={fullPath}
          className="flex items-center py-1 px-2 hover:bg-[#37373d] cursor-pointer text-xs text-white group transition-colors"
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => onFileSelect(node)}
        >
          <span className="mr-2 text-blue-400">{node.icon}</span>
          <span className="flex-1 truncate">{node.name}</span>
          {node.metadata && (
            <span className="text-gray-500 text-[10px] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {node.metadata.year}
            </span>
          )}
        </div>
      );
    }
  };

  return (
    <div className="w-80 bg-[#252526] border-r border-[#3e3e3e] flex flex-col">
      {/* Explorer Header */}
      <div className="px-4 py-2 text-gray-400 font-semibold border-b border-[#3e3e3e] flex items-center justify-between">
        <span className="text-xs">DOCUMENT EXPLORER</span>
        <Search size={12} />
      </div>
      
      {/* Ubuntu-Style File Tree */}
      <div className="flex-1 overflow-auto bg-[#1e1e1e]">
        {renderFileTree(fileTreeData)}
      </div>
    </div>
  );
}