from django.urls import path
from .controllers.views import (
    CrearPedidoAPI
)

urlpatterns = [
    path("crear/",CrearPedidoAPI.as_view()),
]
