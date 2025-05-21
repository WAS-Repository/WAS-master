import { useRef, useEffect, useState } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, Move, RotateCcw, Share } from 'lucide-react';

interface Node extends SimulationNodeDatum {
  id: string;
  name: string;
  type: 'document' | 'locality' | 'central';
  category?: string;
  authors?: string[];
  publishedDate?: string;
  institution?: string;
  localities?: string[];
}

interface Link extends SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

const sampleData = {
  nodes: [
    { id: "center", name: "Hampton Roads", type: "central" },
    
    // Research Papers
    { id: "doc1", name: "Coastal Erosion Study", type: "document", category: "research_paper", 
      authors: ["James R. Smith", "Maria Delgado"], publishedDate: "2021-03-15", 
      institution: "Old Dominion University", localities: ["Virginia Beach", "Norfolk", "Hampton"] },
    { id: "doc2", name: "Naval Base Impact", type: "document", category: "research_paper",
      authors: ["Robert Johnson"], publishedDate: "2020-08-22", 
      institution: "Naval Research Lab", localities: ["Norfolk"] },
    
    // Patents
    { id: "doc3", name: "Flood Barrier Patent", type: "document", category: "patent",
      authors: ["Jennifer Lee"], publishedDate: "2019-06-10", 
      institution: "Virginia Tech", localities: ["Virginia Beach"] },
    { id: "doc4", name: "Port Technology Patent", type: "document", category: "patent",
      authors: ["Michael Chen"], publishedDate: "2018-11-15", 
      institution: "Port Authority", localities: ["Portsmouth"] },
    
    // Engineering Drawings
    { id: "doc5", name: "Bridge Structure", type: "document", category: "engineering_drawing",
      authors: ["Sarah Williams"], publishedDate: "2017-07-30", 
      institution: "Transportation Dept", localities: ["Hampton"] },
    { id: "doc6", name: "Port Facility", type: "document", category: "engineering_drawing",
      authors: ["David Miller"], publishedDate: "2018-03-22", 
      institution: "Port Authority", localities: ["Norfolk"] },
    
    // Localities
    { id: "loc1", name: "Norfolk", type: "locality" },
    { id: "loc2", name: "Portsmouth", type: "locality" },
    { id: "loc3", name: "Virginia Beach", type: "locality" },
  ],
  links: [
    // Connect all documents to central node
    { source: "center", target: "doc1", value: 1 },
    { source: "center", target: "doc2", value: 1 },
    { source: "center", target: "doc3", value: 1 },
    { source: "center", target: "doc4", value: 1 },
    { source: "center", target: "doc5", value: 1 },
    { source: "center", target: "doc6", value: 1 },
    
    // Connect documents to localities
    { source: "doc1", target: "loc1", value: 1 },
    { source: "doc1", target: "loc3", value: 1 },
    { source: "doc2", target: "loc1", value: 1 },
    { source: "doc3", target: "loc3", value: 1 },
    { source: "doc4", target: "loc2", value: 1 },
    { source: "doc5", target: "loc1", value: 1 },
    { source: "doc6", target: "loc1", value: 1 },
    
    // Connect some documents to each other
    { source: "doc1", target: "doc2", value: 0.6 },
    { source: "doc3", target: "doc1", value: 0.5 },
    { source: "doc5", target: "doc6", value: 0.7 },
  ]
};

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filters, setFilters] = useState({
    researchPapers: true,
    patents: true,
    engineeringDrawings: true,
    localities: true
  });
  const [connectionStrength, setConnectionStrength] = useState(70);
  
  // Effect for initializing and updating the graph
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous graph
    svg.selectAll("*").remove();
    
    // Create zoom behavior
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });
    
    svg.call(zoomBehavior);
    
    // Add a group for the graph elements
    const g = svg.append("g");
    
    // Filter nodes based on user preferences
    const filteredNodes = sampleData.nodes.filter(node => {
      if (node.type === "central") return true;
      if (node.type === "locality") return filters.localities;
      if (node.type === "document") {
        if (node.category === "research_paper") return filters.researchPapers;
        if (node.category === "patent") return filters.patents;
        if (node.category === "engineering_drawing") return filters.engineeringDrawings;
      }
      return true;
    });
    
    // Get valid node IDs after filtering
    const validNodeIds = new Set(filteredNodes.map(node => node.id));
    
    // Filter links based on filtered nodes
    const filteredLinks = sampleData.links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      return validNodeIds.has(sourceId) && validNodeIds.has(targetId);
    }).map(link => ({...link, value: link.value * (connectionStrength / 100)}));
    
    // Create the force simulation
    const simulation = forceSimulation<Node, Link>(filteredNodes)
      .force("link", forceLink<Node, Link>(filteredLinks)
        .id(d => d.id)
        .distance(d => 150 / (d.value || 1))
      )
      .force("charge", forceManyBody().strength(-300))
      .force("center", forceCenter(width / 2, height / 2));
    
    // Draw links
    const links = g.append("g")
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "#8E8E8E")
      .attr("stroke-width", d => d.value * 2)
      .attr("stroke-opacity", 0.6);
    
    // Draw nodes
    const nodes = g.append("g")
      .selectAll("circle")
      .data(filteredNodes)
      .enter()
      .append("circle")
      .attr("r", d => d.type === "central" ? 20 : d.type === "locality" ? 10 : 12)
      .attr("fill", d => {
        if (d.type === "central") return "#4285F4";
        if (d.type === "locality") return "#8E8E8E";
        if (d.category === "research_paper") return "#34A853";
        if (d.category === "patent") return "#FBBC05";
        if (d.category === "engineering_drawing") return "#EA4335";
        return "#4285F4";
      })
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d);
      })
      .on("mouseover", function() {
        select(this)
          .transition()
          .duration(200)
          .attr("r", d => (d as any).type === "central" ? 22 : (d as any).type === "locality" ? 12 : 14);
      })
      .on("mouseout", function() {
        select(this)
          .transition()
          .duration(200)
          .attr("r", d => (d as any).type === "central" ? 20 : (d as any).type === "locality" ? 10 : 12);
      });
    
    // Add labels
    const labels = g.append("g")
      .selectAll("text")
      .data(filteredNodes)
      .enter()
      .append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", d => d.type === "central" ? 30 : 25)
      .attr("font-size", d => d.type === "central" ? 12 : 10)
      .attr("fill", "#E1E1E1");
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      links
        .attr("x1", d => (d.source as Node).x ?? 0)
        .attr("y1", d => (d.source as Node).y ?? 0)
        .attr("x2", d => (d.target as Node).x ?? 0)
        .attr("y2", d => (d.target as Node).y ?? 0);
      
      nodes
        .attr("cx", d => d.x ?? 0)
        .attr("cy", d => d.y ?? 0);
      
      labels
        .attr("x", d => d.x ?? 0)
        .attr("y", d => d.y ?? 0);
    });
    
    // Center view
    const centerView = () => {
      svg.transition().duration(750).call(
        zoomBehavior.transform,
        zoomIdentity.translate(width / 2, height / 2).scale(0.8)
      );
    };
    
    centerView();
    
    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [filters, connectionStrength]);
  
  return (
    <div className="relative h-full bg-bg-dark">
      <svg ref={svgRef} width="100%" height="100%" />
      
      {/* Filter Panel */}
      <div className="absolute top-4 right-4 bg-bg-panel bg-opacity-80 p-3 rounded-md shadow-lg">
        <div className="mb-3">
          <h3 className="text-sm font-medium mb-2">Filter by Type</h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <Checkbox 
                id="research-papers" 
                checked={filters.researchPapers} 
                onCheckedChange={(checked) => 
                  setFilters(prev => ({...prev, researchPapers: !!checked}))
                }
                className="mr-2"
              />
              <Label htmlFor="research-papers" className="text-sm">Research Papers</Label>
            </div>
            
            <div className="flex items-center">
              <Checkbox 
                id="patents" 
                checked={filters.patents} 
                onCheckedChange={(checked) => 
                  setFilters(prev => ({...prev, patents: !!checked}))
                }
                className="mr-2"
              />
              <Label htmlFor="patents" className="text-sm">Patents</Label>
            </div>
            
            <div className="flex items-center">
              <Checkbox 
                id="engineering-drawings" 
                checked={filters.engineeringDrawings} 
                onCheckedChange={(checked) => 
                  setFilters(prev => ({...prev, engineeringDrawings: !!checked}))
                }
                className="mr-2"
              />
              <Label htmlFor="engineering-drawings" className="text-sm">Engineering Drawings</Label>
            </div>
            
            <div className="flex items-center">
              <Checkbox 
                id="localities" 
                checked={filters.localities} 
                onCheckedChange={(checked) => 
                  setFilters(prev => ({...prev, localities: !!checked}))
                }
                className="mr-2"
              />
              <Label htmlFor="localities" className="text-sm">Localities</Label>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <h3 className="text-sm font-medium mb-2">View Controls</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" className="flex items-center justify-center">
              <Search className="h-4 w-4 mr-1" />
              Zoom
            </Button>
            <Button variant="secondary" size="sm" className="flex items-center justify-center">
              <Move className="h-4 w-4 mr-1" />
              Pan
            </Button>
            <Button variant="secondary" size="sm" className="flex items-center justify-center">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button variant="secondary" size="sm" className="flex items-center justify-center">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Connection Strength</h3>
          <Slider
            value={[connectionStrength]}
            min={1}
            max={100}
            step={1}
            onValueChange={([value]) => setConnectionStrength(value)}
          />
        </div>
      </div>
      
      {/* Node Details Panel */}
      {selectedNode && (
        <Card className="absolute bottom-4 left-4 bg-bg-panel bg-opacity-80 p-0 rounded-md shadow-lg max-w-md">
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-medium ${
                selectedNode.category === "research_paper" ? "text-primary" : 
                selectedNode.category === "patent" ? "text-accent" : 
                selectedNode.category === "engineering_drawing" ? "text-secondary" :
                "text-text-primary"
              }`}>
                {selectedNode.name}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            
            {selectedNode.type === "document" && (
              <>
                <div className="text-xs space-y-1 font-mono text-text-secondary mb-2">
                  {selectedNode.authors && (
                    <p><span className="text-accent">Authors:</span> {selectedNode.authors.join(", ")}</p>
                  )}
                  {selectedNode.publishedDate && (
                    <p><span className="text-accent">Published:</span> {selectedNode.publishedDate}</p>
                  )}
                  {selectedNode.institution && (
                    <p><span className="text-accent">Institution:</span> {selectedNode.institution}</p>
                  )}
                  {selectedNode.localities && (
                    <p><span className="text-accent">Localities:</span> {selectedNode.localities.join(", ")}</p>
                  )}
                </div>
                <div className="text-xs text-text-primary font-medium mb-2">Abstract:</div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {selectedNode.category === "research_paper" 
                    ? "This study examines the coastal erosion patterns affecting the Hampton Roads area, with particular focus on climate change impacts. The research provides data-driven projections and potential mitigation strategies for local municipalities." 
                    : selectedNode.category === "patent"
                    ? "This patent describes a novel approach to flood barrier systems specifically designed for coastal urban areas with high population density." 
                    : "Engineering schematic detailing structural specifications for infrastructure improvements in the Hampton Roads region."}
                </p>
                
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" className="bg-primary text-white">
                    View Document
                  </Button>
                  <Button variant="outline" size="sm">
                    Show Connections
                  </Button>
                </div>
              </>
            )}
            
            {selectedNode.type === "locality" && (
              <>
                <div className="text-xs space-y-1 font-mono text-text-secondary mb-2">
                  <p><span className="text-accent">Type:</span> Municipality</p>
                  <p><span className="text-accent">Region:</span> Hampton Roads, Virginia</p>
                  <p><span className="text-accent">Related Documents:</span> 5</p>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {selectedNode.name} is a locality within the Hampton Roads metropolitan area of Virginia, with significant research and engineering documentation related to coastal management and infrastructure.
                </p>
                
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" className="bg-primary text-white">
                    View on Map
                  </Button>
                  <Button variant="outline" size="sm">
                    List Documents
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
