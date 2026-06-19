from app.repositories.txt_repository import TxtRepository


class BusService:
    def __init__(self):
        self.repo = TxtRepository("buss")

    def get_all(self) -> list[dict]:
        return self.repo.find_all()
