@echo off
echo Deploying to Firebase Hosting (Free)
cd /d "%~dp0"

echo Installing Firebase CLI...
npm install -g firebase-tools

echo Initializing Firebase...
firebase login
firebase init hosting

echo.
echo Follow the prompts:
echo 1. Use existing project or create new one
echo 2. Public directory: dist
echo 3. Single-page app: Yes
echo 4. Automatic builds: No
echo.

echo Deploying...
firebase deploy

echo.
echo Your app will be live at: https://YOUR-PROJECT.web.app
pause
