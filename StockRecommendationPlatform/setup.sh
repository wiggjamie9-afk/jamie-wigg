#!/bin/bash

# Stock Recommendation Platform - Setup Script
# Automates the installation and setup process

echo "======================================"
echo "Stock Recommendation Platform Setup"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 found"
python3 --version
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your POLYGON_API_KEY"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "======================================"
echo "✓ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your POLYGON_API_KEY"
echo "2. Activate the virtual environment: source venv/bin/activate"
echo "3. Run the server: uvicorn app.main:app --reload"
echo "4. Visit: http://localhost:8000/docs"
echo ""
echo "Get your free API key at: https://polygon.io/"
