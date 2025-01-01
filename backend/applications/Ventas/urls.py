from django.urls import path
from .controllers.views import (
    CrearPedidoAPI,
    ObtenerListaVentasAPI,
    ObtenerListaPedidosAPI
)

urlpatterns = [
    path("all_ventas/",ObtenerListaVentasAPI.as_view()),
    path("all_pedidos/",ObtenerListaPedidosAPI.as_view()),
    path("crear/",CrearPedidoAPI.as_view()),
]
