import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Share, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  
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
  
  // Handle mobile view - auto-collapse sidebar
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile]);
  
  // Document selection in mobile view - auto-hide sidebar
  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
    if (isMobile) {
      setShowSidebar(false);
    }
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <div className="h-full flex relative">
      {/* Document content area */}
      <div className="flex-grow overflow-y-auto">
        {/* Mobile header with document title */}
        {isMobile && (
          <div className="sticky top-0 z-10 bg-bg-dark border-b border-border-color p-2 flex items-center">
            <h2 className="text-sm font-medium truncate">{selectedDocument.title}</h2>
          </div>
        )}
        
        <div className="p-2 sm:p-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-medium text-primary mb-1">{selectedDocument.title}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-text-secondary">
                <span className="sm:mr-3">Authors: {selectedDocument.authors.join(', ')}</span>
                <span>Published: {selectedDocument.publishedDate}</span>
              </div>
            </div>
            
            <div className="mb-4 bg-bg-panel p-3 rounded-md border border-border-color">
              <h3 className="text-sm font-medium mb-2">Document Metadata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
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
                  <div className="bg-bg-panel rounded-md overflow-hidden border border-border-color overflow-x-auto">
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
                  This patent describes a novel approach to flood barrier systems specifically designed for coastal urban areas with high population density. The technology utilizes modular deployable barriers that can be rapidly installed in advance of storm events and which integrate with permanent infrastructure components. The system is designed to protect against storm surge events up to 15 feet while minimizing visual and environmental impacts during normal conditions.
                </p>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  The invention addresses the unique challenges faced by the Hampton Roads region, with particular attention to the needs of Virginia Beach's oceanfront and bay areas. The modular design allows for scalable implementation based on municipal budgets and can be adapted to various coastal typologies present in the region.
                </p>
                
                <h3 className="text-base font-medium mt-4 mb-2">Key Claims</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-text-secondary">
                  <li>A deployable flood barrier system comprising interconnected modular units that can be rapidly installed prior to storm events.</li>
                  <li>A locking mechanism allowing individual barrier sections to create watertight seals when connected.</li>
                  <li>Integration points designed to connect with existing seawall and hardened infrastructure.</li>
                  <li>A hydraulic deployment system allowing installation by minimal personnel.</li>
                  <li>Materials engineered to withstand impact from floating debris and wave action.</li>
                </ol>
              </div>
            )}
            
            {selectedDocument.type === 'engineering_drawing' && (
              <div className="mb-4">
                <h3 className="text-base font-medium mb-2">Drawing Details</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  These technical engineering drawings detail the proposed modifications to the Hampton Roads Bridge-Tunnel (HRBT) expansion project. The drawings include structural specifications, materials requirements, and integration plans with existing infrastructure. Special attention is given to designing for increased sea level rise and more frequent storm surge events expected in the coming decades.
                </p>
                
                <div className="mt-4 bg-bg-dark p-4 rounded-md border border-border-color flex justify-center items-center h-60">
                  <div className="text-center">
                    <p className="text-text-secondary mb-2">Engineering Drawing Preview</p>
                    <p className="text-xs text-text-secondary opacity-60">[Preview requires CAD viewer]</p>
                  </div>
                </div>
                
                <h3 className="text-base font-medium mt-4 mb-2">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-bg-panel p-3 rounded-md">
                    <h4 className="font-medium text-xs mb-1 text-primary">Materials</h4>
                    <ul className="list-disc pl-4 text-xs text-text-secondary space-y-1">
                      <li>High-strength marine-grade concrete (Type M75)</li>
                      <li>Corrosion-resistant reinforcement (316L stainless)</li>
                      <li>Elastomeric bearing pads with 75-year service life</li>
                      <li>Marine-grade protective coatings</li>
                    </ul>
                  </div>
                  <div className="bg-bg-panel p-3 rounded-md">
                    <h4 className="font-medium text-xs mb-1 text-primary">Design Parameters</h4>
                    <ul className="list-disc pl-4 text-xs text-text-secondary space-y-1">
                      <li>Category 3 hurricane resistance</li>
                      <li>Wave loads up to 8 meters</li>
                      <li>2 feet SLR accommodation</li>
                      <li>100-year service life</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-5 flex flex-wrap gap-2 justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs flex items-center">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="text-xs flex items-center">
                  <Share className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="text-xs flex items-center">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}