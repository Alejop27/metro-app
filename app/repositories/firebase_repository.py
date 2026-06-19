from app.config.firebase import db


class FirebaseRepository:

    def get_all(self, collection):

        docs = db.collection(collection).stream()

        return [
            {
                "id": doc.id,
                **doc.to_dict()
            }
            for doc in docs
        ]

    def get(self, collection, doc_id):

        doc = db.collection(collection).document(doc_id).get()

        if doc.exists:
            return doc.to_dict()

        return None

    def create(self, collection, data):

        ref = db.collection(collection).document()

        ref.set(data)

        return ref.id

    def update(self, collection, doc_id, data):

        db.collection(collection).document(doc_id).update(data)

    def delete(self, collection, doc_id):

        db.collection(collection).document(doc_id).delete()