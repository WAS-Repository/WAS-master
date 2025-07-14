// Cesium configuration - must be loaded before any Cesium imports

// IMPORTANT: Set CESIUM_BASE_URL before importing cesium
// This tells Cesium where to find its static assets (workers, widgets, etc.)
(window as any).CESIUM_BASE_URL = '/cesium/';

// Now import Cesium after setting the base URL
import * as Cesium from 'cesium';

// Disable the default Cesium Ion token warning (optional)
// We can use Cesium without an Ion account for basic functionality
(Cesium as any).Ion.defaultAccessToken = undefined;

// Make Cesium available globally for resium
(window as any).Cesium = Cesium;

export default Cesium;