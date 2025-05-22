import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SearchPanel } from './SearchPanel';
import { DocumentPreview } from './DocumentPreview';
import { SearchResult } from '@/lib/search';

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ isOpen, onOpenChange }: SearchDialogProps) {
  const [selectedDocument, setSelectedDocument] = useState<SearchResult | null>(null);
  
  const handleResultSelect = (result: SearchResult) => {
    setSelectedDocument(result);
  };
  
  const handleAddToGraph = (result: SearchResult) => {
    // Add logic to add document to knowledge graph
    console.log('Adding to graph:', result);
    // Close dialog after adding
    onOpenChange(false);
  };
  
  const handleViewOnMap = (result: SearchResult) => {
    // Add logic to show document on map
    console.log('Viewing on map:', result);
    // Close dialog after showing on map
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 border-none bg-transparent">
        <AnimatePresence mode="wait">
          {selectedDocument ? (
            <DocumentPreview 
              key="document-preview"
              document={selectedDocument} 
              onClose={() => setSelectedDocument(null)}
              onAddToGraph={handleAddToGraph}
              onViewOnMap={handleViewOnMap}
            />
          ) : (
            <SearchPanel 
              key="search-panel"
              onClose={() => onOpenChange(false)}
              onResultSelect={handleResultSelect}
              onResultAddToGraph={handleAddToGraph}
              onResultViewOnMap={handleViewOnMap}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}