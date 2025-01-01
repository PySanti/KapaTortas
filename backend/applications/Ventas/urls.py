from django.urls import path
from .controllers.views import (
    CrearPedidoAPI,
    ObtenerListaVentasAPI
)

urlpatterns = [
    path("todos/",ObtenerListaVentasAPI.as_view()),
    path("crear/",CrearPedidoAPI.as_view()),
]
