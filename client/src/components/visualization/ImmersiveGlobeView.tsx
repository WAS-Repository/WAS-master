import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, Pause, Globe, Layers, Info, Navigation, 
  Plane, Ship, Activity, Wifi, Factory, TrendingUp,
  Cloud, Calendar, Settings, Eye, EyeOff
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

interface ImmersiveGlobeViewProps {
  data?: MapDataPoint[];
  onDataSelect?: (point: MapDataPoint) => void;
}

// Camera controller for smooth navigation
function CameraController({ autoRotate }: { autoRotate: boolean }) {
  const { camera, gl } = useThree();
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const distance = useRef(3);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) { // Left mouse button
        mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      distance.current = Math.max(1.5, Math.min(10, distance.current + e.deltaY * 0.001));
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('wheel', handleWheel);

    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('wheel', handleWheel);
    };
  }, [gl]);

  useFrame((state) => {
    // Smooth camera movement
    targetRotation.current.x = mouseY.current * Math.PI * 0.5;
    targetRotation.current.y = mouseX.current * Math.PI;

    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;

    if (autoRotate) {
      currentRotation.current.y += 0.001;
    }

    const x = Math.sin(currentRotation.current.y) * Math.cos(currentRotation.current.x) * distance.current;
    const y = Math.sin(currentRotation.current.x) * distance.current;
    const z = Math.cos(currentRotation.current.y) * Math.cos(currentRotation.current.x) * distance.current;

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Earth component with realistic textures and atmosphere
function Earth({ telemetryLayers, showClouds }: { telemetryLayers: TelemetryLayer[], showClouds: boolean }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
    if (cloudsRef.current && showClouds) {
      cloudsRef.current.rotation.y += delta * 0.03;
    }
  });

  // Create gradient texture for Earth
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Ocean gradient
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGradient.addColorStop(0, '#001a33');
    oceanGradient.addColorStop(0.5, '#003366');
    oceanGradient.addColorStop(1, '#001a33');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Simple continents
    ctx.fillStyle = '#1a3d1a';
    // North America
    ctx.fillRect(200, 300, 400, 300);
    // Europe/Africa
    ctx.fillRect(800, 200, 300, 600);
    // Asia
    ctx.fillRect(1100, 200, 500, 400);
    // South America
    ctx.fillRect(400, 600, 200, 300);
    // Australia
    ctx.fillRect(1300, 700, 200, 150);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial 
          map={earthTexture}
          bumpScale={0.05}
          specular={new THREE.Color('#003366')}
          shininess={10}
        />
      </mesh>

      {/* Cloud layer */}
      {showClouds && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.01, 64, 64]} />
          <meshPhongMaterial 
            color="#ffffff"
            opacity={0.2}
            transparent
          />
        </mesh>
      )}

      {/* Atmosphere */}
      <mesh ref={atmosphereRef} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          color="#4488ff"
          opacity={0.1}
          transparent
          side={THREE.BackSide}
        />
      </mesh>

      {/* Telemetry visualization layers */}
      {telemetryLayers.map((layer) => {
        if (!layer.visible) return null;
        
        return (
          <group key={layer.id}>
            {layer.type === 'flights' && <FlightPaths color={layer.color} />}
            {layer.type === 'vessels' && <ShippingLanes color={layer.color} />}
            {layer.type === 'telecom' && <TelecomNetworks color={layer.color} />}
            {layer.type === 'health' && <HealthHeatmap color={layer.color} />}
          </group>
        );
      })}
    </group>
  );
}

// Flight paths visualization with contrails and airport activity
function FlightPaths({ color }: { color: string }) {
  const flightRef = useRef<THREE.Group>(null);
  const contrailsRef = useRef<THREE.Group>(null);
  const [aircraftPositions, setAircraftPositions] = useState<Array<{ pos: THREE.Vector3; route: number; progress: number }>>([]);
  
  const routes = useMemo(() => [
    { start: [40.7128, -74.0060], end: [51.5074, -0.1278], name: 'NYC-London' },
    { start: [35.6762, 139.6503], end: [37.7749, -122.4194], name: 'Tokyo-SF' },
    { start: [1.3521, 103.8198], end: [-33.8688, 151.2093], name: 'Singapore-Sydney' },
    { start: [25.0777, 55.3095], end: [40.6413, -73.7781], name: 'Dubai-NYC' },
    { start: [52.5200, 13.4050], end: [22.3193, 114.1694], name: 'Berlin-HongKong' }
  ], []);

  const paths = useMemo(() => {
    return routes.map(route => {
      const curve = new THREE.CubicBezierCurve3(
        latLonToVector3(route.start[0], route.start[1], 1.02),
        latLonToVector3(route.start[0], route.start[1], 1.15),
        latLonToVector3(route.end[0], route.end[1], 1.15),
        latLonToVector3(route.end[0], route.end[1], 1.02)
      );
      return curve.getPoints(100);
    });
  }, [routes]);

  // Major airports with activity levels
  const airports = useMemo(() => [
    { lat: 40.7128, lon: -74.0060, name: 'JFK', activity: 0.9 },
    { lat: 51.5074, lon: -0.1278, name: 'LHR', activity: 0.85 },
    { lat: 35.6762, lon: 139.6503, name: 'NRT', activity: 0.8 },
    { lat: 25.0777, lon: 55.3095, name: 'DXB', activity: 0.95 },
    { lat: 1.3521, lon: 103.8198, name: 'SIN', activity: 0.75 }
  ], []);

  useFrame((state) => {
    // Animate aircraft along paths
    const newPositions = routes.map((route, i) => {
      const progress = ((state.clock.elapsedTime * 0.1 + i * 0.2) % 1);
      const pointIndex = Math.floor(progress * paths[i].length);
      return {
        pos: paths[i][pointIndex],
        route: i,
        progress
      };
    });
    setAircraftPositions(newPositions);

    // Animate airport activity
    if (flightRef.current) {
      flightRef.current.children.forEach((child, i) => {
        if (child.userData.isAirport) {
          const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1 * airports[i].activity;
          child.scale.set(scale, scale, scale);
        }
      });
    }
  });

  return (
    <group ref={flightRef}>
      {/* Flight paths with animated trails */}
      {paths.map((path, i) => (
        <group key={`path-${i}`}>
          {/* Main flight path */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={path.length}
                array={new Float32Array(path.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={color} opacity={0.3} transparent linewidth={2} />
          </line>
          
          {/* Animated contrail effect */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={20}
                array={new Float32Array(
                  path.slice(
                    Math.max(0, Math.floor(aircraftPositions[i]?.progress * path.length) - 20),
                    Math.floor(aircraftPositions[i]?.progress * path.length)
                  ).flatMap(p => [p.x, p.y, p.z])
                )}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" opacity={0.2} transparent />
          </line>
        </group>
      ))}

      {/* Aircraft models */}
      {aircraftPositions.map((aircraft, i) => (
        <mesh key={`aircraft-${i}`} position={aircraft.pos} scale={[0.015, 0.015, 0.015]}>
          <coneGeometry args={[0.5, 2, 4]} />
          <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Airport hubs with activity indicators */}
      {airports.map((airport, i) => (
        <group key={`airport-${i}`} position={latLonToVector3(airport.lat, airport.lon, 1.01)}>
          <mesh userData={{ isAirport: true }}>
            <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
            <meshPhongMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={airport.activity}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Airport activity ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.025, 0.03, 32]} />
            <meshBasicMaterial 
              color={color} 
              transparent 
              opacity={0.3 * airport.activity}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Shipping lanes visualization with animated vessels and port activity
function ShippingLanes({ color }: { color: string }) {
  const shipsRef = useRef<THREE.Group>(null);
  const [vesselPositions, setVesselPositions] = useState<Array<{ pos: THREE.Vector3; route: number; progress: number }>>([]);
  
  const routes = useMemo(() => [
    { start: [22.3193, 114.1694], end: [34.0522, -118.2437], name: 'HongKong-LA', vessels: 5 },
    { start: [51.5074, 3.7125], end: [40.7128, -74.0060], name: 'Rotterdam-NYC', vessels: 4 },
    { start: [1.3521, 103.8198], end: [25.0603, 55.1027], name: 'Singapore-Dubai', vessels: 6 },
    { start: [31.2304, 121.4737], end: [51.5074, 3.7125], name: 'Shanghai-Rotterdam', vessels: 7 },
    { start: [-33.8688, 151.2093], end: [35.6762, 139.6503], name: 'Sydney-Tokyo', vessels: 3 }
  ], []);

  const ports = useMemo(() => [
    { lat: 22.3193, lon: 114.1694, name: 'Hong Kong', size: 0.9 },
    { lat: 51.5074, lon: 3.7125, name: 'Rotterdam', size: 0.85 },
    { lat: 1.3521, lon: 103.8198, name: 'Singapore', size: 0.95 },
    { lat: 31.2304, lon: 121.4737, name: 'Shanghai', size: 1.0 },
    { lat: 34.0522, lon: -118.2437, name: 'Los Angeles', size: 0.8 }
  ], []);

  const paths = useMemo(() => {
    return routes.map(route => {
      const start = latLonToVector3(route.start[0], route.start[1], 1.001);
      const end = latLonToVector3(route.end[0], route.end[1], 1.001);
      const points = [];
      for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        points.push(new THREE.Vector3().lerpVectors(start, end, t));
      }
      return points;
    });
  }, [routes]);

  useFrame((state) => {
    // Animate vessels along shipping lanes
    const newPositions: Array<{ pos: THREE.Vector3; route: number; progress: number }> = [];
    routes.forEach((route, routeIndex) => {
      for (let v = 0; v < route.vessels; v++) {
        const progress = ((state.clock.elapsedTime * 0.02 + v * (1 / route.vessels) + routeIndex * 0.1) % 1);
        const pointIndex = Math.floor(progress * paths[routeIndex].length);
        newPositions.push({
          pos: paths[routeIndex][Math.min(pointIndex, paths[routeIndex].length - 1)],
          route: routeIndex,
          progress
        });
      }
    });
    setVesselPositions(newPositions);

    // Animate port activity
    if (shipsRef.current) {
      shipsRef.current.children.forEach((child) => {
        if (child.userData.isPort) {
          const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
          child.scale.set(pulse, pulse, pulse);
        }
      });
    }
  });

  return (
    <group ref={shipsRef}>
      {/* Shipping lanes as flowing currents */}
      {paths.map((path, i) => (
        <group key={`lane-${i}`}>
          {/* Main shipping lane */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={path.length}
                array={new Float32Array(path.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={color} opacity={0.4} transparent linewidth={3} />
          </line>
          
          {/* Animated flow effect */}
          {[...Array(5)].map((_, j) => {
            const offset = j * 0.2;
            return (
              <line key={`flow-${j}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={10}
                    array={new Float32Array(
                      path.slice(
                        Math.floor(((vesselPositions[0]?.progress || 0) + offset) % 1 * path.length),
                        Math.floor(((vesselPositions[0]?.progress || 0) + offset) % 1 * path.length) + 10
                      ).flatMap(p => [p.x, p.y, p.z])
                    )}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#00ffff" opacity={0.2 - j * 0.03} transparent />
              </line>
            );
          })}
        </group>
      ))}

      {/* Cargo vessels */}
      {vesselPositions.map((vessel, i) => (
        <mesh key={`vessel-${i}`} position={vessel.pos}>
          <boxGeometry args={[0.008, 0.004, 0.012]} />
          <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Ports with activity indicators */}
      {ports.map((port, i) => (
        <group key={`port-${i}`} position={latLonToVector3(port.lat, port.lon, 1.002)}>
          <mesh userData={{ isPort: true }}>
            <boxGeometry args={[0.03 * port.size, 0.02, 0.03 * port.size]} />
            <meshPhongMaterial 
              color="#ff6600"
              emissive="#ff6600"
              emissiveIntensity={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Port activity rings */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.03, 0.04, 6]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.3} />
          </mesh>
          {/* Container stacks */}
          {[...Array(3)].map((_, j) => (
            <mesh key={`container-${j}`} position={[(j - 1) * 0.01, 0.01, 0]}>
              <boxGeometry args={[0.005, 0.005 + Math.random() * 0.01, 0.005]} />
              <meshPhongMaterial color="#0066ff" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Telecom networks visualization with submarine cables and data flow
function TelecomNetworks({ color }: { color: string }) {
  const networkRef = useRef<THREE.Group>(null);
  const [dataPackets, setDataPackets] = useState<Array<{ start: THREE.Vector3; end: THREE.Vector3; progress: number; id: number }>>([]);
  
  // Major internet exchange points
  const hubs = useMemo(() => [
    { lat: 37.7749, lon: -122.4194, name: 'San Francisco', size: 0.9, type: 'primary' },
    { lat: 40.7128, lon: -74.0060, name: 'New York', size: 1.0, type: 'primary' },
    { lat: 51.5074, lon: -0.1278, name: 'London', size: 0.95, type: 'primary' },
    { lat: 35.6762, lon: 139.6503, name: 'Tokyo', size: 0.85, type: 'primary' },
    { lat: 1.3521, lon: 103.8198, name: 'Singapore', size: 0.8, type: 'primary' },
    { lat: -23.5505, lon: -46.6333, name: 'São Paulo', size: 0.7, type: 'secondary' },
    { lat: -33.8688, lon: 151.2093, name: 'Sydney', size: 0.7, type: 'secondary' },
    { lat: 25.0777, lon: 55.3095, name: 'Dubai', size: 0.75, type: 'secondary' }
  ], []);

  // Submarine cable routes
  const cables = useMemo(() => [
    { start: [37.7749, -122.4194], end: [35.6762, 139.6503], name: 'Trans-Pacific', capacity: 1.0 },
    { start: [40.7128, -74.0060], end: [51.5074, -0.1278], name: 'Atlantic', capacity: 0.9 },
    { start: [51.5074, -0.1278], end: [1.3521, 103.8198], name: 'Europe-Asia', capacity: 0.85 },
    { start: [1.3521, 103.8198], end: [-33.8688, 151.2093], name: 'Asia-Pacific', capacity: 0.7 },
    { start: [-23.5505, -46.6333], end: [51.5074, -0.1278], name: 'South Atlantic', capacity: 0.6 },
    { start: [25.0777, 55.3095], end: [35.6762, 139.6503], name: 'Middle East-Asia', capacity: 0.75 }
  ], []);

  // Generate cable paths with underwater effect
  const cablePaths = useMemo(() => {
    return cables.map(cable => {
      const start = latLonToVector3(cable.start[0], cable.start[1], 1.0);
      const end = latLonToVector3(cable.end[0], cable.end[1], 1.0);
      const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
      midPoint.multiplyScalar(0.98); // Submarine cable effect
      
      const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
      return curve.getPoints(50);
    });
  }, [cables]);

  useFrame((state) => {
    // Animate data centers
    if (networkRef.current) {
      networkRef.current.children.forEach((child) => {
        if (child.userData.isHub) {
          const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 3 + child.userData.offset) * 0.5;
          if (child instanceof THREE.Mesh && child.material) {
            child.material.emissiveIntensity = intensity * child.userData.size;
          }
        }
      });
    }

    // Generate and animate data packets
    const time = state.clock.elapsedTime;
    const newPackets: typeof dataPackets = [];
    
    // Create new data packets
    if (Math.random() < 0.1) { // 10% chance per frame
      const cableIndex = Math.floor(Math.random() * cables.length);
      const cable = cables[cableIndex];
      const start = latLonToVector3(cable.start[0], cable.start[1], 1.01);
      const end = latLonToVector3(cable.end[0], cable.end[1], 1.01);
      
      newPackets.push({
        start,
        end,
        progress: 0,
        id: Date.now() + Math.random()
      });
    }

    // Update existing packets
    setDataPackets(prev => {
      const updated = [...prev, ...newPackets].map(packet => ({
        ...packet,
        progress: packet.progress + 0.02
      })).filter(packet => packet.progress < 1);
      
      return updated;
    });
  });

  return (
    <group ref={networkRef}>
      {/* Submarine cables */}
      {cablePaths.map((path, i) => (
        <group key={`cable-${i}`}>
          {/* Main cable */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={path.length}
                array={new Float32Array(path.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color={color} 
              opacity={0.4 * cables[i].capacity} 
              transparent 
              linewidth={2 * cables[i].capacity}
            />
          </line>
          
          {/* Data flow visualization */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={path.length}
                array={new Float32Array(path.flatMap(p => [p.x * 1.001, p.y * 1.001, p.z * 1.001]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#00ffff" 
              opacity={0.2 * cables[i].capacity} 
              transparent 
            />
          </line>
        </group>
      ))}

      {/* Internet Exchange Points */}
      {hubs.map((hub, i) => (
        <group key={`hub-${i}`} position={latLonToVector3(hub.lat, hub.lon, 1.01)}>
          {/* Main hub */}
          <mesh userData={{ isHub: true, offset: i, size: hub.size }}>
            <octahedronGeometry args={[0.02 * hub.size, 0]} />
            <meshPhongMaterial 
              color={hub.type === 'primary' ? color : '#00ff00'}
              emissive={hub.type === 'primary' ? color : '#00ff00'}
              emissiveIntensity={0.5}
              wireframe
            />
          </mesh>
          
          {/* Data center rings */}
          {[1, 2, 3].map(ring => (
            <mesh key={`ring-${ring}`} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.02 * ring * hub.size, 0.022 * ring * hub.size, 16]} />
              <meshBasicMaterial 
                color={color} 
                transparent 
                opacity={0.3 / ring}
              />
            </mesh>
          ))}
          
          {/* Network status indicator */}
          <mesh position={[0, 0.03, 0]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
        </group>
      ))}

      {/* Data packets */}
      {dataPackets.map((packet) => {
        const position = new THREE.Vector3().lerpVectors(packet.start, packet.end, packet.progress);
        return (
          <mesh key={packet.id} position={position}>
            <sphereGeometry args={[0.003, 6, 6]} />
            <meshBasicMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
          </mesh>
        );
      })}

      {/* Terrestrial fiber networks (simplified) */}
      {hubs.slice(0, 4).map((hub, i) => {
        if (i === 0) return null;
        const prev = hubs[i - 1];
        const start = latLonToVector3(prev.lat, prev.lon, 1.005);
        const end = latLonToVector3(hub.lat, hub.lon, 1.005);
        
        return (
          <line key={`terrestrial-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...start.toArray(), ...end.toArray()])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ff00ff" opacity={0.3} transparent />
          </line>
        );
      })}
    </group>
  );
}

// Health data heatmap
function HealthHeatmap({ color }: { color: string }) {
  const heatmapRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={heatmapRef}>
      {/* Placeholder for health data visualization */}
      <mesh>
        <sphereGeometry args={[1.002, 32, 32]} />
        <meshPhongMaterial 
          color={color}
          opacity={0.1}
          transparent
        />
      </mesh>
    </group>
  );
}

// Helper function to convert lat/lon to 3D coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

export default function ImmersiveGlobeView({ data = [], onDataSelect }: ImmersiveGlobeViewProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState(12); // 24-hour format
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

  const toggleLayer = (layerId: string) => {
    setTelemetryLayers(prev => 
      prev.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

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

      {/* Main globe view */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <CameraController autoRotate={autoRotate} />
          
          {/* Lighting based on time of day */}
          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[
              Math.cos((timeOfDay / 24) * Math.PI * 2) * 5,
              2,
              Math.sin((timeOfDay / 24) * Math.PI * 2) * 5
            ]} 
            intensity={0.8}
            castShadow
          />
          
          {/* Earth and telemetry layers */}
          <Earth telemetryLayers={telemetryLayers} showClouds={showClouds} />
          
          {/* Data points */}
          {data.map((point) => {
            const position = latLonToVector3(point.latitude, point.longitude, 1.02);
            return (
              <mesh
                key={point.id}
                position={position}
                onClick={() => onDataSelect?.(point)}
              >
                <sphereGeometry args={[0.01, 8, 8]} />
                <meshBasicMaterial color="#00ff00" />
              </mesh>
            );
          })}
        </Canvas>

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