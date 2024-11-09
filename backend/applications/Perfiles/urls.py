from django.contrib import admin
from django.urls import path
from .views import (
ConsultarPerfilAPI,
CrearPerfilAPI,
CheckPasswordAPI
)

urlpatterns = [
    path("consultar_password/", CheckPasswordAPI.as_view()),
    path("crear/", CrearPerfilAPI.as_view()),
    path("<str:email_perfil>/", ConsultarPerfilAPI.as_view()),  # Incluye barra final opcional para consistencia
]
