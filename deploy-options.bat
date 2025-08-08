@echo off
echo Quick deployment to multiple free hosting services...
cd /d "%~dp0"

echo ============================================
echo Option 1: Netlify Drop (Manual)
echo ============================================
echo 1. Go to: https://app.netlify.com/drop
echo 2. Drag the entire 'dist' folder to the page
echo 3. Your site will be live instantly!
echo.

echo ============================================
echo Option 2: Vercel (GitHub Integration)
echo ============================================
echo 1. Go to: https://vercel.com/new
echo 2. Import your GitHub repository: Diksha-Kanojia/Intervue
echo 3. Deploy with default settings
echo.

echo ============================================
echo Option 3: Firebase Hosting
echo ============================================
echo 1. npm install -g firebase-tools
echo 2. firebase login
echo 3. firebase init hosting
echo 4. firebase deploy
echo.

echo Your dist folder is ready at: %cd%\dist
echo.
pause

start https://app.netlify.com/drop
start https://vercel.com/new
