// Cesium configuration - must be loaded before any Cesium imports
import * as Cesium from 'cesium';

// Set the base URL for Cesium assets
// This tells Cesium where to find its static assets (workers, widgets, etc.)
(window as any).CESIUM_BASE_URL = '/cesium/';

// Disable the default Cesium Ion token warning
Cesium.Ion.defaultAccessToken = undefined;

export default Cesium;