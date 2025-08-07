@echo off
echo ================================
echo Push to GitHub - Intervue App
echo ================================
echo.

cd /d "%~dp0"

set /p username=Enter your GitHub username: 

echo.
echo Checking if remote already exists...
git remote remove origin >nul 2>&1

echo Adding GitHub remote...
git remote add origin https://github.com/%username%/Intervue.git

echo.
echo Verifying remote...
git remote -v

echo.
echo Pushing code to GitHub...
echo (You may need to enter your GitHub credentials)
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
