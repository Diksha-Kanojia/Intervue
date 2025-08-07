@echo off
echo Building Intervue Polling App for deployment...
cd /d "%~dp0"

echo Installing dependencies...
call npm install

echo Building production version...
call npm run build

echo Build complete! Check the 'dist' folder for deployment files.
pause
