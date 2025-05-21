import { ReactNode, useState, useRef, useCallback } from "react";
import Sidebar from "./Sidebar";
import Terminal from "./Terminal";
import { Sun, Moon, Settings, Search, Grid3X3 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { theme, setTheme } = useTheme();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  
  const isDraggingSidebar = useRef(false);
  const isDraggingTerminal = useRef(false);
  const initialX = useRef(0);
  const initialY = useRef(0);
  const initialWidth = useRef(0);
  const initialHeight = useRef(0);

  const startSidebarResize = useCallback((e: React.MouseEvent) => {
    isDraggingSidebar.current = true;
    initialX.current = e.clientX;
    initialWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleSidebarResize);
    document.addEventListener('mouseup', stopSidebarResize);
    e.preventDefault();
  }, [sidebarWidth]);

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
    isDraggingTerminal.current = true;
    initialY.current = e.clientY;
    initialHeight.current = terminalHeight;
    document.body.style.cursor = 'row-resize';
    document.addEventListener('mousemove', handleTerminalResize);
    document.addEventListener('mouseup', stopTerminalResize);
    e.preventDefault();
  }, [terminalHeight]);

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

  return (
    <div className="flex flex-col h-screen bg-bg-dark text-text-primary">
      {/* Header/Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-panel border-b border-border-color">
        <div className="flex items-center">
          {/* App Logo */}
          <div className="flex items-center mr-4">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center mr-2">
              <Grid3X3 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-medium">Hampton Roads Research Graph</h1>
          </div>
          
          {/* Main Navigation */}
          <div className="flex space-x-4">
            <Button variant="ghost" className="px-3 py-1 text-sm rounded">File</Button>
            <Button variant="ghost" className="px-3 py-1 text-sm rounded">Edit</Button>
            <Button variant="ghost" className="px-3 py-1 text-sm rounded">View</Button>
            <Button variant="ghost" className="px-3 py-1 text-sm rounded">Help</Button>
          </div>
        </div>
        
        {/* User Controls */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-bg-dark">
            <span className="font-medium">JD</span>
          </div>
        </div>
      </div>
      
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          width={sidebarWidth} 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        {/* Sidebar Resizer */}
        <div 
          className="w-1 cursor-col-resize bg-border-color hover:bg-primary transition-colors" 
          onMouseDown={startSidebarResize}
        />
        
        {/* Main Content */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
      
      {/* Terminal Resizer */}
      <div 
        className="h-1 cursor-row-resize bg-border-color hover:bg-primary transition-colors" 
        onMouseDown={startTerminalResize}
      />
      
      {/* Terminal */}
      <Terminal height={terminalHeight} />
    </div>
  );
}
