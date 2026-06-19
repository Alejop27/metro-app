from app.repositories.txt_repository import TxtRepository


class RouteService:
    def __init__(self):
        self.repo = TxtRepository("routes")

    def get_all(self) -> list[dict]:
        return self.repo.find_all()
