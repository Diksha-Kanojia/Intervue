@echo off
echo Starting git operations...
git add .
git commit -m "URGENT: Fix index.html template for Vercel deployment"
git push origin main --force
echo Done!
pause
