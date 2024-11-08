from django.urls import path
from .views import (
    ConsultarProductoAPI,
    ObtenerListaProductosAPI
)

urlpatterns = [
    path("productos/consultar",ConsultarProductoAPI.as_view()),
    path("productos/obtener",ObtenerListaProductosAPI.as_view()),
]
