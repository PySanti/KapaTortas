from django.urls import path
from .views import (
    ConsultarProductoAPI,
    ObtenerListaProductosAPI
)

urlpatterns = [
    path("<int:id_producto>/",ConsultarProductoAPI.as_view()),
    path("todos/",ObtenerListaProductosAPI.as_view()),
]
