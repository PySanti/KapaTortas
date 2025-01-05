from django.urls import path
from .controllers.views import (
    CrearPedidoAPI,
    ObtenerListaVentasAPI,
    ObtenerListaPedidosAPI,
    ConsultarFacturaByOrderAPI,
    EditarEstadoPedidoAPI
)

urlpatterns = [
    path("all_ventas/",ObtenerListaVentasAPI.as_view()),
    path("all_pedidos/",ObtenerListaPedidosAPI.as_view()),
    path("crear/",CrearPedidoAPI.as_view()),
    path("facturas/<int:numero_de_orden>/",ConsultarFacturaByOrderAPI.as_view()),
    path("editar_estado/",EditarEstadoPedidoAPI.as_view()),
]
