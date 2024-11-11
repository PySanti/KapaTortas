from django.db import models
from applications.Perfiles.models import Perfiles
from .managers import ClientesManager


class DireccionesEnvio(models.Model):
    direccion_1     = models.CharField()
    direccion_2     = models.CharField()
    pais            = models.CharField(default="VENEZUELA")
    estado          = models.CharField()
    codigo_postal   = models.IntegerField()

    def __str__(self):
        return f"{self.id} : {self.pais}/{self.codigo_postal}"
    class Meta:
        verbose_name = 'DirecciónEnvío'
        verbose_name_plural = 'DireccionesEnvío'


class Clientes(models.Model):  
    perfil          =   models.OneToOneField(Perfiles, on_delete=models.CASCADE)
    direcciones     =   models.ManyToManyField(DireccionesEnvio)
    auth_provider   =   models.CharField(max_length=50, default="google")


    objects         =   ClientesManager()

    def __str__(self):
        return f"{self.perfil.nombre_completo}"
    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'


