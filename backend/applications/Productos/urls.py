from django.urls import path
from .controllers.views import (
    ConsultarProductoAPI,
    ObtenerListaProductosAPI,
    EditarProductoByIdAPI
)

urlpatterns = [
    path("all_productos/",ObtenerListaProductosAPI.as_view()),
    path("<int:id_producto>/",ConsultarProductoAPI.as_view()),
    path("editar/<int:id_producto>/",EditarProductoByIdAPI.as_view()),
]
