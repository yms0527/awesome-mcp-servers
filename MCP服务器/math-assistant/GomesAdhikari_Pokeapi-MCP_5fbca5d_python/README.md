# Pokémon AI Demo

A full-stack application for exploring Pokémon data, comparing Pokémon, suggesting counters, and generating teams using AI. The system features a Django REST API backend and a React/MUI frontend.

---

## Table of Contents
- [System Setup and Deployment](#system-setup-and-deployment)
- [Available Modules and Their Use](#available-modules-and-their-use)
- [How to Use the Team Builder](#how-to-use-the-team-builder)
- [Web Interface Walkthrough](#web-interface-walkthrough)
- [Instructions for Agent Integration](#instructions-for-agent-integration)

---

## System Setup and Deployment

### Prerequisites
- **Python 3.8+** (for backend)
- **Node.js 16+ & npm** (for frontend)
- **pip** (Python package manager)

### Backend Setup (Django/DRF)
1. Navigate to the backend directory:
   ```sh
   cd mcp_server
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```sh
   python manage.py migrate
   ```
4. Start the backend server:
   ```sh
   python manage.py runserver
   ```
   The API will be available at `http://127.0.0.1:8000/api/`.

### Frontend Setup (React/MUI)
1. Navigate to the frontend directory:
   ```sh
   cd mcp_frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   npm install @mui/material @emotion/react @emotion/styled
   npm install @mui/icons-material


   ```
3. Start the frontend server:
   ```sh
   npm start
   ```
   The app will be available at `http://localhost:5173/`.

4. Start the app automatically -

### In terminal run command start.bat (for windows)
### start.sh for (linux distro)

### Environment Variables
- By default, the frontend expects the backend at `http://127.0.0.1:8000/api/agent/`. Adjust `API_BASE` in `mcp_frontend/src/App.jsx` if needed.

---

dotenv structure (.env)
- make a .env file inside mcpserver folder
- contents -
"
POKE_API_URL = "https://pokeapi.co/api/v2/"
GOOGLE_API_KEY = "your api key"
"

---

## Available Modules and Their Use

The backend exposes four main endpoints:

1. **Pokémon Info** (`POST /api/agent/pokemon-info/`)
   - Input: `{ "name": "pikachu" }`
   - Output: Basic info, stats, abilities, moves, evolution, and flavor text.

2. **Compare Pokémon** (`POST /api/agent/compare/`)
   - Input: `{ "pokemon1": "pikachu", "pokemon2": "bulbasaur" }`
   - Output: Stat-by-stat comparison, type advantage, shared/unique abilities.

3. **Suggest Counters** (`POST /api/agent/strategy/`)
   - Input: `{ "name": "charizard" }`
   - Output: Weaknesses and recommended counter Pokémon.

4. **Team Builder** (`POST /api/agent/team/`)
   - Input: `{ "description": "balanced team with fire and water types" }`
   - Output: AI-generated team with roles and images.

---

## How to Use the Team Builder

- **Purpose:** Generate a Pokémon team based on a natural language description (e.g., "offensive team with good type coverage").
- **How to Use:**
  1. Go to the "Generate Team" section in the web UI.
  2. Enter your team description in the input field.
  3. Click "Generate".
  4. The AI will return a team of Pokémon, each with a name, role, and image.
- **API Usage:**
  - Send a POST request to `/api/agent/team/` with `{ "description": "your team idea" }`.
  - Receive a structured team suggestion in the response.

---

## Web Interface Walkthrough

The web app is organized into four main cards:

1. **Search for Pokémon**
   - Enter a Pokémon name to view its stats, types, abilities, moves, evolution chain, and flavor text.
2. **Compare Two Pokémon**
   - Enter two Pokémon names to compare their stats, type advantages, and abilities side-by-side.
3. **Suggest Counters**
   - Enter a Pokémon name to see its weaknesses and recommended counters.
4. **Generate Team**
   - Describe your desired team and get an AI-generated team with roles and images.

Each section provides instant feedback, loading indicators, and error messages for a smooth user experience.

---

## Instructions for Agent Integration

You can integrate external agents or scripts with the backend API. Example usage:

- **Python Example:**
  ```python
  import requests
  response = requests.post('http://127.0.0.1:8000/api/agent/pokemon-info/', json={"name": "pikachu"})
  print(response.json())
  ```
- **Endpoints:**
  - `/api/agent/pokemon-info/` (POST)
  - `/api/agent/compare/` (POST)
  - `/api/agent/strategy/` (POST)
  - `/api/agent/team/` (POST)
- **Request/Response Format:** All endpoints accept and return JSON.

---

## License
This project is for educational/demo purposes and is not affiliated with Nintendo, Game Freak, or The Pokémon Company. 