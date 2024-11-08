from django.db import models
from applications.Perfiles.models import Perfiles
from .managers import ClientesManager


# Create your models here.

class Clientes(models.Model):  
    perfil          =   models.OneToOneField(Perfiles, on_delete=models.CASCADE)
    # ordenes
    # direcciones de envio


    objects         =   ClientesManager()

    def __str__(self):
        return f"{self.perfil.nombre_completo}"
    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
