from app.repositories.txt_repository import TxtRepository


class HeatmapService:
    def __init__(self):
        self.repo = TxtRepository("heatmaps")

    def get_all(self) -> list[dict]:
        return self.repo.find_all()
