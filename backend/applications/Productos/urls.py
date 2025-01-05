from django.urls import path
from .controllers.views import (
    ConsultarProductoAPI,
    ObtenerListaProductosAPI,
    ConsultarProductoEspecialAPI,
    EditarProductoByIdAPI,
    ObtenerTodosProductosAPI
)

urlpatterns = [
    path("all_productos/",ObtenerListaProductosAPI.as_view()), # Trae todos los productos excepto los de categoria especial
    path("todos/",ObtenerTodosProductosAPI.as_view()), # Trae todos los productos (sin filtro de categoria)
    path("<int:id_producto>/",ConsultarProductoAPI.as_view()),
    path("especial/", ConsultarProductoEspecialAPI.as_view()),
    path("editar/<int:id_producto>/",EditarProductoByIdAPI.as_view()),
]
