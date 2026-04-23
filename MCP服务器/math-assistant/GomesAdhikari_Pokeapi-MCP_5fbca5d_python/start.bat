@echo off
echo Starting Django backend...
cd mcp_server
start cmd /k "python manage.py runserver"

cd ../mcp_frontend
echo Starting React frontend...
start cmd /k "npm run dev"

timeout /t 3 > nul
start http://localhost:5173


cd ..
