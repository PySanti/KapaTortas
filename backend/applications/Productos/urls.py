from django.urls import path
from .views import (
    ConsultarProductoAPI,
    ObtenerListaProductosAPI
)

urlpatterns = [
    path("todos/",ObtenerListaProductosAPI.as_view()),
    path("<int:id_producto>/",ConsultarProductoAPI.as_view()),
]
