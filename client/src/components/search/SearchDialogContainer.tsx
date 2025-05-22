import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SearchPanel } from './SearchPanel';
import { DocumentPreview } from './DocumentPreview';
import { useSearch } from '@/context/SearchContext';

export function SearchDialogContainer() {
  const { 
    isSearchOpen, 
    closeSearch, 
    selectedDocument, 
    selectDocument,
    addToGraph,
    viewOnMap
  } = useSearch();
  
  return (
    <Dialog open={isSearchOpen} onOpenChange={(open) => !open && closeSearch()}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 border border-border-color dark:bg-bg-panel">
        <AnimatePresence mode="wait">
          {selectedDocument ? (
            <DocumentPreview 
              key="document-preview"
              document={selectedDocument} 
              onClose={() => selectDocument(null)}
              onAddToGraph={addToGraph}
              onViewOnMap={viewOnMap}
            />
          ) : (
            <SearchPanel 
              key="search-panel"
              onClose={closeSearch}
              onResultSelect={selectDocument}
              onResultAddToGraph={addToGraph}
              onResultViewOnMap={viewOnMap}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}