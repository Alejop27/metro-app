from app.repositories.txt_repository import TxtRepository


class EventService:
    def __init__(self):
        self.repo = TxtRepository("events")

    def get_all(self) -> list[dict]:
        return self.repo.find_all()
