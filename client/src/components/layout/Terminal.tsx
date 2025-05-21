import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TerminalProps {
  height: number;
}

type TerminalEntry = {
  type: 'input' | 'output' | 'info' | 'error' | 'success';
  content: string;
  timestamp: Date;
};

export default function Terminal({ height }: TerminalProps) {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { 
      type: 'info', 
      content: 'Hampton Roads Research Graph Agent v1.0.0', 
      timestamp: new Date() 
    },
    { 
      type: 'info', 
      content: 'Type \'help\' for a list of available commands.', 
      timestamp: new Date() 
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [suggestionCommands, setSuggestionCommands] = useState([
    'search "coastal erosion" AND locality:Norfolk',
    'extract metadata doc:1 --format=json',
    'graph add doc:1 --connect-to="locality:Norfolk,locality:Hampton"',
    'map show-docs --filter="type:engineering" --locality="Norfolk"',
    'connect doc:5 doc:12 --relation="references"',
    'export graph --format=graphml'
  ]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [isTypingSuggestion, setIsTypingSuggestion] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle command submission
  const handleSubmitCommand = async () => {
    if (!currentCommand.trim()) return;
    
    // Add command to terminal output
    setEntries(prev => [
      ...prev, 
      { type: 'input', content: currentCommand, timestamp: new Date() }
    ]);

    try {
      // Process command
      if (currentCommand === 'help') {
        setEntries(prev => [
          ...prev,
          { type: 'info', content: 'Available commands:', timestamp: new Date() },
          { type: 'info', content: '  search <query> - Search for documents', timestamp: new Date() },
          { type: 'info', content: '  extract metadata doc:<id> - Extract metadata from document', timestamp: new Date() },
          { type: 'info', content: '  graph add doc:<id> - Add document to knowledge graph', timestamp: new Date() },
          { type: 'info', content: '  map show-docs - Show documents on map', timestamp: new Date() },
          { type: 'info', content: '  connect doc:<id> doc:<id> - Connect documents', timestamp: new Date() },
          { type: 'info', content: '  export graph - Export knowledge graph', timestamp: new Date() },
          { type: 'info', content: '  clear - Clear terminal output', timestamp: new Date() },
        ]);
      } else if (currentCommand === 'clear') {
        setEntries([
          { type: 'info', content: 'Terminal cleared.', timestamp: new Date() }
        ]);
      } else if (currentCommand.startsWith('search')) {
        // Process search command
        const query = currentCommand.substring(7);
        setEntries(prev => [
          ...prev,
          { type: 'info', content: `Searching for ${query}...`, timestamp: new Date() }
        ]);
        
        // Here we would make the actual API call
        try {
          const response = await apiRequest('POST', '/api/search', { query });
          const data = await response.json();
          
          setEntries(prev => [
            ...prev,
            { type: 'success', content: `Found ${data.results.length} documents`, timestamp: new Date() }
          ]);
          
          if (data.results.length > 0) {
            data.results.forEach((doc: any, index: number) => {
              setEntries(prev => [
                ...prev,
                { 
                  type: 'output', 
                  content: `${index + 1}. ${doc.title} (${doc.type})`, 
                  timestamp: new Date() 
                }
              ]);
            });
          }
        } catch (error) {
          setEntries(prev => [
            ...prev,
            { type: 'error', content: 'Error executing search: ' + (error as Error).message, timestamp: new Date() }
          ]);
        }
      } else {
        // Generic command processing
        setEntries(prev => [
          ...prev,
          { type: 'info', content: `Executing command: ${currentCommand}`, timestamp: new Date() },
          { type: 'output', content: 'Command executed successfully', timestamp: new Date() }
        ]);
      }
    } catch (error) {
      setEntries(prev => [
        ...prev,
        { type: 'error', content: `Error: ${(error as Error).message}`, timestamp: new Date() }
      ]);
      
      toast({
        title: "Command Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }

    // Clear the input
    setCurrentCommand('');
  };

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [entries]);

  // Typing effect for command suggestions
  useEffect(() => {
    if (!isTypingSuggestion) return;
    
    const currentSuggestion = suggestionCommands[currentSuggestionIndex];
    
    if (typingIndex < currentSuggestion.length) {
      const typingTimer = setTimeout(() => {
        setCurrentCommand(currentSuggestion.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 50);
      
      return () => clearTimeout(typingTimer);
    } else {
      // Finished typing this suggestion
      const pauseTimer = setTimeout(() => {
        // Reset for next suggestion
        setIsTypingSuggestion(false);
        setTypingIndex(0);
      }, 3000);
      
      return () => clearTimeout(pauseTimer);
    }
  }, [isTypingSuggestion, typingIndex, currentSuggestionIndex, suggestionCommands]);

  // Cycle through suggestions
  useEffect(() => {
    if (!isTypingSuggestion) {
      const suggestionTimer = setTimeout(() => {
        setCurrentSuggestionIndex((prevIndex) => (prevIndex + 1) % suggestionCommands.length);
        setIsTypingSuggestion(true);
      }, 2000);
      
      return () => clearTimeout(suggestionTimer);
    }
  }, [isTypingSuggestion, suggestionCommands]);

  // Focus input when clicking anywhere in the terminal
  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="bg-bg-terminal font-mono text-sm p-2 border-t border-border-color overflow-auto"
      style={{ height }}
      onClick={focusInput}
      ref={terminalRef}
    >
      <div className="mb-1 text-text-secondary">Search Agent Terminal</div>
      
      {/* Terminal output display */}
      <div className="space-y-1">
        {entries.map((entry, index) => (
          <div key={index} className={`${entry.type === 'input' ? 'flex' : ''}`}>
            {entry.type === 'input' && <span className="text-secondary pr-1">&gt;</span>}
            <span 
              className={`
                ${entry.type === 'input' ? 'text-text-primary' : ''}
                ${entry.type === 'output' ? 'text-text-primary ml-4' : ''}
                ${entry.type === 'info' ? 'text-text-secondary' : ''}
                ${entry.type === 'error' ? 'text-error' : ''}
                ${entry.type === 'success' ? 'text-secondary' : ''}
              `}
            >
              {entry.content}
            </span>
          </div>
        ))}
      </div>
      
      {/* Input line */}
      <div className="flex items-center mt-1">
        <span className="text-secondary pr-1">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={e => {
            setCurrentCommand(e.target.value);
            // Stop auto-suggestion when user types
            if (isTypingSuggestion) {
              setIsTypingSuggestion(false);
              setTypingIndex(0);
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSubmitCommand();
            }
          }}
          className="flex-grow bg-transparent outline-none text-text-primary"
          placeholder="Type a command..."
          autoFocus
        />
        <span className="text-text-secondary animate-pulse">|</span>
      </div>
    </div>
  );
}
