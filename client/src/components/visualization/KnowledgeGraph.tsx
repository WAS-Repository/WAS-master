import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize, ChevronDown } from 'lucide-react';
import * as d3 from 'd3-force';
import { select } from 'd3-selection';
import { zoom } from 'd3-zoom';

// Sample data for the knowledge graph
const sampleNodes = [
  { id: 'doc1', label: 'Coastal Erosion Study', type: 'document', category: 'research_paper' },
  { id: 'doc2', label: 'Flood Barrier System', type: 'document', category: 'patent' },
  { id: 'doc3', label: 'Port Facility Norfolk', type: 'document', category: 'engineering_drawing' },
  { id: 'doc4', label: 'Naval Base Impact', type: 'document', category: 'research_paper' },
  { id: 'doc5', label: 'Sea Level Rise Projections', type: 'document', category: 'research_paper' },
  { id: 'loc1', label: 'Norfolk', type: 'locality' },
  { id: 'loc2', label: 'Virginia Beach', type: 'locality' },
  { id: 'loc3', label: 'Hampton', type: 'locality' },
  { id: 'loc4', label: 'Portsmouth', type: 'locality' },
  { id: 'center1', label: 'ODU Research Center', type: 'center' },
  { id: 'center2', label: 'VIMS', type: 'center' }
];

const sampleLinks = [
  { id: 'link1', source: 'doc1', target: 'loc1', weight: 3 },
  { id: 'link2', source: 'doc1', target: 'loc2', weight: 2 },
  { id: 'link3', source: 'doc1', target: 'loc3', weight: 1 },
  { id: 'link4', source: 'doc2', target: 'loc2', weight: 3 },
  { id: 'link5', source: 'doc3', target: 'loc1', weight: 3 },
  { id: 'link6', source: 'doc4', target: 'loc1', weight: 3 },
  { id: 'link7', source: 'doc5', target: 'loc1', weight: 2 },
  { id: 'link8', source: 'doc5', target: 'loc2', weight: 2 },
  { id: 'link9', source: 'doc5', target: 'loc3', weight: 2 },
  { id: 'link10', source: 'doc5', target: 'loc4', weight: 2 },
  { id: 'link11', source: 'doc1', target: 'center1', weight: 1 },
  { id: 'link12', source: 'doc5', target: 'center2', weight: 1 },
  { id: 'link13', source: 'doc1', target: 'doc5', weight: 2 }
];

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'document' | 'locality' | 'center';
  category?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  id: string;
  source: string | Node;
  target: string | Node;
  weight: number;
}

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const isMobile = useIsMobile();
  const [nodes, setNodes] = useState<Node[]>(sampleNodes);
  const [links, setLinks] = useState<Link[]>(sampleLinks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    researchPapers: true,
    patents: true,
    drawings: true,
    localities: true,
    centers: true
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Filter nodes based on search query and type filters
  const filteredNodes = nodes.filter(node => {
    // Search filter
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filters
    const matchesType = 
      (node.type === 'document' && node.category === 'research_paper' && filters.researchPapers) ||
      (node.type === 'document' && node.category === 'patent' && filters.patents) ||
      (node.type === 'document' && node.category === 'engineering_drawing' && filters.drawings) ||
      (node.type === 'locality' && filters.localities) ||
      (node.type === 'center' && filters.centers);
    
    return matchesSearch && matchesType;
  });
  
  // Filter links to only include connections between filtered nodes
  const filteredLinks = links.filter(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    
    return filteredNodes.some(node => node.id === sourceId) && 
           filteredNodes.some(node => node.id === targetId);
  });

  // Reset the graph to default position
  const resetGraph = () => {
    if (svgRef.current) {
      select(svgRef.current)
        .call(zoom().transform as any, d3.zoomIdentity);
    }
    setZoomLevel(1);
  };

  // Zoom in function
  const zoomIn = () => {
    if (svgRef.current) {
      select(svgRef.current)
        .transition()
        .call((zoom().scaleBy as any), 1.5);
      setZoomLevel(prev => prev * 1.5);
    }
  };

  // Zoom out function
  const zoomOut = () => {
    if (svgRef.current) {
      select(svgRef.current)
        .transition()
        .call((zoom().scaleBy as any), 0.75);
      setZoomLevel(prev => prev * 0.75);
    }
  };

  // Graph visualization using D3
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous graph
    select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    const svg = select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .call((zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          container.attr("transform", event.transform);
          setZoomLevel(event.transform.k);
        }) as any));

    const container = svg.append("g");
    
    // Create the simulation
    const simulation = d3.forceSimulation(filteredNodes as any)
      .force("link", d3.forceLink(filteredLinks)
        .id((d: any) => d.id)
        .distance(d => 100 / (d as any).weight)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    // Draw the links
    const link = container.append("g")
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "#64748b")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.weight));

    // Create node groups
    const node = container.append("g")
      .selectAll(".node")
      .data(filteredNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call((d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any))
      .on("click", (event, d) => {
        setSelectedNode(d as Node);
        event.stopPropagation();
      });

    // Clear selection when clicking on background
    svg.on("click", () => {
      setSelectedNode(null);
    });

    // Node circles with different colors based on type
    node.append("circle")
      .attr("r", 8)
      .attr("fill", (d: any) => {
        if (d.type === 'document') {
          if (d.category === 'research_paper') return "#3b82f6"; // Blue
          if (d.category === 'patent') return "#10b981"; // Green
          if (d.category === 'engineering_drawing') return "#f59e0b"; // Amber
          return "#64748b"; // Default gray
        }
        if (d.type === 'locality') return "#f43f5e"; // Red
        if (d.type === 'center') return "#8b5cf6"; // Purple
        return "#64748b"; // Default gray
      })
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1.5);
    
    // Node labels
    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .attr("font-size", isMobile ? "8px" : "10px")
      .attr("fill", "#e2e8f0")
      .text((d: any) => d.label.length > 20 ? d.label.substring(0, 20) + '...' : d.label);
    
    // Update node and link positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Add zoom controls
    /* We're using buttons outside SVG instead
    svg.append("g")
      .attr("transform", `translate(${width - 70}, 20)`)
      .attr("class", "zoom-controls")
      .call((g) => {
        // Zoom in button
        g.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "#1e293b")
          .attr("rx", 4)
          .on("click", zoomIn);
        
        g.append("text")
          .attr("x", 10)
          .attr("y", 13)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("fill", "#e2e8f0")
          .text("+")
          .on("click", zoomIn);
        
        // Zoom out button
        g.append("rect")
          .attr("x", 30)
          .attr("y", 0)
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "#1e293b")
          .attr("rx", 4)
          .on("click", zoomOut);
        
        g.append("text")
          .attr("x", 40)
          .attr("y", 13)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("fill", "#e2e8f0")
          .text("-")
          .on("click", zoomOut);
      });
    */
    
    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, isMobile]);

  return (
    <div className="h-full flex flex-col relative bg-slate-900">
      {/* Controls */}
      <div className="p-2 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-900">
        <div className="flex-grow relative">
          <Input 
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-400 text-sm"
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 p-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>

          <Button 
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 p-1"
            onClick={zoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 p-1"
            onClick={zoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 p-1"
            onClick={resetGraph}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className="p-2 border-b border-slate-800 bg-slate-800">
          <div className="text-xs text-slate-300 font-medium mb-2">Filter by type:</div>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={filters.researchPapers ? "default" : "outline"}
              className={`cursor-pointer ${filters.researchPapers ? 'bg-blue-600' : 'bg-slate-800 text-slate-400'}`}
              onClick={() => setFilters({...filters, researchPapers: !filters.researchPapers})}
            >
              Research Papers
            </Badge>
            <Badge 
              variant={filters.patents ? "default" : "outline"}
              className={`cursor-pointer ${filters.patents ? 'bg-green-600' : 'bg-slate-800 text-slate-400'}`}
              onClick={() => setFilters({...filters, patents: !filters.patents})}
            >
              Patents
            </Badge>
            <Badge 
              variant={filters.drawings ? "default" : "outline"}
              className={`cursor-pointer ${filters.drawings ? 'bg-amber-600' : 'bg-slate-800 text-slate-400'}`}
              onClick={() => setFilters({...filters, drawings: !filters.drawings})}
            >
              Engineering Drawings
            </Badge>
            <Badge 
              variant={filters.localities ? "default" : "outline"}
              className={`cursor-pointer ${filters.localities ? 'bg-red-600' : 'bg-slate-800 text-slate-400'}`}
              onClick={() => setFilters({...filters, localities: !filters.localities})}
            >
              Localities
            </Badge>
            <Badge 
              variant={filters.centers ? "default" : "outline"}
              className={`cursor-pointer ${filters.centers ? 'bg-purple-600' : 'bg-slate-800 text-slate-400'}`}
              onClick={() => setFilters({...filters, centers: !filters.centers})}
            >
              Research Centers
            </Badge>
          </div>
        </div>
      )}
      
      {/* Graph SVG */}
      <div className="relative flex-grow overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" className="bg-slate-900"></svg>
        
        {/* Selected Node Info Panel */}
        {selectedNode && (
          <div className="absolute bottom-2 left-2 right-2 max-h-[40%] bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-y-auto p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-slate-200 text-sm">{selectedNode.label}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`
                      ${selectedNode.type === 'document' && selectedNode.category === 'research_paper' ? 'bg-blue-600' : ''}
                      ${selectedNode.type === 'document' && selectedNode.category === 'patent' ? 'bg-green-600' : ''}
                      ${selectedNode.type === 'document' && selectedNode.category === 'engineering_drawing' ? 'bg-amber-600' : ''}
                      ${selectedNode.type === 'locality' ? 'bg-red-600' : ''}
                      ${selectedNode.type === 'center' ? 'bg-purple-600' : ''}
                    `}
                  >
                    {selectedNode.type === 'document' 
                      ? selectedNode.category === 'research_paper' 
                        ? 'Research Paper'
                        : selectedNode.category === 'patent'
                          ? 'Patent'
                          : 'Engineering Drawing'
                      : selectedNode.type === 'locality'
                        ? 'Locality'
                        : 'Research Center'
                    }
                  </Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-1 h-6 w-6"
                onClick={() => setSelectedNode(null)}
              >
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
            
            <div className="text-xs text-slate-300 mt-3">
              <div className="font-medium">Connected to:</div>
              <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                {links
                  .filter(link => {
                    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
                    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
                    return sourceId === selectedNode.id || targetId === selectedNode.id;
                  })
                  .map(link => {
                    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
                    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
                    const connectedNodeId = sourceId === selectedNode.id ? targetId : sourceId;
                    const connectedNode = nodes.find(node => node.id === connectedNodeId);
                    
                    if (!connectedNode) return null;
                    
                    return (
                      <div 
                        key={link.id} 
                        className="flex items-center justify-between p-1 rounded hover:bg-slate-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(connectedNode);
                        }}
                      >
                        <span>{connectedNode.label}</span>
                        <Badge 
                          variant="outline" 
                          className="text-[10px]"
                        >
                          {link.weight === 3 ? 'Strong' : link.weight === 2 ? 'Medium' : 'Weak'}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
              
              {/* View details button - would navigate to document page */}
              <Button 
                variant="default" 
                size="sm"
                className="w-full mt-3 text-xs bg-slate-700 hover:bg-slate-600"
              >
                View details
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile zoom level indicator */}
      {isMobile && (
        <div className="absolute bottom-2 right-2 bg-slate-800 rounded-full px-2 py-1 text-xs text-slate-400 border border-slate-700">
          {Math.round(zoomLevel * 100)}%
        </div>
      )}
    </div>
  );
}