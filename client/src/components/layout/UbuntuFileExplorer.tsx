import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Search } from 'lucide-react';

interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemItem[];
  expanded?: boolean;
  path: string;
}

interface UbuntuFileExplorerProps {
  onFileSelect: (file: FileSystemItem) => void;
}

export default function UbuntuFileExplorer({ onFileSelect }: UbuntuFileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
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

  const renderFileSystemItem = (item: FileSystemItem, depth: number = 0) => {
    const isExpanded = item.type === 'folder' && item.expanded;
    const paddingLeft = `${depth * 16 + 8}px`;

    return (
      <div key={item.path}>
        <div 
          className="flex items-center py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer text-xs"
          style={{ paddingLeft }}
          onClick={() => handleItemClick(item)}
        >
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
        
        {isExpanded && item.children && (
          <div>
            {item.children.map(child => renderFileSystemItem(child, depth + 1))}
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

      {/* File Tree */}
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          <div className="text-xs font-semibold text-gray-400 mb-2">HAMPTON ROADS RESEARCH</div>
          {filteredFileSystem.map(item => renderFileSystemItem(item))}
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