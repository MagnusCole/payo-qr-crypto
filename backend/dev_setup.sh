#!/bin/bash
# Payo Backend - Development Script

set -e

echo "🚀 Payo Backend Development Setup"
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration!"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  source venv/bin/activate"
echo "  python run.py"
echo ""
echo "To run tests:"
echo "  python test_backend.py"
echo ""
echo "To view API documentation:"
echo "  http://localhost:8000/docs"
echo ""
echo "To run with Docker:"
echo "  docker-compose up --build"
