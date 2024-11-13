from django.urls import path
from .views import (
    CrearPedidoAPI
)

urlpatterns = [
    path("crear/",CrearPedidoAPI.as_view()),
]
