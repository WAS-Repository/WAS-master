Quick Start Guide
================

This guide will get you up and running with the World Archive System (WAS) in minutes.

Prerequisites
------------

* WAS installed (see :doc:`installation`)
* Basic understanding of command line interfaces
* Web browser

Getting Started
--------------

1. **Start WAS**

   .. code-block:: bash

      # Navigate to your WAS installation
      cd world-archive-system

      # Start the server
      python server/index.py

   The application will be available at `http://localhost:5000`

2. **Access the Web Interface**

   Open your browser and navigate to `http://localhost:5000`. You should see the WAS dashboard.

3. **Upload Your First Document**

   * Click the "Upload" button in the file explorer
   * Select a document (PDF, DOCX, TXT, etc.)
   * The document will be processed and indexed

4. **Explore the Interface**

   * **Research Mode**: Create notes and organize research
   * **Story Mode**: Build visual narratives and whiteboards
   * **Developer Mode**: Access the IDE and terminal
   * **Geographic Mode**: Explore location-based data

Basic Workflow
-------------

Document Management
~~~~~~~~~~~~~~~~~~

1. **Upload Documents**
   * Use the file upload interface
   * Drag and drop files directly
   * Batch upload multiple files

2. **Organize Content**
   * Create folders and categories
   * Tag documents with keywords
   * Add metadata and descriptions

3. **Search and Discover**
   * Use the search bar for quick queries
   * Filter by document type, date, or tags
   * Explore related documents

Research Mode
~~~~~~~~~~~~

1. **Create Research Notes**
   * Use the rich text editor
   * Add formatting and links
   * Export notes as PDF or Markdown

2. **Organize Sources**
   * Create source folders
   * Add citations and references
   * Link related documents

3. **Collaborate**
   * Share workspaces with team members
   * Comment on documents
   * Track changes and versions

Story Mode
~~~~~~~~~~

1. **Create Visual Narratives**
   * Use the whiteboard interface
   * Add shapes, text, and images
   * Create storyboards and diagrams

2. **Build Presentations**
   * Export whiteboards as images
   * Create slide presentations
   * Share with stakeholders

Developer Mode
~~~~~~~~~~~~~

1. **Access the IDE**
   * Edit code files directly
   * Use syntax highlighting
   * Access the integrated terminal

2. **Run Commands**
   * Execute system commands
   * Install packages and dependencies
   * Debug and troubleshoot

Geographic Mode
~~~~~~~~~~~~~~

1. **Explore Location Data**
   * View documents on interactive maps
   * Filter by geographic regions
   * Analyze spatial relationships

2. **Import Geographic Data**
   * Upload GeoJSON files
   * Connect to external GIS services
   * Visualize location-based insights

Advanced Features
----------------

Data Source Integration
~~~~~~~~~~~~~~~~~~~~~~

1. **Connect External Sources**
   * Configure API connections
   * Set up database links
   * Import from cloud storage

2. **Automate Data Collection**
   * Schedule regular imports
   * Set up webhooks
   * Monitor data quality

3. **Customize Integrations**
   * Write custom connectors
   * Modify data processing
   * Add new file formats

API Usage
~~~~~~~~~

1. **Access the API**
   * Base URL: `http://localhost:5000/api`
   * Authentication: Bearer token
   * Rate limiting: 1000 requests/hour

2. **Common Endpoints**
   * `GET /api/documents` - List documents
   * `POST /api/upload` - Upload files
   * `GET /api/search` - Search content
   * `GET /api/geojson` - Geographic data

3. **Example API Call**

   .. code-block:: python

      import requests

      # Search for documents
      response = requests.get(
          'http://localhost:5000/api/documents',
          params={'keywords': 'military,technology'}
      )
      documents = response.json()

Troubleshooting
--------------

Common Issues
~~~~~~~~~~~~

**Application Won't Start**
   * Check if port 5000 is available
   * Verify all dependencies are installed
   * Check the logs for error messages

**File Upload Fails**
   * Ensure file size is under 50MB
   * Check file format is supported
   * Verify upload directory permissions

**Search Not Working**
   * Rebuild the search index
   * Check database connection
   * Verify document processing completed

**Performance Issues**
   * Increase system memory allocation
   * Optimize database queries
   * Enable caching

Getting Help
-----------

* **Documentation**: Browse the full documentation
* **GitHub Issues**: Report bugs and request features
* **Community**: Join our Discord server
* **Email**: Contact the development team

Next Steps
----------

* Explore the :doc:`user_guide/index` for detailed usage
* Check out the :doc:`api/index` for API documentation
* Review :doc:`deployment` for production setup
* Contribute to the project on GitHub 