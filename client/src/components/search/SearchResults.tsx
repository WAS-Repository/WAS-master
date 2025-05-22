import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, ExternalLink, Download, Tag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchResult } from '@/lib/search';

interface SearchResultsProps {
  results: SearchResult[];
  onResultSelect: (result: SearchResult) => void;
  onResultAddToGraph: (result: SearchResult) => void;
  onResultViewOnMap: (result: SearchResult) => void;
}

export function SearchResults({ results, onResultSelect, onResultAddToGraph, onResultViewOnMap }: SearchResultsProps) {
  const [expandedResults, setExpandedResults] = useState<number[]>([]);
  const [hoveredResult, setHoveredResult] = useState<number | null>(null);

  const toggleResultExpansion = (id: number) => {
    if (expandedResults.includes(id)) {
      setExpandedResults(expandedResults.filter(resultId => resultId !== id));
    } else {
      setExpandedResults([...expandedResults, id]);
    }
  };

  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="space-y-2">
        {results.length === 0 ? (
          <div className="text-text-secondary text-center py-4">
            No results found. Try modifying your search terms.
          </div>
        ) : (
          results.map(result => {
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
                            onResultSelect(result);
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
                            onResultAddToGraph(result);
                          }}
                        >
                          <Tag size={14} />
                          <span className="sr-only">Add to Graph</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onResultViewOnMap(result);
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
                              onResultSelect(result);
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
  );
}