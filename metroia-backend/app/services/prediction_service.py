from app.repositories.txt_repository import TxtRepository


class PredictionService:
    def __init__(self):
        self.repo = TxtRepository("predictions")

    def get_all(self) -> list[dict]:
        return self.repo.find_all()
