import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Edit, 
  HelpCircle, 
  Save,
  FileCode,
  Settings
} from 'lucide-react';
import ViewMenu from './layout/ViewMenu';
import { ResearchWorkspace } from './layout/ViewMenu';

interface TopToolbarProps {
  onSelectWorkspace: (workspace: ResearchWorkspace) => void;
  currentWorkspaceId: string;
}

export default function TopToolbar({ onSelectWorkspace, currentWorkspaceId }: TopToolbarProps) {
  return (
    <div className="bg-black text-green-500 border-b border-green-900 p-1 flex items-center text-xs">
      <div className="font-mono text-sm font-bold mr-4">
        HAMPTON ROADS RESEARCH INTERFACE
      </div>
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" className="h-8 px-2 text-green-500">
          File
        </Button>
        
        <Button variant="ghost" className="h-8 px-2 text-green-500">
          Edit
        </Button>
        
        <ViewMenu 
          onSelectWorkspace={onSelectWorkspace}
          currentWorkspaceId={currentWorkspaceId}
        />
        
        <Button variant="ghost" className="h-8 px-2 text-green-500">
          Help
        </Button>
      </div>
      
      <div className="ml-auto flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500">
          <FileCode className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}