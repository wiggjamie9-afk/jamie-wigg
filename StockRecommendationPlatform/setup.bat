@echo off
REM Stock Recommendation Platform - Setup Script for Windows

echo ======================================
echo Stock Recommendation Platform Setup
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo ✓ Python found
python --version
echo.

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo 📦 Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo 📦 Installing dependencies...
pip install -r requirements.txt

REM Copy environment file
if not exist .env (
    echo 📋 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env and add your POLYGON_API_KEY
) else (
    echo ✓ .env file already exists
)

echo.
echo ======================================
echo ✓ Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Edit .env and add your POLYGON_API_KEY
echo 2. Run: venv\Scripts\activate.bat
echo 3. Run: uvicorn app.main:app --reload
echo 4. Visit: http://localhost:8000/docs
echo.
echo Get your free API key at: https://polygon.io/
echo.
pause
