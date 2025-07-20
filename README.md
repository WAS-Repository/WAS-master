# World Archive System (WAS)

 WAS is a modular, high-fidelity knowledge architecture that aggregates data and documents into a real-time decision-support layer.

## 🌟 Features

- **Automated Decision Confidence**: Syncs data from sensors, operators, and embedded systems
- **Cognitive Interoperability**: Delivers intel in the mission's native logic
- **Open-Source Intelligence Networks**: Leverages public dev platforms for passive telemetry
- **Multi-Mode Interface**: Research, Story, Developer, and Geographic modes
- **File Management**: Upload, organize, and search documents
- **Data Source Integration**: Connect to external APIs, databases, and services

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16 or higher
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/WAS-Repository/WAS-master.git
   cd WAS-master
   ```

2. **Install dependencies**
   ```bash
   # Install Node.js dependencies
   npm install
   ```

3. **Start the development server**
   ```bash
   # Start the full-stack development server
   npm run dev
   ```

4. **Access the application**
   - Web Application: http://localhost:5000
   - API Endpoints: http://localhost:5000/api/
   - Documentation: http://localhost:5000/docs/

## 📁 Project Structure

```
WAS-master/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utility libraries
│   │   ├── pages/         # Page components
│   │   └── theme/         # Styling and themes
│   └── public/            # Static assets
├── server/                # Express.js backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   ├── index.ts           # Server entry point
│   └── vite.ts            # Vite development setup
├── docs/                  # Sphinx documentation
│   ├── _build/html/       # Generated documentation
│   ├── index.rst          # Documentation homepage
│   └── conf.py            # Sphinx configuration
├── shared/                # Shared types and schemas
└── public/                # Static assets and Cesium
```

## 🎯 Usage

### Web Interface

1. **Research Mode**
   - Create and organize research notes
   - Upload and manage documents
   - Search through content
   - Export notes as PDF or Markdown

2. **Story Mode**
   - Create visual narratives and whiteboards
   - Build presentations and diagrams
   - Export as images or slides

3. **Developer Mode**
   - Access integrated development environment
   - Edit code files directly
   - Use integrated terminal
   - Debug and troubleshoot

4. **Geographic Mode**
   - View documents on interactive maps
   - Import and visualize GeoJSON data
   - Analyze spatial relationships

### File Management

- **Upload Files**: Drag and drop or use the upload interface
- **Supported Formats**: PDF, DOCX, TXT, images, and more
- **Organization**: Create folders, add tags, and metadata
- **Search**: Full-text search across all documents

### Data Source Integration

- **Configure Sources**: Add API endpoints, databases, and services
- **Monitor Health**: Track connection status and performance
- **Sync Data**: Automatically import and update data
- **Custom Connectors**: Extend with custom integrations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Application Settings
NODE_ENV=development

# API Keys (optional)
OPENAI_API_KEY=your-openai-key
GOOGLE_MAPS_API_KEY=your-google-maps-key

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800  # 50MB in bytes
```

### Development Setup

1. **File Storage Setup**
   ```bash
   mkdir -p uploads/documents
   mkdir -p uploads/temp
   mkdir -p uploads/backups
   ```

2. **Database Setup** (optional - uses in-memory storage by default)
   ```bash
   # The application uses in-memory storage by default
   # For production, configure a database connection
   ```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start full-stack development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking

# Database
npm run db:push      # Push database schema changes

# Documentation
# Build Sphinx documentation (see docs/ directory)
```

### API Endpoints

- `GET /api/documents` - List documents
- `POST /api/upload` - Upload files
- `GET /api/search` - Search content
- `GET /api/geojson` - Geographic data
- `GET /api/health` - Health check

### Adding New Features

1. **Frontend Components**: Add to `client/src/components/`
2. **Backend Routes**: Add to `server/routes.ts`
3. **Data Sources**: Extend `client/src/lib/dataSources.ts`
4. **Documentation**: Update `docs/` directory
5. **Database Schema**: Update `shared/schema.ts` and run `npm run db:push`

## 📚 Documentation

- **Technical Documentation**: `/docs/_build/html/index.html`
- **API Reference**: Available in the documentation
- **User Guide**: Comprehensive usage instructions
- **Developer Guide**: Architecture and development details

To build the documentation:
```bash
cd docs
python -m sphinx.cmd.build -b html . _build/html
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t world-archive-system .

# Run container
docker run -p 5000:5000 world-archive-system
```

### GitHub Pages

The documentation is configured for GitHub Pages deployment:

1. Push to the `main` branch
2. Enable GitHub Pages in repository settings
3. Set source to `/docs` directory
4. Access at `https://username.github.io/repository-name/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Technical Documentation](docs/_build/html/index.html)
- **Issues**: [GitHub Issues](https://github.com/WAS-Repository/WAS-master/issues)
- **Discussions**: [GitHub Discussions](https://github.com/WAS-Repository/WAS-master/discussions)

## 🔗 Links

- **Website**: https://was.ngo
- **Network**: https://was.network
- **Tools**: https://was.tools
- **GitHub**: https://github.com/WAS-Repository/WAS-master

---

**World Archive System** - Connecting historic wisdom with tomorrow's innovations. 
