from django.contrib.auth.models import BaseUserManager

class ClientesManager(BaseUserManager):
    def crear_cliente(self, perfil):
        return self.model.objects.create(perfil=perfil)
