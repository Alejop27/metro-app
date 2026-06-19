from app.repositories.firebase_repository import FirebaseRepository


repo = FirebaseRepository()


class RouteService:

    def get_routes(self):

        return repo.get_all("routes")

    def get_route(self, route_id):

        return repo.get("routes", route_id)