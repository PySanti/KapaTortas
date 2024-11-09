from django.urls import path
from .views import (
    ConsultarProductoAPI,
    ObtenerListaProductosAPI
)

urlpatterns = [
    path("consultar/",ConsultarProductoAPI.as_view()),
    path("obtener/",ObtenerListaProductosAPI.as_view()),
]
