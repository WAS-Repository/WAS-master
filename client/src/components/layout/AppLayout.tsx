import { ReactNode, useState, useRef, useCallback, useEffect } from "react";
import { 
  Sun, Moon, Settings, Menu, Grid3X3, X, Search, PlusCircle, Palette, 
  Database, FileText, Shield, Eye
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [autoFocusEnabled, setAutoFocusEnabled] = useState(false);
  const [autoFocusTimer, setAutoFocusTimer] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'graph' | 'document' | 'split' | 'funding'>('document');

  // Update layout when screen size changes
  useEffect(() => {
    // Mobile-specific layout adjustments can go here if needed
  }, [isMobile]);
  
  // Setup keyboard shortcuts for focus mode and view changes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+F to toggle focus mode
      if (e.altKey && e.key === 'f') {
        setFocusMode(prev => !prev);
      }
      
      // View shortcuts (Alt + key)
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'm': // Map View
            setActiveView('map');
            break;
          case 'g': // Graph View
            setActiveView('graph');
            break;
          case 'd': // Document View
            setActiveView('document');
            break;
          case 's': // Split View
            setActiveView('split');
            break;
          case 'p': // Public Funding Data
            setActiveView('funding');
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Auto focus mode after period of inactivity
  useEffect(() => {
    // Only set up the timer if auto-focus is enabled and we're not already in focus mode
    if (autoFocusEnabled && !focusMode) {
      // Start a timer - after 5 minutes of inactivity, enter focus mode
      const timer = window.setTimeout(() => {
        setFocusMode(true);
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
      
      setAutoFocusTimer(timer);
      
      // Reset timer when user interacts with the page
      const resetTimer = () => {
        if (autoFocusTimer !== null) {
          window.clearTimeout(autoFocusTimer);
          
          // Start a new timer
          const newTimer = window.setTimeout(() => {
            setFocusMode(true);
          }, 5 * 60 * 1000);
          
          setAutoFocusTimer(newTimer);
        }
      };
      
      // Add event listeners for user activity
      document.addEventListener('mousemove', resetTimer);
      document.addEventListener('keydown', resetTimer);
      document.addEventListener('click', resetTimer);
      
      return () => {
        if (autoFocusTimer !== null) {
          window.clearTimeout(autoFocusTimer);
        }
        document.removeEventListener('mousemove', resetTimer);
        document.removeEventListener('keydown', resetTimer);
        document.removeEventListener('click', resetTimer);
      };
    } else if (!autoFocusEnabled && autoFocusTimer !== null) {
      // Clear the timer if auto-focus is disabled
      window.clearTimeout(autoFocusTimer);
      setAutoFocusTimer(null);
    }
  }, [autoFocusEnabled, autoFocusTimer, focusMode]);

  // Terminal resize functionality has been moved to the integrated interface
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Create class names based on focus mode
  const headerClasses = focusMode 
    ? "flex justify-between items-center px-3 py-2 bg-bg-panel border-b border-border-color opacity-0 hover:opacity-100 transition-opacity duration-300" 
    : "flex justify-between items-center px-3 py-2 bg-bg-panel border-b border-border-color";
    
  return (
    <div className={`flex flex-col h-screen ${focusMode ? 'focus-mode' : ''}`}>
      {/* Navigation now handled by the integrated VS Code-style interface */}
      
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {children}
      </div>
      
      {/* Terminal now integrated into the main interface */}
    </div>
  );
}