@echo off
echo ========================================
echo Complete GitHub Setup - Intervue App
echo ========================================
echo.

cd /d "%~dp0"

echo Please provide your GitHub details:
set /p username=Enter your GitHub username: 
echo.

echo Step 1: Setting up Git remote...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%username%/Intervue.git

echo.
echo Step 2: Verifying Git setup...
git status
echo.
git remote -v

echo.
echo Step 3: Attempting to push to GitHub...
echo (If this fails, you may need to authenticate first)
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Your code is now on GitHub!
    echo.
    echo 🎯 Next Steps:
    echo 1. Your repository: https://github.com/%username%/Intervue
    echo 2. Enable GitHub Pages at: https://github.com/%username%/Intervue/settings/pages
    echo 3. Set Source to: GitHub Actions
    echo 4. Your app will be live at: https://%username%.github.io/Intervue/
    echo.
    echo Opening GitHub Pages settings...
    start https://github.com/%username%/Intervue/settings/pages
    echo.
    echo Opening your repository...
    start https://github.com/%username%/Intervue
) else (
    echo.
    echo ❌ Push failed. This might be due to:
    echo 1. Repository doesn't exist on GitHub yet
    echo 2. Authentication issues
    echo 3. Remote URL is incorrect
    echo.
    echo Solutions:
    echo 1. Create repository manually at: https://github.com/new
    echo    - Repository name: Intervue
    echo    - Make it PUBLIC
    echo    - Don't initialize with README
    echo.
    echo 2. For authentication, try:
    echo    - git config --global user.name "Your Name"
    echo    - git config --global user.email "your-email@example.com"
    echo.
    echo 3. Or use GitHub CLI: gh auth login
    echo.
    start https://github.com/new
)

echo.
pause
