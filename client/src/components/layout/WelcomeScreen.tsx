import React from 'react';
import { FileText, Search, Palette, Code, FolderOpen, Database, BookOpen, Plus, Github, Settings, Lightbulb, MapPin, Navigation, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  workspaceMode: 'research' | 'story' | 'developer' | 'geographic';
  onAction: (action: string) => void;
}

export default function WelcomeScreen({ workspaceMode, onAction }: WelcomeScreenProps) {
  const getWelcomeConfig = () => {
    switch (workspaceMode) {
      case 'research':
        return {
          title: 'Hampton Roads Research Platform',
          subtitle: 'Research & Analysis Mode',
          icon: <Search size={48} className="text-blue-400" />,
          color: 'text-blue-400',
          startActions: [
            { id: 'new-research', icon: <Plus size={16} />, label: 'New Research Document', desc: 'Create a new research document' },
            { id: 'open-dataset', icon: <Database size={16} />, label: 'Open Dataset', desc: 'Browse and analyze research datasets' },
            { id: 'open-folder', icon: <FolderOpen size={16} />, label: 'Open Research Folder', desc: 'Open existing research project folder' },
            { id: 'search-sources', icon: <Search size={16} />, label: 'Search Research Sources', desc: 'Search through research documents and sources' }
          ],
          walkthroughs: [
            { id: 'fundamentals', icon: <BookOpen size={16} />, label: 'Learn Research Fundamentals', badge: 'New', desc: 'Get started with research tools and workflows' },
            { id: 'data-analysis', icon: <Database size={16} />, label: 'Data Analysis Guide', desc: 'Learn to analyze and visualize research data' },
            { id: 'citations', icon: <FileText size={16} />, label: 'Citation Management', badge: 'Updated', desc: 'Organize and cite research sources effectively' }
          ],
          recent: [
            { name: 'coastal-erosion-study.md', path: '/research/coastal-erosion-study.md' },
            { name: 'sea-level-analysis.md', path: '/research/sea-level-analysis.md' },
            { name: 'Hampton Roads Climate Data', path: '/datasets/hampton-roads-climate' },
            { name: 'NOAA Sea Level Research', path: '/sources/noaa-sea-level' }
          ]
        };
      
      case 'story':
        return {
          title: 'Hampton Roads Story Platform',
          subtitle: 'Visual Storytelling Mode',
          icon: <Palette size={48} className="text-purple-400" />,
          color: 'text-purple-400',
          startActions: [
            { id: 'new-story', icon: <Plus size={16} />, label: 'New Story Project', desc: 'Create a new visual story or narrative' },
            { id: 'open-template', icon: <FileText size={16} />, label: 'Open Story Template', desc: 'Start from a pre-designed story template' },
            { id: 'open-folder', icon: <FolderOpen size={16} />, label: 'Open Story Folder', desc: 'Open existing story project folder' },
            { id: 'import-media', icon: <Database size={16} />, label: 'Import Media Assets', desc: 'Add images, videos, and other media to your story' }
          ],
          walkthroughs: [
            { id: 'storytelling', icon: <Palette size={16} />, label: 'Visual Storytelling Basics', badge: 'New', desc: 'Learn to create compelling visual narratives' },
            { id: 'whiteboard', icon: <Lightbulb size={16} />, label: 'Interactive Whiteboard', desc: 'Use the whiteboard for brainstorming and sketching' },
            { id: 'media-integration', icon: <Database size={16} />, label: 'Media Integration Guide', badge: 'Updated', desc: 'Integrate research data into visual stories' }
          ],
          recent: [
            { name: 'hampton-roads-narrative.md', path: '/stories/hampton-roads-narrative.md' },
            { name: 'community-impact-story.md', path: '/stories/community-impact-story.md' },
            { name: 'Climate Change Visualization', path: '/stories/climate-viz' },
            { name: 'Coastal Communities Story', path: '/stories/coastal-communities' }
          ]
        };
      
      case 'developer':
        return {
          title: 'Hampton Roads Dev Platform',
          subtitle: 'Development & Coding Mode',
          icon: <Code size={48} className="text-green-400" />,
          color: 'text-green-400',
          startActions: [
            { id: 'new-file', icon: <Plus size={16} />, label: 'New File...', desc: 'Create a new code file' },
            { id: 'open-file', icon: <FileText size={16} />, label: 'Open File...', desc: 'Open an existing code file' },
            { id: 'open-folder', icon: <FolderOpen size={16} />, label: 'Open Folder...', desc: 'Open a project folder' },
            { id: 'clone-repo', icon: <Github size={16} />, label: 'Clone Git Repository...', desc: 'Clone a repository from GitHub or other sources' }
          ],
          walkthroughs: [
            { id: 'dev-fundamentals', icon: <Code size={16} />, label: 'Development Fundamentals', badge: 'New', desc: 'Get started with the development environment' },
            { id: 'data-viz', icon: <Database size={16} />, label: 'Data Visualization Development', desc: 'Build custom visualizations for research data' },
            { id: 'api-integration', icon: <Settings size={16} />, label: 'API Integration Guide', badge: 'Updated', desc: 'Connect to external APIs and data sources' }
          ],
          recent: [
            { name: 'data-analysis.py', path: '/dev/data-analysis.py' },
            { name: 'visualization.js', path: '/dev/visualization.js' },
            { name: 'hampton-roads-api', path: '/dev/hampton-roads-api' },
            { name: 'research-dashboard', path: '/dev/research-dashboard' }
          ]
        };
      
      case 'geographic':
        return {
          title: 'Hampton Roads Geographic Platform',
          subtitle: 'Location-Based Data & Research Mode',
          icon: <MapPin size={48} className="text-orange-400" />,
          color: 'text-orange-400',
          startActions: [
            { id: 'search-location', icon: <Search size={16} />, label: 'Search Location Data', desc: 'Find research and data by geographic location' },
            { id: 'browse-map', icon: <Navigation size={16} />, label: 'Browse Interactive Map', desc: 'Explore data through map interface' },
            { id: 'open-gis', icon: <Globe size={16} />, label: 'Open GIS Data', desc: 'Access geographic information system data' },
            { id: 'location-analysis', icon: <Database size={16} />, label: 'Location Analysis', desc: 'Analyze location-based research data' }
          ],
          walkthroughs: [
            { id: 'geographic-basics', icon: <MapPin size={16} />, label: 'Geographic Research Basics', badge: 'New', desc: 'Learn location-based research fundamentals' },
            { id: 'gis-tools', icon: <Globe size={16} />, label: 'GIS Tools & Analysis', desc: 'Use geographic information system tools' },
            { id: 'spatial-data', icon: <Navigation size={16} />, label: 'Spatial Data Integration', badge: 'Updated', desc: 'Work with spatial datasets and coordinates' }
          ],
          recent: [
            { name: 'hampton-roads-localities.geojson', path: '/geographic/hampton-roads-localities.geojson' },
            { name: 'coastal-erosion-map.kml', path: '/geographic/coastal-erosion-map.kml' },
            { name: 'Norfolk Sea Level Data', path: '/geographic/norfolk-sea-level' },
            { name: 'Virginia Beach Infrastructure', path: '/geographic/vb-infrastructure' }
          ]
        };
    }
  };

  const config = getWelcomeConfig();

  return (
    <div className="h-full bg-[#1e1e1e] text-white flex flex-col">
      {/* Tab Header */}
      <div className="h-9 bg-[#252526] flex border-b border-[#3e3e3e]">
        <div className="px-3 py-2 text-white text-xs flex items-center bg-[#1e1e1e] border-t-2 border-t-[#007acc]">
          <div className={`mr-2 ${config.color}`}>
            {workspaceMode === 'research' && <Search size={14} />}
            {workspaceMode === 'story' && <Palette size={14} />}
            {workspaceMode === 'developer' && <Code size={14} />}
            {workspaceMode === 'geographic' && <MapPin size={14} />}
          </div>
          Welcome
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex">
        {/* Left Side - Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              {config.icon}
              <div className="ml-4">
                <h1 className="text-3xl font-light mb-1">{config.title}</h1>
                <p className="text-lg text-gray-400">{config.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Start Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Start</h2>
            <div className="space-y-2">
              {config.startActions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-[#2a2d2e] text-left"
                  onClick={() => onAction(action.id)}
                >
                  <div className="flex items-center">
                    <div className={`mr-3 ${config.color}`}>{action.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-white">{action.label}</div>
                      <div className="text-xs text-gray-400">{action.desc}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Section */}
          <div>
            <h2 className="text-lg font-medium mb-4">Recent</h2>
            <div className="space-y-1">
              {config.recent.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2 hover:bg-[#2a2d2e] text-left"
                  onClick={() => onAction(`open-recent:${item.path}`)}
                >
                  <div className="flex items-center">
                    <FileText size={14} className={`mr-3 ${config.color}`} />
                    <div>
                      <div className="text-sm text-white">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.path}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-2 hover:bg-[#2a2d2e] text-left mt-2"
              onClick={() => onAction('more-recent')}
            >
              <div className="text-sm text-gray-400">More...</div>
            </Button>
          </div>
        </div>

        {/* Right Side - Walkthroughs */}
        <div className="w-80 p-8 border-l border-[#3e3e3e]">
          <h2 className="text-lg font-medium mb-4">Walkthroughs</h2>
          <div className="space-y-3">
            {config.walkthroughs.map((walkthrough) => (
              <Button
                key={walkthrough.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-[#2a2d2e] text-left"
                onClick={() => onAction(`walkthrough:${walkthrough.id}`)}
              >
                <div className="flex items-center">
                  <div className={`mr-3 ${config.color}`}>{walkthrough.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-white">{walkthrough.label}</div>
                      {walkthrough.badge && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                          {walkthrough.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{walkthrough.desc}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#3e3e3e] flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Hampton Roads Research Platform v1.0</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => onAction('settings')}>
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => onAction('help')}>
            Help
          </Button>
        </div>
      </div>
    </div>
  );
}