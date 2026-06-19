@echo off
REM BetterPrompts Windows executable builder

setlocal enabledelayedexpansion

echo Building BetterPrompts.exe...
echo.

REM Check if .env exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please copy .env.sample to .env and fill in your API keys.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -q pyinstaller

REM Install the package
pip install -q -e .

REM Create dist directory if it doesn't exist
if not exist "dist" mkdir dist

REM Copy .env to dist for bundling
copy .env dist\.env > nul

REM Build the executable
echo Building executable...
pyinstaller --name=BetterPrompts ^
    --onefile ^
    --windowed ^
    --add-data "betterprompts;betterprompts" ^
    --add-data ".env;." ^
    --icon=none ^
    --hidden-import=gradio ^
    --hidden-import=google.generativeai ^
    --hidden-import=groq ^
    --hidden-import=dotenv ^
    betterprompts\__main__.py

echo.
echo Build complete!
echo Executable: dist\BetterPrompts.exe
echo.
echo To launch:
echo   dist\BetterPrompts.exe
echo.

pause
