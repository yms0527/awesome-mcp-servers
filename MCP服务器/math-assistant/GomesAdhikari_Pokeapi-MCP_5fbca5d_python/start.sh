#!/bin/bash

echo "Starting Django backend..."
cd mcp_server
gnome-terminal -- bash -c "python3 manage.py runserver; exec bash"

cd ../mcp_frontend
echo "Starting React frontend..."
gnome-terminal -- bash -c "npm run dev; exec bash"

sleep 3  # wait a bit to ensure server starts
xdg-open http://localhost:5173  # opens React app in default browser

cd ..
