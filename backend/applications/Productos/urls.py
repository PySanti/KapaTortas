from django.urls import path
from .controllers.views import (
    ConsultarProductoAPI,
    ObtenerListaProductosAPI
)

urlpatterns = [
    path("all_productos/",ObtenerListaProductosAPI.as_view()),
    path("<int:id_producto>/",ConsultarProductoAPI.as_view()),
]
