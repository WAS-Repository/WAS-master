import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { FileText, Download, Share2, Bookmark, Printer, ExternalLink } from 'lucide-react';

// Sample document data
const sampleDocument = {
  id: 1,
  title: "Hampton Roads Regional Transportation Plan",
  type: "planning",
  authors: ["Hampton Roads Transportation Planning Organization"],
  publishedDate: "2021-05-15",
  content: `
# Hampton Roads Regional Transportation Plan

## Executive Summary
This document outlines the transportation priorities and investments for the Hampton Roads region over the next 25 years. The plan addresses highway, transit, active transportation, and freight needs across the region's localities.

## Vision Statement
To develop and maintain a safe, efficient, and sustainable transportation system that enhances mobility, provides connectivity, and supports economic vitality while preserving the quality of life in the Hampton Roads region.

## Key Objectives
1. Improve regional connectivity and reduce congestion
2. Enhance safety for all transportation system users
3. Support economic development and growth
4. Increase accessibility and mobility options
5. Ensure environmental sustainability

## Priority Projects
- I-64 Peninsula Widening
- Hampton Roads Bridge-Tunnel Expansion
- High-Speed Rail Corridor Development
- Regional Multi-Use Trail Network
- Transit System Modernization

## Funding Sources
The plan identifies $12.5 billion in transportation investments through 2045, including federal, state, local, and private sources.

## Implementation Timeline
Phase 1 (2021-2025): $3.2 billion
Phase 2 (2026-2035): $5.1 billion
Phase 3 (2036-2045): $4.2 billion
  `,
  localities: ["Norfolk", "Virginia Beach", "Hampton", "Newport News", "Portsmouth", "Suffolk", "Chesapeake"],
  keywords: ["transportation", "infrastructure", "regional planning", "mobility", "transit"]
};

export default function DocumentViewer() {
  const [document, setDocument] = useState(sampleDocument);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'document' | 'metadata' | 'history'>('document');

  // Format the content with Markdown-like styling
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Format headings
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-3 mb-2">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mt-2 mb-1">{line.substring(4)}</h3>;
      }
      // Format lists
      else if (line.match(/^\d+\. /)) {
        const content = line.replace(/^\d+\. /, '');
        return (
          <div key={index} className="ml-5 my-1 flex">
            <span className="mr-2">{line.match(/^\d+/)?.[0]}.</span>
            <span>{content}</span>
          </div>
        );
      } else if (line.startsWith('- ')) {
        return <div key={index} className="ml-5 my-1">• {line.substring(2)}</div>;
      }
      // Empty lines as spacing
      else if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      // Regular text
      else {
        return <p key={index} className="my-1">{line}</p>;
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Document header */}
      <div className="border-b p-3 bg-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h2 className="text-lg font-medium flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              {document.title}
            </h2>
            <div className="text-sm text-muted-foreground">
              {document.type.charAt(0).toUpperCase() + document.type.slice(1)} • 
              {document.publishedDate && ` Published on ${document.publishedDate}`}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Document tabs */}
      <div className="border-b">
        <div className="flex">
          <button 
            className={`px-4 py-2 text-sm border-b-2 ${activeTab === 'document' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setActiveTab('document')}
          >
            Document
          </button>
          <button 
            className={`px-4 py-2 text-sm border-b-2 ${activeTab === 'metadata' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setActiveTab('metadata')}
          >
            Metadata
          </button>
          <button 
            className={`px-4 py-2 text-sm border-b-2 ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </div>

      {/* Document content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'document' && (
          <div className="p-6 max-w-4xl mx-auto">
            {formatContent(document.content)}
          </div>
        )}
        
        {activeTab === 'metadata' && (
          <div className="p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-medium mb-4">Document Metadata</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Authors</h4>
                <div className="mt-1">
                  {document.authors.map((author, i) => (
                    <div key={i}>{author}</div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Localities</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {document.localities.map((locality, i) => (
                    <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                      {locality}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Keywords</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {document.keywords.map((keyword, i) => (
                    <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Document ID</h4>
                <div className="mt-1">{document.id}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Document Type</h4>
                <div className="mt-1">{document.type.charAt(0).toUpperCase() + document.type.slice(1)}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Publication Date</h4>
                <div className="mt-1">{document.publishedDate}</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-medium mb-4">Document History</h3>
            
            <div className="space-y-3">
              <div className="border rounded-md p-3">
                <div className="flex justify-between">
                  <div className="font-medium">Initial publication</div>
                  <div className="text-sm text-muted-foreground">{document.publishedDate}</div>
                </div>
                <div className="text-sm mt-1">Document created and published by {document.authors[0]}</div>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between">
                  <div className="font-medium">Public review period</div>
                  <div className="text-sm text-muted-foreground">2021-06-15</div>
                </div>
                <div className="text-sm mt-1">30-day public comment period opened</div>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between">
                  <div className="font-medium">Revision 1.1</div>
                  <div className="text-sm text-muted-foreground">2021-08-01</div>
                </div>
                <div className="text-sm mt-1">Updated based on public feedback</div>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between">
                  <div className="font-medium">Final approval</div>
                  <div className="text-sm text-muted-foreground">2021-09-15</div>
                </div>
                <div className="text-sm mt-1">Approved by transportation board</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}