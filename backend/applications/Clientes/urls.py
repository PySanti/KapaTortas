from django.urls import path
from .controllers.views import (
    CrearDireccionEnvioAPI
)

urlpatterns = [
    path("crear_direccion/",CrearDireccionEnvioAPI.as_view()),
]

