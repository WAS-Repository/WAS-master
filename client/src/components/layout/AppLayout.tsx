import { ReactNode, useState, useRef, useCallback, useEffect } from "react";
import Sidebar from "./Sidebar";
import Terminal from "./Terminal";
import { Sun, Moon, Settings, Menu, Grid3X3, X, Search, PlusCircle, Palette } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  const [isTerminalCollapsed, setTerminalCollapsed] = useState(isMobile);
  const [terminalHeight, setTerminalHeight] = useState(isMobile ? 150 : 200);
  const [sidebarWidth, setSidebarWidth] = useState(isMobile ? 0 : 240);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isDraggingSidebar = useRef(false);
  const isDraggingTerminal = useRef(false);
  const initialX = useRef(0);
  const initialY = useRef(0);
  const initialWidth = useRef(0);
  const initialHeight = useRef(0);

  // Update layout when screen size changes
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
      setTerminalCollapsed(true);
      setSidebarWidth(0);
    } else if (sidebarWidth === 0) {
      setSidebarWidth(240);
    }
  }, [isMobile]);

  const startSidebarResize = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    isDraggingSidebar.current = true;
    initialX.current = e.clientX;
    initialWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleSidebarResize);
    document.addEventListener('mouseup', stopSidebarResize);
    e.preventDefault();
  }, [sidebarWidth, isMobile]);

  const handleSidebarResize = useCallback((e: MouseEvent) => {
    if (isDraggingSidebar.current) {
      const delta = e.clientX - initialX.current;
      const newWidth = Math.max(48, Math.min(600, initialWidth.current + delta));
      setSidebarWidth(newWidth);
    }
  }, []);

  const stopSidebarResize = useCallback(() => {
    isDraggingSidebar.current = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', handleSidebarResize);
    document.removeEventListener('mouseup', stopSidebarResize);
  }, [handleSidebarResize]);

  const startTerminalResize = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    isDraggingTerminal.current = true;
    initialY.current = e.clientY;
    initialHeight.current = terminalHeight;
    document.body.style.cursor = 'row-resize';
    document.addEventListener('mousemove', handleTerminalResize);
    document.addEventListener('mouseup', stopTerminalResize);
    e.preventDefault();
  }, [terminalHeight, isMobile]);

  const handleTerminalResize = useCallback((e: MouseEvent) => {
    if (isDraggingTerminal.current) {
      const delta = initialY.current - e.clientY;
      const newHeight = Math.max(40, Math.min(500, initialHeight.current + delta));
      setTerminalHeight(newHeight);
    }
  }, []);

  const stopTerminalResize = useCallback(() => {
    isDraggingTerminal.current = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', handleTerminalResize);
    document.removeEventListener('mouseup', stopTerminalResize);
  }, [handleTerminalResize]);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTerminal = () => {
    setTerminalCollapsed(!isTerminalCollapsed);
  };

  return (
    <div className="flex flex-col h-screen bg-bg-dark text-text-primary">
      {/* Header/Toolbar */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-bg-panel border-b border-border-color">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
          
          {/* App Logo & Time */}
          <div className="flex items-center mr-2 sm:mr-4">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center mr-2">
              <Grid3X3 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-base sm:text-xl font-medium truncate max-w-[150px] sm:max-w-full">
              {new Date().toLocaleTimeString()}
            </h1>
          </div>
          
          {/* Main Navigation - Hide on Mobile */}
          <div className="hidden md:flex space-x-2 lg:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded">File</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <Search className="h-4 w-4 mr-2" />
                  Find Documents
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Source
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New Project</DropdownMenuItem>
                <DropdownMenuItem>Open...</DropdownMenuItem>
                <DropdownMenuItem>Save</DropdownMenuItem>
                <DropdownMenuItem>Export Results</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded">Edit</Button>
            <Button variant="ghost" className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded">View</Button>
            <Button variant="ghost" className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded">Help</Button>
          </div>
        </div>
        
        {/* User Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 sm:h-9 sm:w-9">
            {theme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
            <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center text-bg-dark">
            <span className="font-medium text-sm sm:text-base">JD</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}></div>
      )}
      
      <div className="flex-grow flex overflow-hidden relative">
        {/* Sidebar */}
        <div className={`${isMobile ? 'absolute z-50 h-full' : ''} ${mobileMenuOpen || !isMobile ? 'block' : 'hidden'}`}>
          <Sidebar 
            width={isMobile ? 280 : sidebarWidth} 
            isCollapsed={!mobileMenuOpen && isSidebarCollapsed} 
            onToggleCollapse={() => {
              if (!isMobile) {
                setSidebarCollapsed(!isSidebarCollapsed);
              } else {
                setMobileMenuOpen(false);
              }
            }} 
          />
        </div>
        
        {/* Sidebar Resizer - Hide on Mobile */}
        {!isMobile && !isSidebarCollapsed && (
          <div 
            className="w-1 cursor-col-resize bg-border-color hover:bg-primary transition-colors" 
            onMouseDown={startSidebarResize}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
      
      {/* Terminal Control */}
      <div className="flex justify-center">
        <button 
          className="px-3 py-0.5 text-xs bg-bg-panel rounded-t-md border-t border-l border-r border-border-color"
          onClick={toggleTerminal}
        >
          {isTerminalCollapsed ? 'Show Terminal' : 'Hide Terminal'}
        </button>
      </div>
      
      {/* Terminal Resizer - Hide on Mobile */}
      {!isMobile && !isTerminalCollapsed && (
        <div 
          className="h-1 cursor-row-resize bg-border-color hover:bg-primary transition-colors" 
          onMouseDown={startTerminalResize}
        />
      )}
      
      {/* Terminal */}
      {!isTerminalCollapsed && (
        <Terminal height={terminalHeight} />
      )}
    </div>
  );
}
