import React, { useRef, useEffect, useState } from 'react';
import { FileText, Save, Download, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Quote, Link, Image, Undo, Redo, Type, Palette, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ResearchNotepadProps {
  content: string;
  onChange: (content: string) => void;
}

export default function ResearchNotepad({ content, onChange }: ResearchNotepadProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '<p>Start your research notes here...</p>';
      updateWordCount();
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updateWordCount();
    }
  };

  const updateWordCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
    }
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection) {
      setSelectedText(selection.toString());
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const changeFontSize = (size: string) => {
    executeCommand('fontSize', size);
  };

  const changeTextColor = (color: string) => {
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const changeBackgroundColor = (color: string) => {
    executeCommand('hiliteColor', color);
    setShowColorPicker(false);
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML || '';
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-notes-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = () => {
    // HTML to Markdown conversion
    let markdown = editorRef.current?.innerHTML || '';
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
    markdown = markdown.replace(/<u>(.*?)<\/u>/g, '_$1_');
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n');
    markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1\n\n');
    markdown = markdown.replace(/<ul><li>(.*?)<\/li><\/ul>/g, '- $1\n');
    markdown = markdown.replace(/<ol><li>(.*?)<\/li><\/ol>/g, '1. $1\n');
    markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
    markdown = markdown.replace(/<br\s*\/?>/g, '\n');
    markdown = markdown.replace(/<[^>]*>/g, ''); // Remove remaining HTML
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-notes-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border-r border-[#3e3e3e]">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#252526] px-3 py-2 border-b border-[#3e3e3e]">
        <div className="flex items-center">
          <FileText size={16} className="mr-2" />
          <span className="text-sm font-semibold">Research Notes</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={handleSave}>
            <Save size={14} className="mr-1" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={exportAsMarkdown}>
            <Download size={14} className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Rich Text Toolbar */}
      <div className="bg-[#2d2d2d] border-b border-[#3e3e3e] p-2">
        <div className="flex items-center space-x-1 flex-wrap gap-1">
          {/* Undo/Redo */}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('undo')}>
            <Undo size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('redo')}>
            <Redo size={14} />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Font Size */}
          <select 
            className="bg-[#3e3e3e] text-white text-xs px-2 py-1 rounded border-none outline-none"
            onChange={(e) => changeFontSize(e.target.value)}
          >
            <option value="1">8pt</option>
            <option value="2">10pt</option>
            <option value="3">12pt</option>
            <option value="4">14pt</option>
            <option value="5">18pt</option>
            <option value="6">24pt</option>
            <option value="7">36pt</option>
          </select>

          {/* Headings */}
          <select 
            className="bg-[#3e3e3e] text-white text-xs px-2 py-1 rounded border-none outline-none"
            onChange={(e) => executeCommand('formatBlock', e.target.value)}
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Formatting */}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('bold')}>
            <Bold size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('italic')}>
            <Italic size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('underline')}>
            <Underline size={14} />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Alignment */}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('justifyLeft')}>
            <AlignLeft size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('justifyCenter')}>
            <AlignCenter size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('justifyRight')}>
            <AlignRight size={14} />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists and Quotes */}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('insertUnorderedList')}>
            <List size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('insertOrderedList')}>
            <Hash size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => executeCommand('formatBlock', 'blockquote')}>
            <Quote size={14} />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Links and Media */}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={insertLink}>
            <Link size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={insertImage}>
            <Image size={14} />
          </Button>

          {/* Color Picker */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette size={14} />
            </Button>
            {showColorPicker && (
              <div className="absolute top-8 left-0 bg-[#252526] border border-[#3e3e3e] rounded p-2 z-10">
                <div className="text-xs text-gray-300 mb-2">Text Colors</div>
                <div className="grid grid-cols-4 gap-1 mb-3">
                  {['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000'].map(color => (
                    <div 
                      key={color}
                      className="w-6 h-6 rounded cursor-pointer border border-gray-600"
                      style={{ backgroundColor: color }}
                      onClick={() => changeTextColor(color)}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-300 mb-2">Highlight Colors</div>
                <div className="grid grid-cols-4 gap-1">
                  {['transparent', '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff9999', '#99ff99', '#9999ff'].map(color => (
                    <div 
                      key={color}
                      className="w-6 h-6 rounded cursor-pointer border border-gray-600"
                      style={{ backgroundColor: color }}
                      onClick={() => changeBackgroundColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Rich Text Editor */}
      <div className="flex-1 overflow-auto">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onMouseUp={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          className="w-full h-full p-4 bg-[#1e1e1e] text-white text-sm outline-none"
          style={{ 
            lineHeight: '1.6',
            minHeight: '100%'
          }}
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-[#252526] border-t border-[#3e3e3e] px-3 py-1 text-xs text-gray-400 flex justify-between">
        <div>
          {selectedText ? (
            <span>Selected: {selectedText.length} characters</span>
          ) : (
            <span>Rich text editor • Google Docs-like formatting</span>
          )}
        </div>
        <div className="flex space-x-4">
          <span>Words: {wordCount}</span>
          <span>Auto-saved</span>
        </div>
      </div>
    </div>
  );
}