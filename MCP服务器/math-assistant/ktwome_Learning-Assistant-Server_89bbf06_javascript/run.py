import uvicorn
from learning_assistant_server.app import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 