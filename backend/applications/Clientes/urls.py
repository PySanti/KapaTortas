from django.urls import path
from .controllers.views import (
    CrearDireccionEnvioAPI,
    EliminarDireccionEnvioAPI,
    EditarDireccionEnvioAPI
)

urlpatterns = [
    path("crear_direccion/",CrearDireccionEnvioAPI.as_view()),
    path("eliminar_direccion/",EliminarDireccionEnvioAPI.as_view()),
    path("editar_direccion/",EditarDireccionEnvioAPI.as_view()),
]

