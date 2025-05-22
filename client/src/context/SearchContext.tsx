import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SearchResult } from '@/lib/search';

interface SearchContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  selectedDocument: SearchResult | null;
  selectDocument: (document: SearchResult | null) => void;
  addToGraph: (document: SearchResult) => void;
  viewOnMap: (document: SearchResult) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<SearchResult | null>(null);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSelectedDocument(null);
  };

  const selectDocument = (document: SearchResult | null) => {
    setSelectedDocument(document);
  };

  const addToGraph = (document: SearchResult) => {
    console.log('Adding document to graph:', document);
    // Implementation would go here for adding to graph visualization
    closeSearch();
  };

  const viewOnMap = (document: SearchResult) => {
    console.log('Viewing document on map:', document);
    // Implementation would go here for showing on map
    closeSearch();
  };

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        openSearch,
        closeSearch,
        selectedDocument,
        selectDocument,
        addToGraph,
        viewOnMap
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}