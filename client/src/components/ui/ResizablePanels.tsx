import React, { useRef, useState, useCallback, ReactNode } from 'react';

interface ResizablePanelsProps {
  children: ReactNode[];
  direction?: 'horizontal' | 'vertical';
  initialSizes?: number[];
  minSizes?: number[];
  className?: string;
}

const ResizablePanels: React.FC<ResizablePanelsProps> = ({
  children,
  direction = 'horizontal',
  initialSizes,
  minSizes,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDivider, setActiveDivider] = useState<number | null>(null);
  const [sizes, setSizes] = useState<number[]>(
    initialSizes || children.map(() => 100 / children.length)
  );
  
  const minSizesWithDefaults = minSizes || children.map(() => 10);
  
  const startResize = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveDivider(index);
    
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerSize = direction === 'horizontal' ? containerRect.width : containerRect.height;
      
      // Calculate the position as a percentage
      let position: number;
      if (direction === 'horizontal') {
        position = ((e.clientX - containerRect.left) / containerSize) * 100;
      } else {
        position = ((e.clientY - containerRect.top) / containerSize) * 100;
      }
      
      // Make sure position is within bounds
      position = Math.max(0, Math.min(100, position));
      
      const newSizes = [...sizes];
      
      // Check if the new sizes would be below minimum
      let leftPanelNewSize = position;
      let rightPanelNewSize = sizes[index] + sizes[index + 1] - position;
      
      const leftPanelMinSize = minSizesWithDefaults[index];
      const rightPanelMinSize = minSizesWithDefaults[index + 1];
      
      if (leftPanelNewSize < leftPanelMinSize) {
        leftPanelNewSize = leftPanelMinSize;
        rightPanelNewSize = sizes[index] + sizes[index + 1] - leftPanelMinSize;
      }
      
      if (rightPanelNewSize < rightPanelMinSize) {
        rightPanelNewSize = rightPanelMinSize;
        leftPanelNewSize = sizes[index] + sizes[index + 1] - rightPanelMinSize;
      }
      
      newSizes[index] = leftPanelNewSize;
      newSizes[index + 1] = rightPanelNewSize;
      
      setSizes(newSizes);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveDivider(null);
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [direction, sizes, minSizesWithDefaults]);
  
  const renderDivider = (index: number) => {
    return (
      <div
        key={`divider-${index}`}
        className={`${
          direction === 'horizontal' 
            ? 'w-1 cursor-col-resize bg-border-color hover:bg-primary' 
            : 'h-1 cursor-row-resize bg-border-color hover:bg-primary'
        } ${activeDivider === index ? 'bg-primary' : ''} transition-colors`}
        onMouseDown={(e) => startResize(index, e)}
      />
    );
  };
  
  const renderPanels = () => {
    const elements: JSX.Element[] = [];
    
    children.forEach((child, i) => {
      // Add the panel
      elements.push(
        <div
          key={`panel-${i}`}
          className="overflow-hidden"
          style={{
            [direction === 'horizontal' ? 'width' : 'height']: `${sizes[i]}%`,
          }}
        >
          {child}
        </div>
      );
      
      // Add divider if not the last panel
      if (i < children.length - 1) {
        elements.push(renderDivider(i));
      }
    });
    
    return elements;
  };
  
  return (
    <div
      ref={containerRef}
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} ${className}`}
    >
      {renderPanels()}
    </div>
  );
};

export default ResizablePanels;
