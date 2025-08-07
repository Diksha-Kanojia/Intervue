@echo off
echo Deploying to Surge.sh (Free hosting)
cd /d "%~dp0"

echo Installing Surge globally...
npm install -g surge

echo Deploying your app...
cd dist
surge . --domain intervue-polling.surge.sh

echo.
echo Your app will be live at: https://intervue-polling.surge.sh
pause
