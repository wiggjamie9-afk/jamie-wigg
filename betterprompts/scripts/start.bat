@echo off
REM BetterPrompts launcher - Run from source

setlocal enabledelayedexpansion

REM Check if virtual environment exists
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Install dependencies if needed
pip install -e . > nul 2>&1

REM Launch the app
echo.
echo Starting BetterPrompts...
echo.
python -m betterprompts

pause
