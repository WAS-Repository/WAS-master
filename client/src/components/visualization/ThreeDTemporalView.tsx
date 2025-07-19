import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Layers3, Calendar, Network } from 'lucide-react';

interface DocumentNode {
  id: string;
  title: string;
  type: 'document' | 'patent' | 'research' | 'telemetry';
  timestamp: Date;
  position: [number, number, number];
  connections: string[];
  version: number;
  metadata?: {
    author?: string;
    originality?: number;
    citations?: number;
    telemetryData?: any;
  };
}

interface ThreeDTemporalViewProps {
  onNodeSelect?: (node: DocumentNode) => void;
}

// Generate sample data for demonstration
const generateSampleData = (): DocumentNode[] => {
  const nodes: DocumentNode[] = [];
  const baseTime = new Date('2023-01-01');
  
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 2;
    const radius = 5 + Math.random() * 10;
    const height = (i / 50) * 10 - 5;
    
    nodes.push({
      id: `node-${i}`,
      title: `Document ${i + 1}`,
      type: ['document', 'patent', 'research', 'telemetry'][Math.floor(Math.random() * 4)] as any,
      timestamp: new Date(baseTime.getTime() + i * 24 * 60 * 60 * 1000 * 7), // Weekly intervals
      position: [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ],
      connections: i > 0 ? [`node-${Math.floor(Math.random() * i)}`] : [],
      version: Math.floor(Math.random() * 5) + 1,
      metadata: {
        author: `Author ${Math.floor(Math.random() * 10) + 1}`,
        originality: Math.random() * 100,
        citations: Math.floor(Math.random() * 50),
        telemetryData: { views: Math.floor(Math.random() * 1000) }
      }
    });
  }
  
  return nodes;
};

// Individual document node component
function DocumentNode3D({ node, isVisible, onClick, isHighlighted }: { 
  node: DocumentNode; 
  isVisible: boolean; 
  onClick: () => void;
  isHighlighted: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y += delta * 0.2;
      
      // Pulse effect for highlighted nodes
      if (isHighlighted) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
      }
    }
  });
  
  const color = {
    document: '#3B82F6', // blue
    patent: '#10B981', // green
    research: '#F59E0B', // amber
    telemetry: '#8B5CF6' // purple
  }[node.type];
  
  if (!isVisible) return null;
  
  return (
    <group position={node.position}>
      <Box
        ref={meshRef}
        args={[0.5, 0.5, 0.5]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-background/90 backdrop-blur border border-border p-2 text-xs max-w-[200px]">
            <h4 className="font-semibold">{node.title}</h4>
            <p className="text-muted-foreground">Type: {node.type}</p>
            <p className="text-muted-foreground">Version: {node.version}</p>
            <p className="text-muted-foreground">Date: {node.timestamp.toLocaleDateString()}</p>
            {node.metadata?.author && (
              <p className="text-muted-foreground">Author: {node.metadata.author}</p>
            )}
            {node.metadata?.originality && (
              <p className="text-muted-foreground">Originality: {node.metadata.originality.toFixed(0)}%</p>
            )}
          </div>
        </Html>
      )}
      
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.title}
      </Text>
    </group>
  );
}

// Connection lines between nodes
function ConnectionLines({ nodes, visibleNodes }: { 
  nodes: DocumentNode[]; 
  visibleNodes: Set<string>;
}) {
  const lines = useMemo(() => {
    const lineElements: JSX.Element[] = [];
    
    nodes.forEach(node => {
      if (!visibleNodes.has(node.id)) return;
      
      node.connections.forEach(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (!targetNode || !visibleNodes.has(targetId)) return;
        
        const points = [
          new THREE.Vector3(...node.position),
          new THREE.Vector3(...targetNode.position)
        ];
        
        lineElements.push(
          <Line
            key={`${node.id}-${targetId}`}
            points={points}
            color="#ffffff"
            lineWidth={1}
            opacity={0.3}
            transparent
          />
        );
      });
    });
    
    return lineElements;
  }, [nodes, visibleNodes]);
  
  return <>{lines}</>;
}

// Main 3D scene component
function Scene({ nodes, currentTime, onNodeSelect }: { 
  nodes: DocumentNode[]; 
  currentTime: Date;
  onNodeSelect: (node: DocumentNode) => void;
}) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Calculate which nodes should be visible based on current time
  const visibleNodes = useMemo(() => {
    const visible = new Set<string>();
    nodes.forEach(node => {
      if (node.timestamp <= currentTime) {
        visible.add(node.id);
      }
    });
    return visible;
  }, [nodes, currentTime]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Grid helper for spatial reference */}
      <gridHelper args={[30, 30]} position={[0, -5, 0]} />
      
      {/* Document nodes */}
      {nodes.map(node => (
        <DocumentNode3D
          key={node.id}
          node={node}
          isVisible={visibleNodes.has(node.id)}
          isHighlighted={selectedNode === node.id}
          onClick={() => {
            setSelectedNode(node.id);
            onNodeSelect(node);
          }}
        />
      ))}
      
      {/* Connections */}
      <ConnectionLines nodes={nodes} visibleNodes={visibleNodes} />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.5}
        panSpeed={0.5}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function ThreeDTemporalView({ onNodeSelect }: ThreeDTemporalViewProps) {
  const [nodes] = useState(() => generateSampleData());
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRange, setTimeRange] = useState([0]);
  const [selectedNode, setSelectedNode] = useState<DocumentNode | null>(null);
  
  // Calculate time bounds
  const timeBounds = useMemo(() => {
    if (nodes.length === 0) return { min: new Date(), max: new Date() };
    
    const timestamps = nodes.map(n => n.timestamp.getTime());
    return {
      min: new Date(Math.min(...timestamps)),
      max: new Date(Math.max(...timestamps))
    };
  }, [nodes]);
  
  const currentTime = useMemo(() => {
    const range = timeBounds.max.getTime() - timeBounds.min.getTime();
    return new Date(timeBounds.min.getTime() + (range * timeRange[0]) / 100);
  }, [timeRange, timeBounds]);
  
  // Auto-play timeline
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTimeRange(prev => {
        const next = prev[0] + 1;
        if (next > 100) {
          setIsPlaying(false);
          return [100];
        }
        return [next];
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  const handleNodeSelect = (node: DocumentNode) => {
    setSelectedNode(node);
    onNodeSelect?.(node);
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [15, 10, 15], fov: 60 }}
          className="w-full h-full"
        >
          <Scene 
            nodes={nodes} 
            currentTime={currentTime}
            onNodeSelect={handleNodeSelect}
          />
        </Canvas>
        
        {/* Overlay info */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur border border-border p-4 max-w-xs">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Layers3 className="h-4 w-4" />
            3D Temporal Archive
          </h3>
          <p className="text-xs text-muted-foreground mb-1">
            Navigate through time to explore document evolution
          </p>
          <p className="text-xs text-muted-foreground">
            {nodes.filter(n => n.timestamp <= currentTime).length} / {nodes.length} documents visible
          </p>
        </div>
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur border border-border p-4">
          <h4 className="text-xs font-semibold mb-2">Document Types</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500" />
              <span>Document</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500" />
              <span>Patent</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-amber-500" />
              <span>Research</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-purple-500" />
              <span>Telemetry</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeline controls */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTimeRange([0]);
              setIsPlaying(false);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 flex items-center gap-4">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={timeRange}
              onValueChange={setTimeRange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground min-w-[120px]">
              {currentTime.toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {selectedNode && (
          <div className="mt-4 p-3 bg-muted/50 border border-border">
            <h4 className="text-sm font-semibold">{selectedNode.title}</h4>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Type:</span> {selectedNode.type}
              </div>
              <div>
                <span className="text-muted-foreground">Version:</span> {selectedNode.version}
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span> {selectedNode.timestamp.toLocaleDateString()}
              </div>
              <div>
                <span className="text-muted-foreground">Connections:</span> {selectedNode.connections.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}