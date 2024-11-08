from django.contrib import admin
from django.urls import path
from .views import (
ConsultarPerfilAPI,
CrearPerfilAPI
)

urlpatterns = [
    path("perfiles/consultar",ConsultarPerfilAPI.as_view()),
    path("perfiles/crear",CrearPerfilAPI.as_view())
]
