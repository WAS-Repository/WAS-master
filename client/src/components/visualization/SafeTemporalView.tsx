import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Layers3, Calendar, Box } from 'lucide-react';

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

interface SafeTemporalViewProps {
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

export default function SafeTemporalView({ onNodeSelect }: SafeTemporalViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRange, setTimeRange] = useState([0]);
  const [selectedNode, setSelectedNode] = useState<DocumentNode | null>(null);
  const nodes = useState(() => generateSampleData())[0];

  useEffect(() => {
    if (frameRef.current && containerRef.current) {
      // Create iframe content that loads Three.js independently
      const iframeDoc = frameRef.current.contentDocument;
      if (!iframeDoc) return;

      // Write the 3D temporal HTML directly to iframe to isolate from wallet extensions
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; overflow: hidden; background: #000000; }
              canvas { display: block; }
              .info {
                position: absolute;
                top: 10px;
                left: 10px;
                color: white;
                font-family: Arial, sans-serif;
                font-size: 12px;
                background: rgba(0,0,0,0.7);
                padding: 10px;
                border-radius: 4px;
              }
              .legend {
                position: absolute;
                top: 10px;
                right: 10px;
                color: white;
                font-family: Arial, sans-serif;
                font-size: 11px;
                background: rgba(0,0,0,0.7);
                padding: 10px;
                border-radius: 4px;
              }
              .legend-item {
                display: flex;
                align-items: center;
                margin: 4px 0;
              }
              .legend-color {
                width: 12px;
                height: 12px;
                margin-right: 6px;
              }
            </style>
          </head>
          <body>
            <div class="info">
              <strong>3D Temporal Archive</strong><br>
              <span id="nodeCount">0 / 50 documents visible</span>
            </div>
            <div class="legend">
              <strong>Document Types</strong>
              <div class="legend-item">
                <div class="legend-color" style="background: #3B82F6;"></div>
                <span>Document</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #10B981;"></div>
                <span>Patent</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #F59E0B;"></div>
                <span>Research</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #8B5CF6;"></div>
                <span>Telemetry</span>
              </div>
            </div>
            <div id="container"></div>
            <script type="module">
              // Import Three.js from CDN to avoid wallet conflicts
              import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
              
              // Sample nodes data
              const nodes = ${JSON.stringify(nodes)};
              let currentTimeValue = 0;
              let selectedNodeId = null;
              
              // Create scene
              const scene = new THREE.Scene();
              scene.fog = new THREE.Fog(0x000000, 10, 100);
              
              const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
              camera.position.set(15, 10, 15);
              camera.lookAt(0, 0, 0);
              
              const renderer = new THREE.WebGLRenderer({ antialias: true });
              renderer.setSize(window.innerWidth, window.innerHeight);
              renderer.setPixelRatio(window.devicePixelRatio);
              document.getElementById('container').appendChild(renderer.domElement);
              
              // Lighting
              const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
              scene.add(ambientLight);
              
              const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
              directionalLight.position.set(10, 20, 10);
              scene.add(directionalLight);
              
              // Grid helper
              const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x222222);
              scene.add(gridHelper);
              
              // Create node meshes
              const nodeMeshes = [];
              const nodeConnections = [];
              const nodeColors = {
                document: 0x3B82F6,
                patent: 0x10B981,
                research: 0xF59E0B,
                telemetry: 0x8B5CF6
              };
              
              nodes.forEach((node, index) => {
                const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const material = new THREE.MeshPhongMaterial({
                  color: nodeColors[node.type],
                  emissive: nodeColors[node.type],
                  emissiveIntensity: 0.2
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(...node.position);
                mesh.userData = { node, index };
                mesh.visible = false; // Start hidden
                scene.add(mesh);
                nodeMeshes.push(mesh);
                
                // Create connections
                node.connections.forEach(targetId => {
                  const targetIndex = nodes.findIndex(n => n.id === targetId);
                  if (targetIndex !== -1) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                      new THREE.Vector3(...node.position),
                      new THREE.Vector3(...nodes[targetIndex].position)
                    ]);
                    const lineMaterial = new THREE.LineBasicMaterial({
                      color: 0x4444ff,
                      opacity: 0.3,
                      transparent: true
                    });
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    line.visible = false;
                    scene.add(line);
                    nodeConnections.push({ line, sourceIndex: index, targetIndex });
                  }
                });
              });
              
              // Update visibility based on time
              function updateVisibility(timeProgress) {
                const visibleCount = Math.floor((timeProgress / 100) * nodes.length);
                
                nodeMeshes.forEach((mesh, index) => {
                  mesh.visible = index < visibleCount;
                  
                  // Pulse selected node
                  if (mesh.userData.node.id === selectedNodeId) {
                    const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
                    mesh.scale.set(scale, scale, scale);
                  } else {
                    mesh.scale.set(1, 1, 1);
                  }
                });
                
                nodeConnections.forEach(({ line, sourceIndex, targetIndex }) => {
                  line.visible = sourceIndex < visibleCount && targetIndex < visibleCount;
                });
                
                document.getElementById('nodeCount').textContent = visibleCount + ' / ' + nodes.length + ' documents visible';
              }
              
              // Camera rotation
              let angle = 0;
              function updateCamera() {
                angle += 0.005;
                const radius = 20;
                camera.position.x = Math.cos(angle) * radius;
                camera.position.z = Math.sin(angle) * radius;
                camera.position.y = 10;
                camera.lookAt(0, 0, 0);
              }
              
              // Animation loop
              function animate() {
                requestAnimationFrame(animate);
                updateCamera();
                updateVisibility(currentTimeValue);
                renderer.render(scene, camera);
              }
              
              // Handle window resize
              window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
              });
              
              // Listen for messages from parent
              window.addEventListener('message', (e) => {
                if (e.data.type === 'setTime') {
                  currentTimeValue = e.data.value;
                } else if (e.data.type === 'selectNode') {
                  selectedNodeId = e.data.nodeId;
                }
              });
              
              // Start animation
              animate();
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();
      
      setIsLoading(false);
    }
  }, [nodes]);

  // Send time updates to iframe
  useEffect(() => {
    if (frameRef.current && frameRef.current.contentWindow) {
      frameRef.current.contentWindow.postMessage({ 
        type: 'setTime', 
        value: timeRange[0] 
      }, '*');
    }
  }, [timeRange]);

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
    
    if (frameRef.current && frameRef.current.contentWindow) {
      frameRef.current.contentWindow.postMessage({ 
        type: 'selectNode', 
        nodeId: node.id 
      }, '*');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* 3D Canvas - isolated in iframe */}
      <div className="flex-1 relative" ref={containerRef}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <Layers3 size={48} className="mx-auto mb-4 text-gray-500 animate-pulse" />
              <p className="text-gray-400">Loading 3D temporal archive...</p>
            </div>
          </div>
        )}
        
        <iframe
          ref={frameRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="3D Temporal Visualization"
        />
      </div>
      
      {/* Timeline controls */}
      <div className="border-t border-[#3e3e3e] bg-[#1a1a1a] p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 bg-[#2d2d2d] border-[#3e3e3e] hover:bg-[#3e3e3e]"
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
            className="bg-[#2d2d2d] border-[#3e3e3e] hover:bg-[#3e3e3e]"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 flex items-center gap-4">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Slider
              value={timeRange}
              onValueChange={setTimeRange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-gray-400 min-w-[60px]">
              {Math.floor((timeRange[0] / 100) * nodes.length)} / {nodes.length}
            </span>
          </div>
        </div>
        
        {selectedNode && (
          <div className="mt-3 p-3 bg-[#2d2d2d] border border-[#3e3e3e]">
            <h4 className="text-sm font-semibold mb-1">{selectedNode.title}</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Type: {selectedNode.type}</p>
              <p>Author: {selectedNode.metadata?.author}</p>
              <p>Citations: {selectedNode.metadata?.citations}</p>
              <p>Version: {selectedNode.version}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}