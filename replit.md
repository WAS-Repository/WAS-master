# Replit Configuration Guide

## Overview

This project is the World Archive System, a document visualization and exploration application that allows users to explore research papers, patents, and engineering documents through different visual interfaces: a knowledge graph view, a map view, and a document viewer. 

The application is built using a full-stack JavaScript/TypeScript architecture with:
- **Frontend**: React with Vite, utilizing shadcn/ui components
- **Backend**: Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS

The system allows users to search, filter, and visualize relationships between documents, with special attention to geographical metadata.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18+ and uses Vite as the build tool. The UI is implemented with shadcn/ui, which provides a collection of reusable components built on top of Radix UI primitives. The application state is managed with React Query for data fetching and local state hooks for UI state.

Key architectural decisions:
- **Component Structure**: Components are organized into UI components (in `client/src/components/ui`) and feature-specific components (like visualizations)
- **Routing**: Wouter is used for lightweight client-side routing
- **Theming**: The application supports light and dark themes with a ThemeProvider context
- **Data Fetching**: React Query is used for data fetching, caching, and state management of server data

### Backend Architecture

The backend is an Express.js server written in TypeScript that serves both the API endpoints and the static frontend assets in production. In development, it integrates with Vite's dev server.

Key architectural decisions:
- **API Design**: RESTful API endpoints under `/api/`
- **Server Structure**: Modular architecture with routes and storage layers
- **Development Mode**: Special handling for development mode with Vite integration

### Data Layer

The application uses Drizzle ORM with a PostgreSQL database. The database schema is defined in `shared/schema.ts` and includes models for documents, document localities, document relationships, and search queries.

Key architectural decisions:
- **Schema Design**: Focuses on document metadata, geographical relationships, and inter-document relationships
- **ORM Choice**: Drizzle provides type-safe database access with good TypeScript integration
- **Memory Storage Fallback**: The application includes a memory storage implementation for development/testing

## Key Components

### Frontend Components

1. **Visualization Components**:
   - `KnowledgeGraph`: Interactive network visualization of document relationships
   - `MapView`: Geographic visualization of document locations
   - `DocumentViewer`: Interface for viewing document details

2. **UI Framework**:
   - Comprehensive set of UI components from shadcn/ui
   - Custom layout components like `AppLayout` and `ResizablePanels`

3. **State Management**:
   - Context-based theme management
   - React Query for server state
   - Component-local state for UI interactions

### Backend Components

1. **Server**: Main Express application in `server/index.ts`
2. **Routes**: API endpoints in `server/routes.ts`
3. **Storage**: Data access layer in `server/storage.ts`
4. **Vite Integration**: Development-mode integration with Vite in `server/vite.ts`

### Database Schema

The database schema consists of four main tables:
1. `documents`: Stores document metadata (title, type, authors, etc.)
2. `document_localities`: Maps documents to geographical locations
3. `document_relationships`: Defines relationships between documents
4. `search_queries`: Records user search history

## Data Flow

1. **Document Management Flow**:
   - User creates/updates documents through the API
   - Documents are stored in the database 
   - Frontend retrieves and displays documents through React Query

2. **Visualization Flow**:
   - Backend provides document and relationship data via API
   - Frontend transforms this data into visual representations:
     - Network graphs for document relationships
     - Map markers for geographical data
     - Structured views for document content

3. **Search Flow**:
   - User enters search criteria
   - Backend processes search queries against documents
   - Results are returned and displayed in the appropriate visualization

## External Dependencies

### Frontend
- React and React DOM for UI
- TanStack Query (React Query) for data fetching
- Shadcn/UI components built on Radix UI primitives
- Tailwind CSS for styling
- D3.js and related libraries for visualizations
- Leaflet for map visualizations

### Backend
- Express.js for the server
- Drizzle ORM for database access
- Zod for validation

## Deployment Strategy

The application is deployed using Replit's deployment system with the following configuration:

1. **Build Process**:
   - `npm run build` builds both frontend and backend code
   - Vite builds the frontend into `dist/public`
   - esbuild bundles the server code into `dist/index.js`

2. **Runtime**:
   - Node.js 20 runs the production server
   - The server serves both the API and static frontend assets

3. **Database**:
   - Uses PostgreSQL 16 provided by Replit
   - Database migrations are managed with Drizzle Kit

For local development, the server runs in development mode with:
- Hot module replacement for the frontend via Vite
- Auto-restarting for the backend
- In-memory database if PostgreSQL isn't available

## Recent Changes

- Fixed session persistence with instant auto-saving across all workspace modes, preserving drawings, notes, and terminal states in real-time.
- Created comprehensive D3.js visualization system with interactive View menu listing 15+ visualizations organized by categories (Coastal, Environmental, Infrastructure, Demographic, Economic).
- Transformed research notes into rich text editor with Google Docs-like capabilities including formatting toolbar, text alignment, lists, colors, and export options.
- Added research sources section with document management, folder creation, file compression capabilities, and sample datasets for handling large research data.
- Enhanced file explorer with drag-and-drop capabilities and established master/workspace relationship where workspace modes show subset file trees from the master explorer.
- Implemented VS Code-style welcome screen that adapts to current workspace mode (Research/Story/Developer) with mode-specific actions, recent files, and walkthroughs - displays when no files are open.
- Revamped View menu to match VS Code structure with workspace mode switcher, appearance options, panel controls, and visualization shortcuts - consolidated workspace modes into organized menu.
- Added Geographic Mode with location-based data search, interactive map interface, and GIS data access capabilities for spatial research and analysis.
- Rebranded entire system from "Hampton Roads Research Platform" to "World Archive System" with updated branding throughout the application.

## Notes for Implementation

When implementing new features or making changes:

1. **Frontend**: 
   - Add new components in the appropriate directories
   - Update routes in the `Router` component if adding new pages
   - Use the existing UI components and theming system

2. **Backend**:
   - Add new routes in `server/routes.ts`
   - Implement data access methods in the storage layer
   - Validate inputs with Zod schemas

3. **Database**:
   - Add new schema definitions to `shared/schema.ts`
   - Use `npm run db:push` to push schema changes to the database
   - Consider adding migrations for production changes