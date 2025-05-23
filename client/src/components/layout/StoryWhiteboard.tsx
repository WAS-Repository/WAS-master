import React, { useState } from 'react';
import { Palette, Plus, Square, Circle, Type, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhiteboardElement {
  id: string;
  type: 'text' | 'rectangle' | 'circle' | 'sticky';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
}

interface StoryWhiteboardProps {
  elements: WhiteboardElement[];
  onChange: (elements: WhiteboardElement[]) => void;
}

export default function StoryWhiteboard({ elements, onChange }: StoryWhiteboardProps) {
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'rectangle' | 'circle' | 'sticky'>('select');
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === 'select') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: WhiteboardElement = {
      id: Date.now().toString(),
      type: selectedTool === 'sticky' ? 'text' : selectedTool,
      content: selectedTool === 'text' || selectedTool === 'sticky' ? 'Click to edit...' : '',
      x,
      y,
      width: selectedTool === 'rectangle' ? 120 : selectedTool === 'circle' ? 80 : undefined,
      height: selectedTool === 'rectangle' ? 80 : selectedTool === 'circle' ? 80 : undefined,
      color: selectedTool === 'sticky' ? '#ffeb3b' : '#007acc'
    };

    onChange([...elements, newElement]);
  };

  const updateElement = (id: string, updates: Partial<WhiteboardElement>) => {
    onChange(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    onChange(elements.filter(el => el.id !== id));
  };

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      {/* Whiteboard Toolbar */}
      <div className="h-9 bg-[#252526] flex items-center justify-between px-3 py-1 border-b border-[#3e3e3e]">
        <div className="flex items-center">
          <Palette size={14} className="mr-2" />
          <span className="text-xs font-semibold">Story Whiteboard</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 ${selectedTool === 'select' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSelectedTool('select')}
            title="Select"
          >
            <Move size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 ${selectedTool === 'text' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSelectedTool('text')}
            title="Text"
          >
            <Type size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 ${selectedTool === 'rectangle' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSelectedTool('rectangle')}
            title="Rectangle"
          >
            <Square size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 ${selectedTool === 'circle' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSelectedTool('circle')}
            title="Circle"
          >
            <Circle size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 ${selectedTool === 'sticky' ? 'bg-[#007acc]' : ''}`}
            onClick={() => setSelectedTool('sticky')}
            title="Sticky Note"
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>
      
      {/* Whiteboard Canvas */}
      <div 
        className="flex-1 relative overflow-hidden bg-[#1e1e1e] cursor-crosshair"
        onClick={handleCanvasClick}
        style={{ 
          backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Sample Storyboard Elements */}
        <div className="absolute top-4 left-4 bg-[#ffeb3b] text-black p-2 rounded shadow-lg w-32 text-xs">
          <div className="font-semibold mb-1">Scene 1</div>
          <div>Introduction: Hampton Roads coastal challenges</div>
        </div>
        
        <div className="absolute top-4 left-40 bg-[#4caf50] text-white p-2 rounded shadow-lg w-32 text-xs">
          <div className="font-semibold mb-1">Scene 2</div>
          <div>Data visualization: Sea level trends</div>
        </div>
        
        <div className="absolute top-4 left-76 bg-[#f44336] text-white p-2 rounded shadow-lg w-32 text-xs">
          <div className="font-semibold mb-1">Scene 3</div>
          <div>Impact analysis: Infrastructure at risk</div>
        </div>
        
        <div className="absolute top-24 left-4 bg-[#9c27b0] text-white p-2 rounded shadow-lg w-32 text-xs">
          <div className="font-semibold mb-1">Scene 4</div>
          <div>Solutions: Adaptation strategies</div>
        </div>
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
             refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
            </marker>
          </defs>
          <line x1="136" y1="32" x2="160" y2="32" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="296" y1="32" x2="320" y2="32" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="68" y1="56" x2="68" y2="88" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
        </svg>
        
        {/* Render Dynamic Elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            className="absolute cursor-pointer"
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedTool === 'select') {
                // Handle selection
              }
            }}
          >
            {element.type === 'text' && (
              <input
                type="text"
                value={element.content}
                onChange={(e) => updateElement(element.id, { content: e.target.value })}
                className="bg-transparent text-white text-xs border border-[#007acc] p-1 rounded"
                style={{ color: element.color }}
              />
            )}
            {element.type === 'rectangle' && (
              <div
                className="border-2 rounded"
                style={{
                  borderColor: element.color,
                  width: element.width,
                  height: element.height,
                }}
              />
            )}
            {element.type === 'circle' && (
              <div
                className="border-2 rounded-full"
                style={{
                  borderColor: element.color,
                  width: element.width,
                  height: element.height,
                }}
              />
            )}
          </div>
        ))}
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-4 text-gray-400 text-xs">
          <div>💡 Click tools above to add elements to your storyboard</div>
          <div>🎨 Create visual narratives for your research findings</div>
        </div>
      </div>
      
      {/* Status */}
      <div className="h-6 bg-[#252526] border-t border-[#3e3e3e] flex items-center justify-between px-3 text-xs text-gray-400">
        <span>Elements: {elements.length}</span>
        <span>Tool: {selectedTool}</span>
      </div>
    </div>
  );
}