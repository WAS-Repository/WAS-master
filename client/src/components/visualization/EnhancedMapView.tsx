import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Map, Layers, Plus, Minus } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Viewer as CesiumViewer, Entity } from 'resium';
import Cesium from '@/lib/cesiumConfig';
const { Cartesian3, Cartesian2, Color, LabelStyle, VerticalOrigin } = Cesium;
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'cesium/Build/Cesium/Widgets/widgets.css';
// Local storage helper
const storage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value)
};

// Fix Leaflet icon paths for bundlers
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Set Cesium base URL for assets
(window as any).CESIUM_BASE_URL = '/cesium';

interface MapDataPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  type: 'document' | 'locality' | 'event' | 'research-site';
  description?: string;
  metadata?: Record<string, any>;
}

interface EnhancedMapViewProps {
  data?: MapDataPoint[];
  onDataSelect?: (point: MapDataPoint) => void;
}

// Component for zoom controls in Leaflet
function ZoomControl() {
  const map = useMap();
  
  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1">
      <Button
        variant="secondary"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => map.zoomIn()}
      >
        <Plus size={16} />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => map.zoomOut()}
      >
        <Minus size={16} />
      </Button>
    </div>
  );
}

export default function EnhancedMapView({ data = [], onDataSelect }: EnhancedMapViewProps) {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [selectedPoint, setSelectedPoint] = useState<MapDataPoint | null>(null);
  const cesiumViewerRef = useRef<any>(null);

  // Sample data if none provided
  const mapData: MapDataPoint[] = data.length > 0 ? data : [
    {
      id: '1',
      name: 'Virginia Beach Research Center',
      latitude: 36.8529,
      longitude: -75.9780,
      type: 'research-site',
      description: 'Primary coastal research facility',
      metadata: { established: 2020, researchers: 45 }
    },
    {
      id: '2',
      name: 'Norfolk Naval Station Archive',
      latitude: 36.9487,
      longitude: -76.3310,
      altitude: 10,
      type: 'document',
      description: 'Historical naval documents repository',
      metadata: { documents: 12500, classification: 'public' }
    },
    {
      id: '3',
      name: 'Hampton University Collection',
      latitude: 37.0196,
      longitude: -76.3358,
      type: 'document',
      description: 'Academic research papers and historical archives',
      metadata: { papers: 8200, topics: ['history', 'science', 'culture'] }
    },
    {
      id: '4',
      name: 'Chesapeake Bay Environmental Data',
      latitude: 36.9894,
      longitude: -76.3013,
      type: 'event',
      description: 'Environmental monitoring station data',
      metadata: { sensors: 24, dataPoints: 1500000 }
    },
    {
      id: '5',
      name: 'Portsmouth Historical Society',
      latitude: 36.8354,
      longitude: -76.2983,
      type: 'locality',
      description: 'Local history and genealogy records',
      metadata: { founded: 1967, collections: 35 }
    }
  ];

  // Custom marker icon based on type
  const getMarkerIcon = (type: string) => {
    const colors: Record<string, string> = {
      'document': '#3b82f6',
      'locality': '#10b981',
      'event': '#f59e0b',
      'research-site': '#8b5cf6'
    };
    
    return L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color:${colors[type] || '#6b7280'}; width: 12px; height: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  const handlePointClick = (point: MapDataPoint) => {
    setSelectedPoint(point);
    onDataSelect?.(point);
  };

  // Save view preference
  useEffect(() => {
    const savedView = storage.getItem('mapViewMode');
    if (savedView === '2d' || savedView === '3d') {
      setViewMode(savedView);
    }
  }, []);

  const toggleViewMode = () => {
    const newMode = viewMode === '2d' ? '3d' : '2d';
    setViewMode(newMode);
    storage.setItem('mapViewMode', newMode);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-border-color">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Map Visualization</h3>
          <span className="text-xs text-muted-foreground">
            ({mapData.length} locations)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleViewMode}
            className="flex items-center gap-2"
          >
            {viewMode === '2d' ? (
              <>
                <Globe size={14} />
                <span>Switch to 3D</span>
              </>
            ) : (
              <>
                <Map size={14} />
                <span>Switch to 2D</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Layers size={14} />
            <span>Layers</span>
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {viewMode === '2d' ? (
          <MapContainer
            center={[36.9, -76.2]}
            zoom={10}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {mapData.map((point) => (
              <Marker
                key={point.id}
                position={[point.latitude, point.longitude]}
                icon={getMarkerIcon(point.type)}
                eventHandlers={{
                  click: () => handlePointClick(point)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold text-sm">{point.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Type: {point.type}
                    </p>
                    {point.description && (
                      <p className="text-xs mt-2">{point.description}</p>
                    )}
                    {point.metadata && (
                      <div className="mt-2 text-xs">
                        {Object.entries(point.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground">{key}:</span>
                            <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <ZoomControl />
          </MapContainer>
        ) : (
          <div className="h-full w-full">
            <CesiumViewer
              ref={(e) => { cesiumViewerRef.current = e?.cesiumElement || null; }}
              full
              animation={false}
              timeline={false}
              geocoder={false}
              homeButton={false}
              sceneModePicker={false}
              baseLayerPicker={false}
              navigationHelpButton={false}
              fullscreenButton={false}
              vrButton={false}
            >
              {mapData.map((point) => {
                const position = Cartesian3.fromDegrees(
                  point.longitude,
                  point.latitude,
                  point.altitude || 100
                );
                
                const color = {
                  'document': Color.BLUE,
                  'locality': Color.GREEN,
                  'event': Color.ORANGE,
                  'research-site': Color.PURPLE
                }[point.type] || Color.GRAY;
                
                return (
                  <Entity
                    key={point.id}
                    position={position}
                    point={{
                      pixelSize: 10,
                      color: color,
                      outlineColor: Color.WHITE,
                      outlineWidth: 2
                    }}
                    label={{
                      text: point.name,
                      font: '12px sans-serif',
                      fillColor: Color.WHITE,
                      outlineColor: Color.BLACK,
                      outlineWidth: 2,
                      style: LabelStyle.FILL_AND_OUTLINE,
                      verticalOrigin: VerticalOrigin.BOTTOM,
                      pixelOffset: new Cartesian2(0, -15)
                    }}
                    description={`
                      <div style="font-family: sans-serif;">
                        <h3>${point.name}</h3>
                        <p><strong>Type:</strong> ${point.type}</p>
                        ${point.description ? `<p>${point.description}</p>` : ''}
                        ${point.metadata ? `
                          <div style="margin-top: 10px;">
                            ${Object.entries(point.metadata).map(([key, value]) => 
                              `<p><strong>${key}:</strong> ${Array.isArray(value) ? value.join(', ') : value}</p>`
                            ).join('')}
                          </div>
                        ` : ''}
                      </div>
                    `}
                    onClick={() => handlePointClick(point)}
                  />
                );
              })}
            </CesiumViewer>
          </div>
        )}
      </div>

      {/* Info Panel */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 bg-background border border-border-color p-4 max-w-sm shadow-lg z-[1000]">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-sm">{selectedPoint.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedPoint.type} • {selectedPoint.latitude.toFixed(4)}°, {selectedPoint.longitude.toFixed(4)}°
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setSelectedPoint(null)}
            >
              ×
            </Button>
          </div>
          
          {selectedPoint.description && (
            <p className="text-sm mt-2">{selectedPoint.description}</p>
          )}
          
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" className="text-xs">
              View Details
            </Button>
            <Button variant="secondary" size="sm" className="text-xs">
              Add to Graph
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}