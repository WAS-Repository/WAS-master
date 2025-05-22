import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Link, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchResult } from '@/lib/search';

interface DocumentPreviewProps {
  document: SearchResult;
  onClose: () => void;
  onViewOnMap: (document: SearchResult) => void;
  onAddToGraph: (document: SearchResult) => void;
}

export function DocumentPreview({ document, onClose, onViewOnMap, onAddToGraph }: DocumentPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-panel border rounded-md overflow-hidden"
      style={{ borderColor: 'var(--border-color)' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b p-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="font-medium">{document.title}</div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      
      {/* Content */}
      <ScrollArea className="p-4 h-[400px]">
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
            <div>{document.authors.join(', ')}</div>
          </div>
          
          {/* Content */}
          <div>
            <div className="text-sm font-medium text-text-secondary mb-1">Summary</div>
            <p className="text-text-primary">{document.snippet}</p>
            <p className="mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
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
              <div className="text-text-primary flex justify-between p-2 border rounded-sm">
                <span>Hampton Roads Regional Council</span>
                <span className="font-medium">$320K</span>
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
                <Link size={14} className="text-primary" />
              </div>
              <div className="flex items-center p-2 border rounded-sm text-text-primary cursor-pointer hover:bg-bg-alt">
                <div className="flex-grow">
                  <div className="font-medium">Norfolk Flood Defense Mechanisms</div>
                  <div className="text-xs text-text-secondary">Engineering Drawing</div>
                </div>
                <Link size={14} className="text-primary" />
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