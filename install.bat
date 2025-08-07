@echo off
echo Installing frontend dependencies...
call npm install
echo.
echo Installing backend dependencies...
cd server
call npm install
echo.
echo All dependencies installed successfully!
echo.
echo To start the application:
echo - Frontend: npm run dev
echo - Backend: cd server && npm start
echo - Or use start.bat to run both
pause
