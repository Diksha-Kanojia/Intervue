@echo off
echo Creating clean build for Vercel...
cd /d "%~dp0"

echo Removing old build...
if exist dist rmdir /s /q dist

echo Building with correct base path...
npx vite build --base=/

echo Verifying build...
if exist dist\index.html (
    echo ✅ Build successful!
    echo Checking for correct paths...
    findstr /C:"/assets/" dist\index.html >nul
    if %errorlevel% equ 0 (
        echo ✅ Correct paths found in index.html
    ) else (
        echo ❌ Incorrect paths in index.html
        type dist\index.html
    )
) else (
    echo ❌ Build failed - dist/index.html not found
)

echo.
echo Build ready for deployment!
pause
