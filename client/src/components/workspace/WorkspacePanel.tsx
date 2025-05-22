import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, X, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkspacePanelProps {
  title: string;
  children: ReactNode;
  defaultSize?: 'sm' | 'md' | 'lg';
  defaultPosition?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
  isMaximized?: boolean;
  isMinimized?: boolean;
  isDraggable?: boolean;
}

export function WorkspacePanel({
  title,
  children,
  defaultSize = 'md',
  defaultPosition = 'center',
  onClose,
  onMinimize,
  onMaximize,
  className,
  isMaximized = false,
  isMinimized = false,
  isDraggable = true
}: WorkspacePanelProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: 'w-1/3 h-1/3',
    md: 'w-1/2 h-1/2',
    lg: 'w-2/3 h-2/3'
  };

  // Position classes for grid placement
  const positionClasses = {
    left: 'col-start-1 row-start-1 row-span-2',
    right: 'col-start-2 row-start-1 row-span-2',
    top: 'col-start-1 col-span-2 row-start-1',
    bottom: 'col-start-1 col-span-2 row-start-2',
    center: 'col-start-1 col-span-2 row-start-1 row-span-2'
  };

  // Determine final classes
  const panelClasses = cn(
    'border rounded-md overflow-hidden flex flex-col bg-background',
    !isMaximized && !isMinimized && sizeClasses[defaultSize],
    !isMaximized && !isMinimized && positionClasses[defaultPosition],
    isMaximized && 'w-full h-full col-span-full row-span-full',
    isMinimized && 'h-9 overflow-hidden',
    className
  );

  return (
    <div 
      className={panelClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Panel Header */}
      <div 
        className="flex items-center justify-between px-3 py-1 border-b bg-muted/50"
        style={{ cursor: isDraggable ? 'move' : 'default' }}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {isDraggable && <Move size={14} className="opacity-50" />}
          {title}
        </div>
        
        <div className="flex items-center space-x-1">
          {onMinimize && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={onMinimize}
            >
              <Minimize size={14} />
            </Button>
          )}
          
          {onMaximize && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={onMaximize}
            >
              <Maximize size={14} />
            </Button>
          )}
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive" 
              onClick={onClose}
            >
              <X size={14} />
            </Button>
          )}
        </div>
      </div>
      
      {/* Panel Content */}
      <div className="flex-1 overflow-auto p-2">
        {children}
      </div>
    </div>
  );
}