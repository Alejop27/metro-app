from fastapi import APIRouter

from app.services.route_service import RouteService

router = APIRouter(
    prefix="/routes",
    tags=["Routes"]
)

service = RouteService()


@router.get("")
def get_routes():

    return service.get_routes()


@router.get("/{route_id}")
def get_route(route_id: str):

    return service.get_route(route_id)