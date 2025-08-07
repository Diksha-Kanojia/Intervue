@echo off
echo Setting up GitHub remote and pushing code...
cd /d "%~dp0"

echo Please replace YOUR_USERNAME with your actual GitHub username
echo git remote add origin https://github.com/YOUR_USERNAME/Intervue.git
echo git push -u origin main
echo.
echo After creating the GitHub repository, run:
echo git remote add origin https://github.com/YOUR_USERNAME/Intervue.git
echo git push -u origin main

pause
