from django.db import models
from applications.Perfiles.models import Perfiles
from ..managers import ClientesManager
from backend.utils.get_expiration_date import get_expiration_date
from backend.utils.generate_verification_token import generate_verification_token
from django.utils import timezone
from backend.utils.constants import (DEFAULT_PAIS, DEFAULT_CIUDAD)

class VerificationToken(models.Model):
    token = models.CharField(max_length=10, blank=False, null=False, default=generate_verification_token)
    expiration_date = models.DateTimeField(default=get_expiration_date)

    def is_expired(self):  
        return timezone.now() > self.expiration_date  
    def __str__(self):
        return f"{self.token}"
    class Meta:
        verbose_name = 'VerificationToken'
        verbose_name_plural = 'VerificationTokens'


class DireccionesEnvio(models.Model):
    pais            = models.CharField(default=DEFAULT_PAIS)
    ciudad          = models.CharField(default=DEFAULT_CIUDAD)
    estado          = models.CharField()
    direccion       = models.CharField()
    referencia      = models.CharField(null=True, blank=True)
    codigo_postal   = models.IntegerField()


    def __str__(self):
        return f"{self.id} : {self.referencia}/{self.codigo_postal}"
    class Meta:
        verbose_name = 'DirecciónEnvío'
        verbose_name_plural = 'DireccionesEnvío'


class Clientes(models.Model):  
    auth_provider       =   models.CharField(max_length=50, default="google")
    verification_token  =   models.OneToOneField(VerificationToken, on_delete=models.SET_NULL, null=True, blank=True, related_name="cliente")
    perfil              =   models.OneToOneField(Perfiles, on_delete=models.CASCADE, related_name="cliente")
    direcciones         =   models.ManyToManyField(DireccionesEnvio, related_name="clientes")
    direccion_preferida =   models.ForeignKey(DireccionesEnvio, related_name="clientes_preferidos", on_delete=models.SET_NULL, null=True, blank=True)


    objects         =   ClientesManager()

    def __str__(self):
        return f"{self.perfil.nombre_completo}"
    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'


