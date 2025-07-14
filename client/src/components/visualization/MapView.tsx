import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, MapPin, Search } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Handle the map center updates
function MapCenterHandler({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Define location markers with some sample documents
const locationMarkers = [
  {
    position: [36.8508, -76.2859] as [number, number],
    name: 'Norfolk',
    documents: 12,
    types: ['Research Papers', 'Engineering Drawings', 'Patents']
  },
  {
    position: [36.7282, -76.5835] as [number, number],
    name: 'Suffolk',
    documents: 5,
    types: ['Research Papers', 'Patents']
  },
  {
    position: [36.9312, -76.2397] as [number, number],
    name: 'Hampton',
    documents: 8,
    types: ['Research Papers', 'Engineering Drawings']
  },
  {
    position: [36.8354, -76.2983] as [number, number],
    name: 'Portsmouth',
    documents: 7,
    types: ['Engineering Drawings', 'Patents']
  },
  {
    position: [36.7335, -76.0435] as [number, number],
    name: 'Virginia Beach',
    documents: 15,
    types: ['Research Papers', 'Engineering Drawings', 'Patents']
  },
  {
    position: [37.0871, -76.4730] as [number, number],
    name: 'Newport News',
    documents: 9,
    types: ['Research Papers', 'Engineering Drawings']
  },
  {
    position: [37.1466, -76.4188] as [number, number],
    name: 'Williamsburg',
    documents: 6,
    types: ['Research Papers']
  }
];

// Style function for GeoJSON with improved contrast for accessibility
const geoJSONStyle = {
  fillColor: '#60a5fa', // Brighter blue fill
  weight: 2,            // Thicker border
  opacity: 1,
  color: '#1d4ed8',     // More vibrant border color
  fillOpacity: 0.2,     // Slightly more transparent fill
  dashArray: '3',       // Add dash pattern to borders for better visibility
};

// MapBounds component to restrict panning and zooming
function MapBoundsHandler() {
  const map = useMap();
  
  useEffect(() => {
    // Define the bounds for Hampton Roads area
    // These values create a rectangular boundary around all our markers
    const southWest = L.latLng(36.5, -76.8);
    const northEast = L.latLng(37.4, -75.8);
    const bounds = L.latLngBounds(southWest, northEast);
    
    // Set maximum boundaries for the map
    map.setMaxBounds(bounds);
    
    // Set min/max zoom levels
    map.setMinZoom(8);
    map.setMaxZoom(14);
    
    // Ensure initial view is within bounds
    map.fitBounds(bounds);
    
    // Add event handler to keep map within bounds
    map.on('drag', function() {
      map.panInsideBounds(bounds, { animate: false });
    });
    
    return () => {
      map.off('drag');
    };
  }, [map]);
  
  return null;
}

export default function MapView() {
  // Import and use the enhanced map view that supports both 2D and 3D
  const EnhancedMapView = React.lazy(() => import('./EnhancedMapView'));
  
  return (
    <React.Suspense fallback={
      <div className="h-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading map...</span>
      </div>
    }>
      <EnhancedMapView />
    </React.Suspense>
  );
}