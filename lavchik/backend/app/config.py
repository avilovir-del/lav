import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lavchik.db")
API_KEY = os.getenv("API_KEY", "change-me-now")
ADMINS = [int(x) for x in (os.getenv("ADMINS","").split(",") if os.getenv("ADMINS") else [])]
TELEGRAM_BOT_TOKEN = os.getenv("BOT_TOKEN", "")