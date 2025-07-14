import React, { useEffect, useRef, useState } from 'react';
import Cesium from '@/lib/cesiumConfig';

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

interface SimpleCesiumViewProps {
  data?: MapDataPoint[];
}

export default function SimpleCesiumView({ data = [] }: SimpleCesiumViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!cesiumContainerRef.current) return;

    try {
      // Initialize Cesium viewer with minimal configuration
      const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        timeline: false,
        navigationHelpButton: false,
        vrButton: false
      });

      // Remove default imagery layers and add OpenStreetMap
      viewer.imageryLayers.removeAll();
      viewer.imageryLayers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/'
        })
      );

      // Disable skybox and atmosphere to avoid rendering issues
      viewer.scene.skyBox = undefined;
      viewer.scene.skyAtmosphere.show = false;
      viewer.scene.globe.enableLighting = false;

      // Set default view
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-76.3, 36.9, 1000000),
        orientation: {
          heading: 0,
          pitch: -Cesium.Math.PI_OVER_TWO,
          roll: 0
        }
      });

      // Add data points
      const pointsToShow = data.length > 0 ? data : [
        { id: '1', name: 'Chesapeake Bay', latitude: 36.9894, longitude: -76.3013, type: 'event' as const },
        { id: '2', name: 'Norfolk Naval Base', latitude: 36.9028, longitude: -76.0428, type: 'locality' as const },
        { id: '3', name: 'Norfolk', latitude: 36.8485, longitude: -76.2858, type: 'document' as const },
        { id: '4', name: 'Portsmouth', latitude: 37.0051, longitude: -76.4125, type: 'research-site' as const }
      ];

      // Color map for different types
      const colorMap = {
        'document': Cesium.Color.BLUE,
        'locality': Cesium.Color.GREEN,
        'event': Cesium.Color.ORANGE,
        'research-site': Cesium.Color.PURPLE
      };

      pointsToShow.forEach(point => {
        const color = colorMap[point.type] || Cesium.Color.GRAY;
        
        viewer.entities.add({
          id: point.id,
          position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude || 100),
          point: {
            pixelSize: 10,
            color: color,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2
          },
          label: {
            text: point.name,
            font: '14px sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -20)
          },
          properties: point
        });
      });

      setIsLoading(false);

      viewerRef.current = viewer;

      return () => {
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
          viewerRef.current.destroy();
        }
      };
    } catch (error) {
      console.error('Failed to initialize Cesium:', error);
      setError('Failed to load 3D map. Please try refreshing the page.');
      setIsLoading(false);
    }
  }, [data]);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-xs text-primary hover:underline"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
          <p className="text-sm text-muted-foreground">Loading 3D map...</p>
        </div>
      )}
      <div 
        ref={cesiumContainerRef} 
        style={{ width: '100%', height: '100%' }}
        className="cesium-container"
      />
    </div>
  );
}