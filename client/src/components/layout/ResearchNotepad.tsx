import React from 'react';
import { BookOpen, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResearchNotepadProps {
  content: string;
  onChange: (content: string) => void;
}

export default function ResearchNotepad({ content, onChange }: ResearchNotepadProps) {
  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      {/* Notepad Header */}
      <div className="h-9 bg-[#252526] flex items-center justify-between px-3 py-1 border-b border-[#3e3e3e]">
        <div className="flex items-center">
          <BookOpen size={14} className="mr-2" />
          <span className="text-xs font-semibold">Research Notes</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Save size={12} />
        </Button>
      </div>
      
      {/* Notepad Content */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-[#1e1e1e] text-white text-xs p-3 resize-none outline-none border-none font-mono leading-relaxed"
          placeholder="Start taking research notes..."
        />
      </div>
      
      {/* Notepad Status */}
      <div className="h-6 bg-[#252526] border-t border-[#3e3e3e] flex items-center justify-between px-3 text-xs text-gray-400">
        <span>Lines: {content.split('\n').length}</span>
        <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
      </div>
    </div>
  );
}