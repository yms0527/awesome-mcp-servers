from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    GROUNDEX_API_KEY: str = os.getenv("GROUNDEX_API_KEY")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")

settings = Settings()
