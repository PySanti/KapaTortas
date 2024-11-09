from django.contrib import admin
from django.urls import path
from .views import (
ConsultarPerfilAPI,
CrearPerfilAPI
)

urlpatterns = [
    path("<str:email_perfil>/", ConsultarPerfilAPI.as_view()),  # Incluye barra final opcional para consistencia
    path("crear/", CrearPerfilAPI.as_view()),
]
