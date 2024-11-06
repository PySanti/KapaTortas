from django.contrib.auth.models import BaseUserManager
from .models import Clientes

class ClientesManager(BaseUserManager):
    def crear_cliente(self, perfil):
        return Clientes.objects.create(perfil=perfil)
