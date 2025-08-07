@echo off
echo ================================
echo Push to GitHub - Intervue App
echo ================================
echo.
echo Please replace YOUR_USERNAME with your actual GitHub username
echo.

cd /d "%~dp0"

set /p username=Enter your GitHub username: 

echo.
echo Adding GitHub remote...
git remote add origin https://github.com/%username%/Intervue.git

echo.
echo Pushing code to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Code pushed to GitHub.
    echo.
    echo Next step: Enable GitHub Pages
    echo 1. Go to: https://github.com/%username%/Intervue/settings/pages
    echo 2. Set Source to: GitHub Actions
    echo 3. Your app will be live at: https://%username%.github.io/Intervue/
    echo.
    start https://github.com/%username%/Intervue/settings/pages
) else (
    echo ❌ Push failed. Make sure you created the repository on GitHub first.
)

pause
