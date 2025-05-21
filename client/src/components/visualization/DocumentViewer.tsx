import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DocumentCategory = 'research_paper' | 'patent' | 'engineering_drawing';

interface Document {
  id: number;
  title: string;
  type: DocumentCategory;
  location: string;
  year: string;
  authors: string[];
  publishedDate: string;
  source: string;
  citationCount?: number;
  localities: string[];
  keywords?: string[];
  fileFormat: string;
  fileSize: string;
}

const sampleDocuments: Record<DocumentCategory, Document[]> = {
  research_paper: [
    {
      id: 1,
      title: 'Coastal Erosion Study',
      type: 'research_paper',
      location: 'Hampton',
      year: '2021',
      authors: ['James R. Smith', 'Maria Delgado'],
      publishedDate: 'March 15, 2021',
      source: 'Old Dominion University',
      citationCount: 27,
      localities: ['Hampton', 'Norfolk', 'Virginia Beach'],
      keywords: ['erosion', 'climate', 'sea level rise'],
      fileFormat: 'PDF',
      fileSize: '1.2 MB'
    },
    {
      id: 2,
      title: 'Naval Base Norfolk Impact',
      type: 'research_paper',
      location: 'Norfolk',
      year: '2020',
      authors: ['Robert Johnson'],
      publishedDate: 'August 22, 2020',
      source: 'Naval Research Lab',
      citationCount: 15,
      localities: ['Norfolk'],
      keywords: ['naval base', 'military', 'coastal management'],
      fileFormat: 'PDF',
      fileSize: '2.8 MB'
    },
    {
      id: 3,
      title: 'Sea Level Rise Projections',
      type: 'research_paper',
      location: 'Multiple',
      year: '2022',
      authors: ['Sarah Wilson', 'David Chang'],
      publishedDate: 'January 10, 2022',
      source: 'Virginia Institute of Marine Science',
      citationCount: 8,
      localities: ['Norfolk', 'Virginia Beach', 'Portsmouth', 'Hampton', 'Newport News'],
      keywords: ['sea level rise', 'climate change', 'flooding'],
      fileFormat: 'PDF',
      fileSize: '3.5 MB'
    }
  ],
  patent: [
    {
      id: 4,
      title: 'Flood Barrier System',
      type: 'patent',
      location: 'Virginia Beach',
      year: '2019',
      authors: ['Jennifer Lee'],
      publishedDate: 'June 10, 2019',
      source: 'US Patent Office',
      localities: ['Virginia Beach'],
      fileFormat: 'PDF',
      fileSize: '0.8 MB'
    },
    {
      id: 5,
      title: 'Port Loading Mechanism',
      type: 'patent',
      location: 'Portsmouth',
      year: '2018',
      authors: ['Michael Chen'],
      publishedDate: 'November 15, 2018',
      source: 'US Patent Office',
      localities: ['Portsmouth'],
      fileFormat: 'PDF',
      fileSize: '1.1 MB'
    }
  ],
  engineering_drawing: [
    {
      id: 6,
      title: 'Bridge Structure Hampton',
      type: 'engineering_drawing',
      location: 'Hampton',
      year: '2017',
      authors: ['Sarah Williams'],
      publishedDate: 'July 30, 2017',
      source: 'Virginia Department of Transportation',
      localities: ['Hampton'],
      fileFormat: 'DWG',
      fileSize: '5.7 MB'
    },
    {
      id: 7,
      title: 'Port Facility Norfolk',
      type: 'engineering_drawing',
      location: 'Norfolk',
      year: '2018',
      authors: ['David Miller'],
      publishedDate: 'March 22, 2018',
      source: 'Port Authority',
      localities: ['Norfolk'],
      fileFormat: 'DWG',
      fileSize: '7.2 MB'
    }
  ]
};

export default function DocumentViewer() {
  const [selectedDocument, setSelectedDocument] = useState<Document>(sampleDocuments.research_paper[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter documents based on search query
  const filteredDocuments = {
    research_paper: sampleDocuments.research_paper.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.location.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    patent: sampleDocuments.patent.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.location.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    engineering_drawing: sampleDocuments.engineering_drawing.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };
  
  return (
    <div className="h-full flex">
      {/* Document list sidebar */}
      <div className="w-1/4 border-r border-border-color bg-bg-panel overflow-y-auto">
        <div className="sticky top-0 bg-bg-panel border-b border-border-color p-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-dark border border-border-color rounded py-1 px-3 text-sm pr-8"
            />
            <Search className="h-4 w-4 absolute right-2 top-2 text-text-secondary" />
          </div>
        </div>
        
        <div className="p-2">
          <h3 className="text-xs uppercase text-text-secondary mb-2">Research Papers</h3>
          <div className="space-y-1">
            {filteredDocuments.research_paper.map(doc => (
              <div 
                key={doc.id}
                className={`p-2 rounded cursor-pointer ${selectedDocument.id === doc.id ? 'bg-bg-dark' : 'hover:bg-bg-dark'}`}
                onClick={() => setSelectedDocument(doc)}
              >
                <h4 className={`text-sm ${selectedDocument.id === doc.id ? 'font-medium' : ''}`}>{doc.title}</h4>
                <p className="text-xs text-text-secondary">{doc.location} • {doc.year}</p>
              </div>
            ))}
          </div>
          
          <h3 className="text-xs uppercase text-text-secondary mt-4 mb-2">Patents</h3>
          <div className="space-y-1">
            {filteredDocuments.patent.map(doc => (
              <div 
                key={doc.id}
                className={`p-2 rounded cursor-pointer ${selectedDocument.id === doc.id ? 'bg-bg-dark' : 'hover:bg-bg-dark'}`}
                onClick={() => setSelectedDocument(doc)}
              >
                <h4 className={`text-sm ${selectedDocument.id === doc.id ? 'font-medium' : ''}`}>{doc.title}</h4>
                <p className="text-xs text-text-secondary">{doc.location} • {doc.year}</p>
              </div>
            ))}
          </div>
          
          <h3 className="text-xs uppercase text-text-secondary mt-4 mb-2">Engineering Drawings</h3>
          <div className="space-y-1">
            {filteredDocuments.engineering_drawing.map(doc => (
              <div 
                key={doc.id}
                className={`p-2 rounded cursor-pointer ${selectedDocument.id === doc.id ? 'bg-bg-dark' : 'hover:bg-bg-dark'}`}
                onClick={() => setSelectedDocument(doc)}
              >
                <h4 className={`text-sm ${selectedDocument.id === doc.id ? 'font-medium' : ''}`}>{doc.title}</h4>
                <p className="text-xs text-text-secondary">{doc.location} • {doc.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Document content area */}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <h2 className="text-xl font-medium text-primary mb-1">{selectedDocument.title}</h2>
            <div className="flex items-center text-sm text-text-secondary">
              <span className="mr-3">Authors: {selectedDocument.authors.join(', ')}</span>
              <span>Published: {selectedDocument.publishedDate}</span>
            </div>
          </div>
          
          <div className="mb-4 bg-bg-panel p-3 rounded-md border border-border-color">
            <h3 className="text-sm font-medium mb-2">Document Metadata</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-text-secondary">Document Type:</span>
                <span className="ml-1">
                  {selectedDocument.type === 'research_paper' ? 'Research Paper' : 
                   selectedDocument.type === 'patent' ? 'Patent' : 
                   'Engineering Drawing'}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Source:</span>
                <span className="ml-1">{selectedDocument.source}</span>
              </div>
              {selectedDocument.citationCount !== undefined && (
                <div>
                  <span className="text-text-secondary">Citation Count:</span>
                  <span className="ml-1">{selectedDocument.citationCount}</span>
                </div>
              )}
              <div>
                <span className="text-text-secondary">Localities:</span>
                <span className="ml-1">{selectedDocument.localities.join(', ')}</span>
              </div>
              {selectedDocument.keywords && (
                <div>
                  <span className="text-text-secondary">Keywords:</span>
                  <span className="ml-1">{selectedDocument.keywords.join(', ')}</span>
                </div>
              )}
              <div>
                <span className="text-text-secondary">File Format:</span>
                <span className="ml-1">{selectedDocument.fileFormat} ({selectedDocument.fileSize})</span>
              </div>
            </div>
          </div>
          
          {selectedDocument.type === 'research_paper' && (
            <>
              <div className="mb-4">
                <h3 className="text-base font-medium mb-2">Abstract</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  This comprehensive study examines the patterns and impacts of coastal erosion throughout the Hampton Roads region of Virginia. Using data collected over a ten-year period (2010-2020), we present analysis of shoreline changes, erosion rates, and projected impacts on infrastructure and communities. Special attention is given to the localities of Norfolk, Virginia Beach, Hampton, and Portsmouth, which show varying degrees of vulnerability. The research incorporates climate change projections to model future erosion scenarios under different sea level rise conditions.
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Our findings indicate that without intervention, approximately 15% of coastal areas in Hampton Roads will experience severe erosion by 2050, with potential infrastructure damage estimated at $3.2 billion. We propose several mitigation strategies that could be implemented at the municipal and regional levels, including living shoreline approaches, strategic retreat from highly vulnerable areas, and engineered barrier systems suitable for the unique conditions of the Chesapeake Bay region.
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-base font-medium mb-2">Locality Impact Analysis</h3>
                <div className="bg-bg-panel rounded-md overflow-hidden border border-border-color">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-bg-dark">
                        <TableHead className="py-2 px-3 text-left text-xs font-medium">Locality</TableHead>
                        <TableHead className="py-2 px-3 text-left text-xs font-medium">Erosion Rate (m/yr)</TableHead>
                        <TableHead className="py-2 px-3 text-left text-xs font-medium">Vulnerable Area (km²)</TableHead>
                        <TableHead className="py-2 px-3 text-left text-xs font-medium">Risk Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="py-2 px-3 text-xs">Norfolk</TableCell>
                        <TableCell className="py-2 px-3 text-xs">0.32</TableCell>
                        <TableCell className="py-2 px-3 text-xs">5.7</TableCell>
                        <TableCell className="py-2 px-3 text-xs">
                          <span className="px-2 py-0.5 text-xs rounded bg-error bg-opacity-20 text-error">High</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2 px-3 text-xs">Virginia Beach</TableCell>
                        <TableCell className="py-2 px-3 text-xs">0.41</TableCell>
                        <TableCell className="py-2 px-3 text-xs">8.3</TableCell>
                        <TableCell className="py-2 px-3 text-xs">
                          <span className="px-2 py-0.5 text-xs rounded bg-error bg-opacity-20 text-error">High</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2 px-3 text-xs">Hampton</TableCell>
                        <TableCell className="py-2 px-3 text-xs">0.25</TableCell>
                        <TableCell className="py-2 px-3 text-xs">3.8</TableCell>
                        <TableCell className="py-2 px-3 text-xs">
                          <span className="px-2 py-0.5 text-xs rounded bg-accent bg-opacity-20 text-accent">Medium</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2 px-3 text-xs">Portsmouth</TableCell>
                        <TableCell className="py-2 px-3 text-xs">0.18</TableCell>
                        <TableCell className="py-2 px-3 text-xs">2.1</TableCell>
                        <TableCell className="py-2 px-3 text-xs">
                          <span className="px-2 py-0.5 text-xs rounded bg-secondary bg-opacity-20 text-secondary">Low</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2 px-3 text-xs">Poquoson</TableCell>
                        <TableCell className="py-2 px-3 text-xs">0.37</TableCell>
                        <TableCell className="py-2 px-3 text-xs">4.6</TableCell>
                        <TableCell className="py-2 px-3 text-xs">
                          <span className="px-2 py-0.5 text-xs rounded bg-error bg-opacity-20 text-error">High</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-text-secondary mt-2">Table 1: Erosion rates and vulnerability assessment by locality</p>
              </div>
            </>
          )}
          
          {selectedDocument.type === 'patent' && (
            <div className="mb-4">
              <h3 className="text-base font-medium mb-2">Patent Description</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                This patent describes a novel approach to flood barrier systems specifically designed for coastal urban areas with high population density. The technology utilizes modular deployable barriers that can be rapidly installed in advance of storm events and which integrate with permanent infrastructure components.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                The system addresses specific challenges identified in the Hampton Roads region, including limited deployment space, aesthetic considerations for tourist areas, and the need for minimal impact on daily commerce and transportation when not in use. Test installations in Virginia Beach have demonstrated the system's effectiveness during moderate storm surge events.
              </p>
            </div>
          )}
          
          {selectedDocument.type === 'engineering_drawing' && (
            <div className="mb-4">
              <h3 className="text-base font-medium mb-2">Drawing Specifications</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                Engineering schematic detailing structural specifications for infrastructure improvements in the Hampton Roads region. The drawing includes detailed measurements, material specifications, and implementation guidelines for construction teams.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                This technical document was produced as part of the Hampton Roads Infrastructure Resilience Initiative and meets all requirements specified by the Virginia Department of Transportation and the U.S. Army Corps of Engineers for coastal infrastructure projects.
              </p>
            </div>
          )}
          
          <div className="flex justify-between mt-6 mb-4">
            <Button variant="outline" size="sm" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous Section
            </Button>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-primary text-white flex items-center">
                <Download className="h-4 w-4 mr-1" />
                Download {selectedDocument.fileFormat}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              Next Section
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
