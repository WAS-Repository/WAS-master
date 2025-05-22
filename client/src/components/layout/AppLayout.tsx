import { ReactNode, useState, useRef, useCallback, useEffect } from "react";
import Terminal from "./Terminal";
import { Sun, Moon, Settings, Menu, Grid3X3, X, Search, PlusCircle, Palette, Database, FileText, Shield } from "lucide-react";
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
  const [isTerminalCollapsed, setTerminalCollapsed] = useState(isMobile);
  const [terminalHeight, setTerminalHeight] = useState(isMobile ? 150 : 200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isDraggingTerminal = useRef(false);
  const initialY = useRef(0);
  const initialHeight = useRef(0);

  // Update layout when screen size changes
  useEffect(() => {
    if (isMobile) {
      setTerminalCollapsed(true);
    }
  }, [isMobile]);

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
    <div className="flex flex-col h-screen">
      {/* Header/Navbar */}
      <div className="flex justify-between items-center px-3 py-2 bg-bg-panel border-b border-border-color">
        {/* Branding and Menu Button */}
        <div className="flex items-center">
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2" onClick={toggleMobileMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center justify-center h-8 w-8 mr-3 bg-accent rounded-md">
            <Grid3X3 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold hidden sm:block">Hampton Roads Research Interface</h1>
        </div>
        
        {/* Main Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <div className="flex">
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
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" title="Documents">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" title="Database">
            <Database className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" title="Security">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="h-6 w-[1px] bg-border mx-1 sm:mx-2"></div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 sm:h-9 sm:w-9" title="Toggle Theme">
            {theme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" title="Color Scheme">
            <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" title="Settings">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center text-bg-dark">
            <span className="font-medium text-sm sm:text-base">JD</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}>
          <div className="w-64 h-full bg-bg-panel p-4" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={toggleMobileMenu}>
              <X className="h-5 w-5" />
            </Button>
            <div className="pt-8 space-y-4">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <FileText className="mr-2 h-4 w-4" /> Documents
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Database className="mr-2 h-4 w-4" /> Database
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Shield className="mr-2 h-4 w-4" /> Security
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {children}
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