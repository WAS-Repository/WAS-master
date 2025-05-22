import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SearchFeature } from '@/components/search/SearchFeature';
import { 
  Search, 
  Clock,
  Palette,
  Check
} from 'lucide-react';
import IDEWorkspace from '../workspace/IDEWorkspace';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Color scheme definitions - each theme has main colors that will be used
type ColorScheme = {
  name: string;
  id: string;
  mainColor: string;
  accentColor: string;
  bgColor: string;
  bgAltColor: string;
  borderColor: string;
};

const colorSchemes: ColorScheme[] = [
  {
    name: "Matrix Green",
    id: "matrix",
    mainColor: "#33ff33",
    accentColor: "#ff00ff",
    bgColor: "#000000",
    bgAltColor: "#001100",
    borderColor: "#22dd22"
  },
  {
    name: "Cyberpunk Blue",
    id: "cyberpunk",
    mainColor: "#00ccff",
    accentColor: "#ff3366",
    bgColor: "#000022",
    bgAltColor: "#000044",
    borderColor: "#0077aa"
  },
  {
    name: "Retro Amber",
    id: "amber",
    mainColor: "#ffb000",
    accentColor: "#ff3300",
    bgColor: "#1a1000",
    bgAltColor: "#221500",
    borderColor: "#cc7700"
  },
  {
    name: "Tron Legacy",
    id: "tron",
    mainColor: "#aacfd1",
    accentColor: "#ff9c00",
    bgColor: "#05080d",
    bgAltColor: "#0b131c",
    borderColor: "#6fc3df"
  },
  {
    name: "Blood Red",
    id: "blood",
    mainColor: "#ff0000",
    accentColor: "#770000",
    bgColor: "#0a0000",
    bgAltColor: "#110000",
    borderColor: "#aa0000"
  }
];

/**
 * WorkspaceLayout component creates a sci-fi terminal-like interface based on the provided design
 * that displays document visualization with various panels like map view, knowledge graph, etc.
 */
export default function WorkspaceLayout() {
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [colorScheme, setColorScheme] = useState<ColorScheme>(colorSchemes[0]);
  const [showColorPicker, setColorPicker] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  
  // Simulate real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM:SS with leading zeros
  const formatTime = (date: Date) => {
    return [
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
      date.getSeconds().toString().padStart(2, '0')
    ].join(':');
  };

  // Format date as MM/DD/YY
  const formatDate = (date: Date) => {
    return [
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0'),
      date.getFullYear().toString().slice(2)
    ].join('/');
  };

  // Effect to sync focus mode with parent component
  useEffect(() => {
    // Check if we can access the parent document to find focus-mode class
    try {
      const isFocusModeActive = document.documentElement.classList.contains('focus-mode');
      if (isFocusModeActive !== focusMode) {
        setFocusMode(isFocusModeActive);
      }
    } catch (e) {
      // Ignore any errors that might occur when checking document
    }
  }, []);

  // Apply the main container background color from the color scheme
  return (
    <div className={`h-full flex flex-col overflow-hidden font-mono ${focusMode ? 'focus-mode-content' : ''}`} 
      style={{ 
        backgroundColor: colorScheme.bgColor,
        color: colorScheme.mainColor
      }}>
      
      {/* Main content area with grid layout */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Main content grid layout */}
        <div className="flex-1 flex flex-col">
          {/* Header bar */}
          <div className={`flex p-2 border-b ${focusMode ? 'content-header' : ''}`} 
            style={{ 
              borderColor: colorScheme.borderColor, 
              backgroundColor: colorScheme.bgColor 
            }}>
            <div className="flex-1 flex justify-end items-center">
              {/* Empty header bar - theme button moved to AppLayout */}
            </div>
          </div>
          
          {/* Multi-pane IDE-like Workspace */}
          <div className="flex flex-1">
            <div className="flex-1 relative">
              {/* Import and use our new IDE workspace component */}
              <IDEWorkspace />
              
              {/* In Focus Mode, we add a simple indicator in the top-right */}
              {focusMode && (
                <div className="absolute top-2 right-2 focus-mode-indicator">
                  Focus Mode (Alt+F to exit)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}