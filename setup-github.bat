@echo off
echo ================================
echo GitHub Setup for Intervue App
echo ================================
echo.

cd /d "%~dp0"

echo Step 1: Checking if GitHub CLI is available...
gh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo GitHub CLI not found. Please install it from: https://cli.github.com/
    echo.
    echo Alternative: Create repository manually at github.com
    echo Repository name: Intervue
    echo Make it PUBLIC for GitHub Pages
    echo.
    echo Then run these commands:
    echo git remote add origin https://github.com/YOUR_USERNAME/Intervue.git
    echo git push -u origin main
    pause
    exit /b
)

echo GitHub CLI found! Attempting to create repository...
echo.

echo Step 2: Authenticating with GitHub (if needed)...
gh auth status
if %errorlevel% neq 0 (
    echo Please authenticate with GitHub first:
    echo gh auth login
    pause
    exit /b
)

echo Step 3: Creating public repository 'Intervue'...
gh repo create Intervue --public --source=. --remote=origin --push

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Repository created and code pushed.
    echo.
    echo Step 4: Enabling GitHub Pages...
    gh api repos/:owner/Intervue/pages -X POST -f source.branch=gh-pages -f source.path=/
    
    echo.
    echo 🎉 Your app will be available at:
    echo https://YOUR_USERNAME.github.io/Intervue/
    echo.
    echo GitHub Actions will build and deploy your app automatically.
    echo Check the Actions tab in your repository to see the deployment progress.
) else (
    echo ❌ Failed to create repository. Please try manually:
    echo 1. Go to github.com
    echo 2. Create new repository named 'Intervue'
    echo 3. Make it public
    echo 4. Follow the instructions to push existing code
)

echo.
pause
