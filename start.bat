@echo off
cls
echo ========================================
echo  Intervue Polling System - Final Setup
echo ========================================
echo.

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies OK.
)

echo.
echo Starting the application...
echo.
echo ========================================
echo  APPLICATION READY
echo ========================================
echo.
echo Your polling system is now running at:
echo   http://localhost:3000
echo.
echo Routes available:
echo   /                     - Home page
echo   /student-onboarding   - Student login
echo   /teacher-create-poll  - Teacher poll creation
echo   /student-waiting      - Student waiting room
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm run dev
