// Graph data structure and utilities

export interface GraphNode {
  id: string;
  label: string;
  type: 'document' | 'locality' | 'center';
  category?: string;
  properties?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  weight: number;
}

export class Graph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
  
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }
  
  addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }
  
  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }
  
  removeNode(id: string): void {
    // Remove the node
    this.nodes.delete(id);
    
    // Remove any edges connected to this node
    for (const [edgeId, edge] of this.edges.entries()) {
      if (edge.source === id || edge.target === id) {
        this.edges.delete(edgeId);
      }
    }
  }
  
  addEdge(edge: GraphEdge): void {
    // Generate ID if not provided
    const edgeId = edge.id || `${edge.source}-${edge.target}`;
    const edgeWithId = { ...edge, id: edgeId };
    
    // Ensure both nodes exist
    if (!this.nodes.has(edge.source) || !this.nodes.has(edge.target)) {
      throw new Error(`Cannot add edge from ${edge.source} to ${edge.target}: one or both nodes don't exist`);
    }
    
    this.edges.set(edgeId, edgeWithId);
  }
  
  getEdge(id: string): GraphEdge | undefined {
    return this.edges.get(id);
  }
  
  removeEdge(id: string): void {
    this.edges.delete(id);
  }
  
  getNeighbors(nodeId: string): GraphNode[] {
    const neighbors: GraphNode[] = [];
    
    for (const edge of this.edges.values()) {
      if (edge.source === nodeId) {
        const targetNode = this.nodes.get(edge.target);
        if (targetNode) {
          neighbors.push(targetNode);
        }
      } else if (edge.target === nodeId) {
        const sourceNode = this.nodes.get(edge.source);
        if (sourceNode) {
          neighbors.push(sourceNode);
        }
      }
    }
    
    return neighbors;
  }
  
  getConnectedEdges(nodeId: string): GraphEdge[] {
    const connectedEdges: GraphEdge[] = [];
    
    for (const edge of this.edges.values()) {
      if (edge.source === nodeId || edge.target === nodeId) {
        connectedEdges.push(edge);
      }
    }
    
    return connectedEdges;
  }
  
  // Export the graph data to a format suitable for D3 force simulation
  toD3Format() {
    return {
      nodes: Array.from(this.nodes.values()).map(node => ({
        ...node,
        // Add any D3-specific properties here
      })),
      links: Array.from(this.edges.values()).map(edge => ({
        source: edge.source,
        target: edge.target,
        value: edge.weight,
        // Add any D3-specific properties here
      }))
    };
  }
  
  // Export to GraphML format
  toGraphML(): string {
    let graphml = `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns">
  <key id="type" for="node" attr.name="type" attr.type="string"/>
  <key id="category" for="node" attr.name="category" attr.type="string"/>
  <key id="label" for="edge" attr.name="label" attr.type="string"/>
  <key id="weight" for="edge" attr.name="weight" attr.type="double"/>
  <graph id="G" edgedefault="directed">
`;
    
    // Add nodes
    for (const node of this.nodes.values()) {
      graphml += `    <node id="${node.id}">
      <data key="type">${node.type}</data>
${node.category ? `      <data key="category">${node.category}</data>\n` : ''}    </node>\n`;
    }
    
    // Add edges
    for (const edge of this.edges.values()) {
      graphml += `    <edge id="${edge.id}" source="${edge.source}" target="${edge.target}">
${edge.label ? `      <data key="label">${edge.label}</data>\n` : ''}      <data key="weight">${edge.weight}</data>
    </edge>\n`;
    }
    
    graphml += `  </graph>
</graphml>`;
    
    return graphml;
  }
}
