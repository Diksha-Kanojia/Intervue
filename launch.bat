@echo off
cls
echo ========================================
echo  STARTING INTERVUE POLLING SYSTEM
echo ========================================
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting React development server...
echo.

REM Start the development server in background
start /b npm run dev

echo Waiting for server to start...
timeout /t 5 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo  POLLING SYSTEM LAUNCHED!
echo ========================================
echo.
echo Your application is running at:
echo   http://localhost:3000
echo.
echo Available routes:
echo   /                     - Home (choose role)
echo   /student-onboarding   - Student login
echo   /teacher-create-poll  - Create new poll
echo.
echo To stop: Close this window or press Ctrl+C
echo ========================================

pause
