import fs from 'fs';
import path from 'path';
import { Express, Request, Response } from 'express';

// Serve the GeoJSON data
export function setupGeoJSONRoute(app: Express) {
  app.get('/api/geojson', (req: Request, res: Response) => {
    try {
      // Path to the GeoJSON file
      const filePath = path.join(process.cwd(), 'attached_assets/world_archive_locations.geojson');
      
      // Read the file
      const data = fs.readFileSync(filePath, 'utf8');
      
      // Parse and send the GeoJSON
      const geojson = JSON.parse(data);
      res.json(geojson);
    } catch (error) {
      console.error('Error serving GeoJSON:', error);
      res.status(500).json({ error: 'Failed to load GeoJSON data' });
    }
  });
}