@echo off
echo Installing Netlify CLI and deploying...
cd /d "%~dp0"

echo Installing Netlify CLI globally...
npm install -g netlify-cli

echo Deploying to Netlify...
netlify deploy --dir=dist --prod

echo.
echo Your app should now be live on Netlify!
pause
