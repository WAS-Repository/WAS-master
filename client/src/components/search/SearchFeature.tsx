import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ChevronRight, Download, ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { executeSearch, SearchResult } from '@/lib/search';

export function SearchFeature() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<SearchResult | null>(null);
  const [expandedResults, setExpandedResults] = useState<number[]>([]);
  const [hoveredResult, setHoveredResult] = useState<number | null>(null);

  // Mock search results for demonstration
  const mockResults: SearchResult[] = [
    {
      id: 1,
      title: 'Sea Level Rise Impacts on Norfolk Naval Station',
      type: 'Research Paper',
      authors: ['Dr. Sarah Johnson', 'Prof. Robert Chen'],
      publishedDate: '2024-03-15',
      snippet: 'This study examines the potential impacts of sea level rise on the Norfolk Naval Station infrastructure through 2050, including detailed assessment of vulnerable systems and proposed mitigation strategies.',
      relevanceScore: 0.92,
      localities: ['Norfolk', 'Hampton Roads']
    },
    {
      id: 2,
      title: 'Advanced Coastal Barrier System Patent',
      type: 'Patent',
      authors: ['Coastal Engineering Solutions, Inc.'],
      publishedDate: '2023-11-02',
      snippet: 'A modular, deployable coastal barrier system designed specifically for the geological conditions of Hampton Roads region, featuring innovative wave dissipation technology.',
      relevanceScore: 0.85,
      localities: ['Virginia Beach', 'Norfolk', 'Hampton']
    },
    {
      id: 3,
      title: 'Hampton Roads Interconnected Drainage Assessment',
      type: 'Engineering Drawing',
      authors: ['Metropolitan Water Authority'],
      publishedDate: '2024-01-20',
      snippet: 'Technical specifications and schematics for the proposed regional interconnected drainage system connecting Portsmouth, Norfolk, and Chesapeake municipal water management.',
      relevanceScore: 0.78,
      localities: ['Portsmouth', 'Norfolk', 'Chesapeake']
    }
  ];

  const handleSearch = () => {
    // Use mock results for demonstration
    setSearchResults(mockResults);
    setSelectedDocument(null);
  };

  const toggleResultExpansion = (id: number) => {
    if (expandedResults.includes(id)) {
      setExpandedResults(expandedResults.filter(resultId => resultId !== id));
    } else {
      setExpandedResults([...expandedResults, id]);
    }
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setSelectedDocument(null);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSelectedDocument(null);
  };

  const viewDocument = (document: SearchResult) => {
    setSelectedDocument(document);
  };

  const addToGraph = (document: SearchResult) => {
    console.log('Adding to graph:', document);
    // Implementation would go here
    closeSearch();
  };

  const viewOnMap = (document: SearchResult) => {
    console.log('Viewing on map:', document);
    // Implementation would go here
    closeSearch();
  };

  return (
    <>
      {/* Search Button */}
      <Button 
        onClick={openSearch}
        variant="ghost" 
        size="sm"
        className="h-8 px-3"
      >
        <Search size={16} className="mr-2" />
        Search Documents
      </Button>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 gap-0 border-border-color">
          <AnimatePresence mode="wait">
            {selectedDocument ? (
              <DocumentPreview 
                key="document-preview"
                document={selectedDocument} 
                onClose={() => setSelectedDocument(null)}
                onAddToGraph={addToGraph}
                onViewOnMap={viewOnMap}
              />
            ) : (
              <motion.div
                key="search-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-[600px]"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-border-color">
                  <div className="text-lg font-medium">Document Search</div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={closeSearch}>
                    <X size={16} />
                  </Button>
                </div>
                
                {/* Search Input */}
                <div className="p-4 border-b border-border-color">
                  <div className="relative">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for documents, patents, research papers..."
                      className="pr-10 pl-10"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      onClick={handleSearch}
                    >
                      <Filter size={14} />
                    </Button>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button onClick={handleSearch} size="sm">
                      Search
                    </Button>
                  </div>
                </div>
                
                {/* Search Results with Micro-interactions */}
                <div className="flex-1 overflow-hidden p-4">
                  <ScrollArea className="h-full w-full pr-4">
                    <div className="space-y-3">
                      {searchResults.length === 0 ? (
                        <div className="text-text-secondary text-center py-4">
                          {searchQuery ? 'No results found. Try modifying your search terms.' : 'Enter a search term to find documents.'}
                        </div>
                      ) : (
                        searchResults.map(result => {
                          const isExpanded = expandedResults.includes(result.id);
                          const isHovered = hoveredResult === result.id;
                          
                          return (
                            <motion.div
                              key={result.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border rounded-md overflow-hidden"
                              style={{ 
                                borderColor: isHovered ? 'var(--primary)' : 'var(--border-color)',
                                backgroundColor: 'var(--bg-panel)'
                              }}
                              onMouseEnter={() => setHoveredResult(result.id)}
                              onMouseLeave={() => setHoveredResult(null)}
                            >
                              <div 
                                className="flex items-center justify-between px-3 py-2 cursor-pointer"
                                onClick={() => toggleResultExpansion(result.id)}
                              >
                                <div className="flex items-center">
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mr-2 text-primary"
                                  >
                                    <ChevronRight size={16} />
                                  </motion.div>
                                  <div>
                                    <div className="font-medium text-text-primary">{result.title}</div>
                                    <div className="text-xs text-text-secondary mt-0.5 flex items-center">
                                      <Badge variant="outline" className="mr-2 h-5 text-[10px]">
                                        {result.type}
                                      </Badge>
                                      {result.publishedDate && (
                                        <span className="mr-2">{result.publishedDate}</span>
                                      )}
                                      {result.relevanceScore && (
                                        <span>Relevance: {result.relevanceScore.toFixed(2)}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <AnimatePresence>
                                  {isHovered && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{ duration: 0.1 }}
                                      className="flex space-x-1"
                                    >
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 w-7 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          viewDocument(result);
                                        }}
                                      >
                                        <ExternalLink size={14} />
                                        <span className="sr-only">Open</span>
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 w-7 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addToGraph(result);
                                        }}
                                      >
                                        <ChevronRight size={14} />
                                        <span className="sr-only">Add to Graph</span>
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 w-7 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          viewOnMap(result);
                                        }}
                                      >
                                        <MapPin size={14} />
                                        <span className="sr-only">View on Map</span>
                                      </Button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t px-3 py-2 text-sm"
                                    style={{ borderColor: 'var(--border-color)' }}
                                  >
                                    {result.snippet && (
                                      <div className="mb-2 text-text-primary">
                                        <div className="text-xs font-medium mb-1 text-text-secondary">Summary</div>
                                        <p>{result.snippet}</p>
                                      </div>
                                    )}
                                    
                                    <div className="flex flex-wrap mt-2 gap-1">
                                      {result.localities.map((locality, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-[10px]">
                                          <MapPin size={10} className="mr-1" />
                                          {locality}
                                        </Badge>
                                      ))}
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-3">
                                      <div className="text-xs text-text-secondary">
                                        Source: {result.authors.join(", ")}
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="h-6 text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            viewDocument(result);
                                          }}
                                        >
                                          View Document
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="h-6 text-xs"
                                        >
                                          <Download size={12} className="mr-1" />
                                          Download
                                        </Button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Document Preview Component
interface DocumentPreviewProps {
  document: SearchResult;
  onClose: () => void;
  onViewOnMap: (document: SearchResult) => void;
  onAddToGraph: (document: SearchResult) => void;
}

function DocumentPreview({ document, onClose, onViewOnMap, onAddToGraph }: DocumentPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-[600px]"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b p-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="font-medium">{document.title}</div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      
      {/* Content */}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {/* Document Info */}
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline">{document.type}</Badge>
            {document.publishedDate && (
              <Badge variant="outline">Published: {document.publishedDate}</Badge>
            )}
          </div>
          
          {/* Authors */}
          <div>
            <div className="text-sm font-medium text-text-secondary mb-1">Authors</div>
            <div>{document.authors.join(", ")}</div>
          </div>
          
          {/* Content */}
          <div>
            <div className="text-sm font-medium text-text-secondary mb-1">Summary</div>
            <p className="text-text-primary">{document.snippet}</p>
            <p className="mt-2">
              Further analysis of sea level rise projections indicates critical infrastructure vulnerabilities at 
              multiple sites around Hampton Roads. This document provides detailed assessments for key facilities and 
              recommends mitigation strategies based on engineering specifications and cost-benefit analysis.
            </p>
          </div>
          
          {/* Localities */}
          <div>
            <div className="text-sm font-medium text-text-secondary mb-1">Localities</div>
            <div className="flex flex-wrap gap-1">
              {document.localities.map((locality, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  <MapPin size={12} className="mr-1" />
                  {locality}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Funding Sources */}
          <div>
            <div className="text-sm font-medium text-text-secondary mb-1">Funding Sources</div>
            <div className="flex flex-col space-y-2">
              <div className="text-text-primary flex justify-between p-2 border rounded-sm">
                <span>Federal Maritime Research Grant</span>
                <span className="font-medium">$1.2M</span>
              </div>
              <div className="text-text-primary flex justify-between p-2 border rounded-sm">
                <span>Virginia Coastal Authority</span>
                <span className="font-medium">$450K</span>
              </div>
            </div>
          </div>
          
          {/* Related Documents */}
          <div>
            <div className="text-sm font-medium text-text-secondary mb-1">Related Documents</div>
            <div className="space-y-2">
              <div className="flex items-center p-2 border rounded-sm text-text-primary cursor-pointer hover:bg-bg-alt">
                <div className="flex-grow">
                  <div className="font-medium">Coastal Erosion Assessment 2023</div>
                  <div className="text-xs text-text-secondary">Research Paper</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      {/* Footer Actions */}
      <div className="border-t p-3 flex justify-between" style={{ borderColor: 'var(--border-color)' }}>
        <Button variant="outline" size="sm" onClick={() => onViewOnMap(document)}>
          <MapPin size={14} className="mr-1" />
          View on Map
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onAddToGraph(document)}>
            Add to Graph
          </Button>
          <Button size="sm">
            <Download size={14} className="mr-1" />
            Download
          </Button>
        </div>
      </div>
    </motion.div>
  );
}