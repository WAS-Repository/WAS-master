Installation Guide
=================

This guide will help you install and set up the World Archive System (WAS) for your environment.

Prerequisites
------------

Before installing WAS, ensure you have the following:

* Python 3.8 or higher
* Node.js 16 or higher (for frontend components)
* PostgreSQL 12 or higher (for database)
* Git

System Requirements
------------------

* **Minimum RAM**: 4GB
* **Recommended RAM**: 8GB or higher
* **Storage**: 10GB available space
* **Network**: Internet connection for package downloads

Installation Methods
-------------------

Quick Install
~~~~~~~~~~~~~

For a quick installation with default settings:

.. code-block:: bash

   # Clone the repository
   git clone https://github.com/josiahbelfon/world-archive-system.git
   cd world-archive-system

   # Install Python dependencies
   pip install -r requirements.txt

   # Install Node.js dependencies
   npm install

   # Set up the database
   python scripts/setup_database.py

   # Start the application
   python server/index.py

Docker Installation
~~~~~~~~~~~~~~~~~~

For containerized deployment:

.. code-block:: bash

   # Clone the repository
   git clone https://github.com/josiahbelfon/world-archive-system.git
   cd world-archive-system

   # Build the Docker image
   docker build -t world-archive-system .

   # Run the container
   docker run -p 5000:5000 world-archive-system

Development Installation
~~~~~~~~~~~~~~~~~~~~~~~

For development and contribution:

.. code-block:: bash

   # Clone the repository
   git clone https://github.com/josiahbelfon/world-archive-system.git
   cd world-archive-system

   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install development dependencies
   pip install -r requirements-dev.txt

   # Install pre-commit hooks
   pre-commit install

   # Set up development database
   python scripts/setup_dev_database.py

Configuration
------------

Environment Variables
~~~~~~~~~~~~~~~~~~~~

Create a `.env` file in the project root:

.. code-block:: bash

   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/was_db

   # Application Settings
   WAS_ENV=development
   WAS_DEBUG=true
   WAS_SECRET_KEY=your-secret-key-here

   # API Keys (optional)
   OPENAI_API_KEY=your-openai-key
   GOOGLE_MAPS_API_KEY=your-google-maps-key

   # File Storage
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=52428800  # 50MB in bytes

Database Setup
~~~~~~~~~~~~~

1. Create a PostgreSQL database:

   .. code-block:: sql

      CREATE DATABASE was_db;
      CREATE USER was_user WITH PASSWORD 'your_password';
      GRANT ALL PRIVILEGES ON DATABASE was_db TO was_user;

2. Run database migrations:

   .. code-block:: bash

      python scripts/migrate_database.py

File Storage Setup
~~~~~~~~~~~~~~~~~

1. Create upload directories:

   .. code-block:: bash

      mkdir -p uploads/documents
      mkdir -p uploads/temp
      mkdir -p uploads/backups

2. Set proper permissions:

   .. code-block:: bash

      chmod 755 uploads/
      chmod 755 uploads/documents/
      chmod 755 uploads/temp/

Verification
-----------

After installation, verify that WAS is running correctly:

1. **Check the application status**:

   .. code-block:: bash

      curl http://localhost:5000/api/health

2. **Test the web interface**:

   Open your browser and navigate to `http://localhost:5000`

3. **Verify database connection**:

   .. code-block:: bash

      python scripts/test_database.py

Troubleshooting
--------------

Common Issues
~~~~~~~~~~~~

**Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists and user has proper permissions

**Port Already in Use**
   - Change the port in `server/index.py`
   - Or kill the process using the port: `lsof -ti:5000 | xargs kill`

**File Upload Errors**
   - Check upload directory permissions
   - Verify disk space availability
   - Check file size limits

**Node.js Dependencies**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

Getting Help
-----------

If you encounter issues during installation:

* Check the `troubleshooting` section above
* Review the `logs` directory for error messages
* Open an issue on `GitHub <https://github.com/josiahbelfon/world-archive-system/issues>`_
* Join our `Discord community <https://discord.gg/world-archive-system>`_

Next Steps
----------

After successful installation:

1. Read the :doc:`quickstart` guide
2. Explore the :doc:`user_guide/index` for detailed usage
3. Check out the :doc:`api/index` for API documentation
4. Review :doc:`deployment` for production deployment 