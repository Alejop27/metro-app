from dotenv import load_dotenv
import os

load_dotenv()

PROJECT_NAME = os.getenv("PROJECT_NAME")
VERSION = os.getenv("VERSION")

FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")