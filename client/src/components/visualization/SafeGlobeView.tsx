import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, Pause, Globe, Layers, Info, 
  Plane, Ship, Activity, Wifi, Factory, TrendingUp,
  Cloud, Calendar, Eye, EyeOff
} from 'lucide-react';

interface MapDataPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  type: 'document' | 'locality' | 'event' | 'research-site' | 'telemetry';
  description?: string;
  metadata?: Record<string, any>;
}

interface TelemetryLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  visible: boolean;
  type: 'flights' | 'vessels' | 'health' | 'telecom' | 'production' | 'economy' | 'weather';
}

interface SafeGlobeViewProps {
  data?: MapDataPoint[];
  onDataSelect?: (point: MapDataPoint) => void;
}

export default function SafeGlobeView({ data = [], onDataSelect }: SafeGlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState(12);
  const [showClouds, setShowClouds] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<string>('overview');
  const [telemetryLayers, setTelemetryLayers] = useState<TelemetryLayer[]>([
    { id: 'flights', name: 'Air Traffic', icon: <Plane size={14} />, color: '#3B82F6', visible: true, type: 'flights' },
    { id: 'vessels', name: 'Maritime', icon: <Ship size={14} />, color: '#10B981', visible: false, type: 'vessels' },
    { id: 'health', name: 'Health Data', icon: <Activity size={14} />, color: '#EF4444', visible: false, type: 'health' },
    { id: 'telecom', name: 'Telecom', icon: <Wifi size={14} />, color: '#8B5CF6', visible: true, type: 'telecom' },
    { id: 'production', name: 'Production', icon: <Factory size={14} />, color: '#F59E0B', visible: false, type: 'production' },
    { id: 'economy', name: 'Economy', icon: <TrendingUp size={14} />, color: '#06B6D4', visible: false, type: 'economy' },
    { id: 'weather', name: 'Weather', icon: <Cloud size={14} />, color: '#6B7280', visible: false, type: 'weather' },
  ]);

  useEffect(() => {
    if (frameRef.current && containerRef.current) {
      // Create iframe content that loads Three.js independently
      const iframeDoc = frameRef.current.contentDocument;
      if (!iframeDoc) return;

      // Write the globe HTML directly to iframe to isolate from wallet extensions
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; overflow: hidden; background: #0a0a0a; }
              canvas { display: block; }
            </style>
          </head>
          <body>
            <div id="globe-container"></div>
            <script type="module">
              // Import Three.js from CDN to avoid wallet conflicts
              import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
              
              // Create scene
              const scene = new THREE.Scene();
              const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
              camera.position.z = 3;
              
              const renderer = new THREE.WebGLRenderer({ antialias: true });
              renderer.setSize(window.innerWidth, window.innerHeight);
              renderer.setPixelRatio(window.devicePixelRatio);
              document.getElementById('globe-container').appendChild(renderer.domElement);
              
              // Lighting
              const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
              scene.add(ambientLight);
              
              const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
              directionalLight.position.set(5, 3, 5);
              scene.add(directionalLight);
              
              // Create Earth
              const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
              const earthMaterial = new THREE.MeshPhongMaterial({
                color: 0x2233ff,
                emissive: 0x112244,
                shininess: 10,
                specular: 0x222222
              });
              const earth = new THREE.Mesh(earthGeometry, earthMaterial);
              scene.add(earth);
              
              // Create simple land masses
              const landGeometry = new THREE.SphereGeometry(1.01, 32, 32);
              const landMaterial = new THREE.MeshPhongMaterial({
                color: 0x228833,
                emissive: 0x112211,
                transparent: true,
                opacity: 0.8
              });
              const land = new THREE.Mesh(landGeometry, landMaterial);
              scene.add(land);
              
              // Atmosphere
              const atmosphereGeometry = new THREE.SphereGeometry(1.1, 32, 32);
              const atmosphereMaterial = new THREE.MeshPhongMaterial({
                color: 0x4488ff,
                transparent: true,
                opacity: 0.1,
                side: THREE.BackSide
              });
              const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
              scene.add(atmosphere);
              
              // Auto-rotate state
              let autoRotate = ${autoRotate};
              
              // Animation loop
              function animate() {
                requestAnimationFrame(animate);
                
                if (autoRotate) {
                  earth.rotation.y += 0.001;
                  land.rotation.y += 0.001;
                }
                
                renderer.render(scene, camera);
              }
              
              // Handle window resize
              window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
              });
              
              // Mouse controls
              let mouseX = 0, mouseY = 0;
              let targetRotationX = 0, targetRotationY = 0;
              
              document.addEventListener('mousemove', (e) => {
                if (e.buttons === 1) {
                  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
                  targetRotationX = mouseY * Math.PI;
                  targetRotationY = mouseX * Math.PI;
                }
              });
              
              // Listen for messages from parent
              window.addEventListener('message', (e) => {
                if (e.data.type === 'setAutoRotate') {
                  autoRotate = e.data.value;
                }
              });
              
              animate();
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();
      
      setIsLoading(false);
    }
  }, [autoRotate]);

  const toggleLayer = (layerId: string) => {
    setTelemetryLayers(prev => 
      prev.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  // Send messages to iframe
  useEffect(() => {
    if (frameRef.current && frameRef.current.contentWindow) {
      frameRef.current.contentWindow.postMessage({ 
        type: 'setAutoRotate', 
        value: autoRotate 
      }, '*');
    }
  }, [autoRotate]);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Control Panel */}
      <div className="flex items-center justify-between p-3 bg-[#1a1a1a] border-b border-[#3e3e3e]">
        <div className="flex items-center gap-3">
          <Globe size={18} className="text-[#007acc]" />
          <span className="text-sm font-medium text-white">World Archive System - Immersive Globe</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Layer selector */}
          <Select value={selectedLayer} onValueChange={setSelectedLayer}>
            <SelectTrigger className="w-[140px] h-8 text-xs bg-[#2d2d2d] border-[#3e3e3e]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="telemetry">Telemetry</SelectItem>
              <SelectItem value="archive">Archive</SelectItem>
            </SelectContent>
          </Select>

          {/* Time controls */}
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <Slider 
              value={[timeOfDay]} 
              onValueChange={([v]) => setTimeOfDay(v)}
              max={24}
              step={0.5}
              className="w-24"
            />
            <span className="text-xs w-12">{timeOfDay}:00</span>
          </div>

          {/* View controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRotate(!autoRotate)}
            className="h-8 px-2"
          >
            {autoRotate ? <Pause size={14} /> : <Play size={14} />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowClouds(!showClouds)}
            className="h-8 px-2"
          >
            <Cloud size={14} className={showClouds ? 'text-[#007acc]' : 'text-gray-500'} />
          </Button>
        </div>
      </div>

      {/* Main globe view - isolated in iframe */}
      <div className="flex-1 relative" ref={containerRef}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
            <div className="text-center">
              <Globe size={48} className="mx-auto mb-4 text-gray-500 animate-pulse" />
              <p className="text-gray-400">Loading immersive globe...</p>
            </div>
          </div>
        )}
        
        <iframe
          ref={frameRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="3D Globe Visualization"
        />

        {/* Layer toggles */}
        <div className="absolute top-4 right-4 bg-[#1a1a1a] border border-[#3e3e3e] p-3 w-48">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white">Telemetry Layers</span>
            <Layers size={14} />
          </div>
          <div className="space-y-1">
            {telemetryLayers.map(layer => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs transition-colors ${
                  layer.visible 
                    ? 'bg-[#2d2d2d] text-white' 
                    : 'bg-transparent text-gray-500 hover:bg-[#2d2d2d] hover:text-gray-300'
                }`}
              >
                <span style={{ color: layer.visible ? layer.color : undefined }}>
                  {layer.icon}
                </span>
                <span className="flex-1 text-left">{layer.name}</span>
                {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="absolute bottom-4 left-4 bg-[#1a1a1a] border border-[#3e3e3e] p-3 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-[#007acc]" />
            <span className="text-xs font-semibold text-white">Global Telemetry Status</span>
          </div>
          <div className="space-y-1 text-xs text-gray-300">
            <div>Active Flights: 9,728</div>
            <div>Maritime Vessels: 51,293</div>
            <div>Network Nodes: 1,847</div>
            <div>Data Centers: 4,521</div>
          </div>
        </div>
      </div>
    </div>
  );
}