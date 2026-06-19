@echo off
REM Copy BetterPrompts.exe to Desktop

setlocal enabledelayedexpansion

echo Publishing BetterPrompts to Desktop...
echo.

REM Build the exe if it doesn't exist
if not exist "dist\BetterPrompts.exe" (
    echo Building executable first...
    call build_exe.bat
    if !errorlevel! neq 0 (
        echo Build failed!
        pause
        exit /b 1
    )
)

REM Get Desktop path
for /f "tokens=2*" %%i in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders" /v Desktop') do set DESKTOP=%%j

REM Copy exe to Desktop
echo Copying BetterPrompts.exe to Desktop...
copy "dist\BetterPrompts.exe" "!DESKTOP!\BetterPrompts.exe" > nul

if !errorlevel! equ 0 (
    echo.
    echo Success! BetterPrompts.exe is now on your Desktop.
    echo.
) else (
    echo.
    echo Failed to copy to Desktop.
    echo.
)

pause
