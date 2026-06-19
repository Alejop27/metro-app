from app.repositories.txt_repository import TxtRepository


class StationService:
    def __init__(self):
        self.repo = TxtRepository("stations")

    def get_all(self) -> list[dict]:
        return self.repo.find_all()
