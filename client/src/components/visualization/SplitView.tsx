import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MapView } from './MapView';
import { KnowledgeGraph } from './KnowledgeGraph';
import { ChevronUp, ChevronDown, GanttChart, Map } from 'lucide-react';

/**
 * SplitView component combines the MapView and KnowledgeGraph components
 * in a split layout that adapts for mobile devices.
 * On desktop, it can show both views side by side.
 * On mobile, it shows a split screen with MapView on top and KnowledgeGraph below,
 * with adjustable split point.
 */
export function SplitView() {
  const isMobile = useIsMobile();
  const [splitRatio, setSplitRatio] = useState(0.5); // 50/50 split by default
  const [activeView, setActiveView] = useState<'map' | 'graph' | 'split'>('split');

  // Set default active view based on device
  useEffect(() => {
    if (isMobile) {
      setActiveView('split');
    } else {
      setActiveView('split');
    }
  }, [isMobile]);

  // Allow adjusting the split point on mobile
  const handleAdjustSplit = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setSplitRatio(prev => Math.min(prev + 0.1, 0.9));
    } else {
      setSplitRatio(prev => Math.max(prev - 0.1, 0.1));
    }
  };

  // Switch between map/graph/split views
  const toggleView = (view: 'map' | 'graph' | 'split') => {
    setActiveView(view);
  };

  return (
    <div className="h-full flex flex-col">
      {/* View toggle controls for mobile */}
      {isMobile && (
        <div className="flex justify-center p-1 border-b border-slate-700 bg-slate-900">
          <div className="flex rounded-md bg-slate-800 p-0.5">
            <Button
              variant={activeView === 'map' ? 'default' : 'ghost'}
              size="sm"
              className={`h-7 px-2 text-xs ${activeView === 'map' ? 'bg-slate-700' : 'bg-transparent text-slate-400'}`}
              onClick={() => toggleView('map')}
            >
              <Map className="h-3 w-3 mr-1" />
              Map
            </Button>
            <Button
              variant={activeView === 'split' ? 'default' : 'ghost'}
              size="sm"
              className={`h-7 px-2 text-xs ${activeView === 'split' ? 'bg-slate-700' : 'bg-transparent text-slate-400'}`}
              onClick={() => toggleView('split')}
            >
              Split
            </Button>
            <Button
              variant={activeView === 'graph' ? 'default' : 'ghost'}
              size="sm"
              className={`h-7 px-2 text-xs ${activeView === 'graph' ? 'bg-slate-700' : 'bg-transparent text-slate-400'}`}
              onClick={() => toggleView('graph')}
            >
              <GanttChart className="h-3 w-3 mr-1" />
              Graph
            </Button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-grow relative">
        {/* Map View */}
        {(activeView === 'map' || activeView === 'split') && (
          <div 
            className={`${
              activeView === 'map' ? 'h-full' : 
              activeView === 'split' ? (
                isMobile ? `absolute top-0 left-0 right-0 z-10` : 'h-1/2 border-b border-slate-700'
              ) : 'hidden'
            }`}
            style={
              activeView === 'split' && isMobile 
                ? { height: `${splitRatio * 100}%` } 
                : {}
            }
          >
            <MapView />
          </div>
        )}

        {/* Graph View */}
        {(activeView === 'graph' || activeView === 'split') && (
          <div 
            className={`${
              activeView === 'graph' ? 'h-full' : 
              activeView === 'split' ? (
                isMobile ? 'absolute bottom-0 left-0 right-0 z-0' : 'h-1/2'
              ) : 'hidden'
            }`}
            style={
              activeView === 'split' && isMobile 
                ? { height: `${(1 - splitRatio) * 100}%` } 
                : {}
            }
          >
            <KnowledgeGraph />
          </div>
        )}

        {/* Split adjuster for mobile */}
        {isMobile && activeView === 'split' && (
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-center" style={{ top: `calc(${splitRatio * 100}% - 12px)` }}>
            <div className="flex bg-slate-900 border border-slate-700 rounded-full shadow-lg">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => handleAdjustSplit('up')}
              >
                <ChevronUp className="h-4 w-4 text-slate-400" />
              </Button>
              <div className="w-px bg-slate-700"></div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => handleAdjustSplit('down')}
              >
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}