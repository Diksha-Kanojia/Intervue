@echo off
echo Starting the Intervue Poll System...

echo.
echo Starting the server in a new window...
start cmd /k call start-server.bat

echo.
echo Starting the frontend in a new window...
start cmd /k call start-frontend.bat

echo.
echo Both server and frontend are now starting.
echo.
echo Teacher URL: http://localhost:5173/teacher-create-poll
echo Student URL: http://localhost:5173/student-onboarding
echo.
echo Press any key to exit this window...
pause > nul
