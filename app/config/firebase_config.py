import firebase_admin

from firebase_admin import credentials

from firebase_admin import firestore

from app.config.settings import FIREBASE_CREDENTIALS

cred = credentials.Certificate(FIREBASE_CREDENTIALS)

firebase_admin.initialize_app(cred)

db = firestore.client()