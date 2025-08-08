@echo off
echo Deploying to Surge with corrected paths...
cd /d "%~dp0"

echo Navigating to dist folder...
cd dist

echo Publishing to Surge...
surge . intervue-polling.surge.sh

echo.
echo Deployment complete! Your app should be live at:
echo https://intervue-polling.surge.sh
pause
