from django.urls import path
from .controllers.views import (
    CrearDireccionEnvioAPI,
    EliminarDireccionEnvioAPI
)

urlpatterns = [
    path("crear_direccion/",CrearDireccionEnvioAPI.as_view()),
    path("eliminar_direccion/",EliminarDireccionEnvioAPI.as_view()),
]

