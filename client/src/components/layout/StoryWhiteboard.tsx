import React, { useState } from 'react';
import { Palette, Plus, Square, Circle, Type, Move, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tldraw, createTLStore, defaultShapeUtils, getSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';

interface StoryWhiteboardProps {
  elements: any[];
  onChange: (elements: any[]) => void;
}

export default function StoryWhiteboard({ elements, onChange }: StoryWhiteboardProps) {
  const [store] = useState(() => createTLStore({ 
    shapeUtils: defaultShapeUtils
  }));

  // Auto-save when tldraw store changes
  React.useEffect(() => {
    const handleStoreChange = () => {
      const snapshot = getSnapshot(store);
      onChange([snapshot]); // Save the tldraw snapshot
    };

    const unsubscribe = store.listen(handleStoreChange);
    return () => unsubscribe();
  }, [store, onChange]);

  const handleSaveStoryboard = () => {
    const snapshot = getSnapshot(store);
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `storyboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportImage = async () => {
    // This would export the canvas as an image
    console.log('Export storyboard as image');
  };

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      {/* Enhanced Storyboard Toolbar */}
      <div className="h-9 bg-[#252526] flex items-center justify-between px-3 py-1 border-b border-[#3e3e3e]">
        <div className="flex items-center">
          <Palette size={14} className="mr-2" />
          <span className="text-xs font-semibold">Tldraw Storyboard</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 py-0 rounded-sm text-xs hover:bg-[#3e3e3e]"
            onClick={handleSaveStoryboard}
            title="Save Storyboard"
          >
            <Save size={12} className="mr-1" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 py-0 rounded-sm text-xs hover:bg-[#3e3e3e]"
            onClick={handleExportImage}
            title="Export as Image"
          >
            <Download size={12} className="mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Tldraw Canvas */}
      <div className="flex-1 relative">
        <Tldraw 
          store={store}
          className="tldraw-storyboard"
        />
        
        {/* Instructions Overlay */}
        <div className="absolute bottom-4 left-4 bg-[#252526] border border-[#3e3e3e] rounded p-2 text-xs text-gray-300 pointer-events-none">
          <div>🎨 Professional storyboarding with tldraw</div>
          <div>✏️ Draw, annotate, and create visual narratives</div>
          <div>📐 Full suite of drawing and diagramming tools</div>
        </div>
      </div>
      
      {/* Status */}
      <div className="h-6 bg-[#252526] border-t border-[#3e3e3e] flex items-center justify-between px-3 text-xs text-gray-400">
        <span>Professional Drawing Canvas</span>
        <span>Powered by tldraw</span>
      </div>
    </div>
  );
}