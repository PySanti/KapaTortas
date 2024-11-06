from django.contrib import admin
from django.urls import path
from .views import ConsultarPerfilAPI

urlpatterns = [
    path("perfiles/consultar",ConsultarPerfilAPI.as_view())
]
