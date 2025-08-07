@echo off
echo Installing required packages...

echo.
echo Step 1: Installing frontend dependencies...
call npm install @chakra-ui/icons socket.io-client @chakra-ui/react @emotion/react @emotion/styled framer-motion react react-dom react-router-dom

echo.
echo Step 2: Installing development dependencies...
call npm install -D @vitejs/plugin-react vite eslint

echo.
echo Step 3: Creating server directory structure (if not exists)...
if not exist "server\models" mkdir server\models

echo.
echo Step 4: Installing backend dependencies...
cd server
call npm install express socket.io mongoose cors dotenv
call npm install -D nodemon
cd ..

echo.
echo All dependencies installed successfully!
echo.
echo To run the application:
echo - Frontend: npm run dev
echo - Backend: cd server ^&^& npm start
echo - Both: npm run start (or node start.js)
echo.

pause
