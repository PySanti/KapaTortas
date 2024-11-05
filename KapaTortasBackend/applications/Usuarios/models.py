
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models  
from .manager import UsuariosManager

class Usuarios(AbstractBaseUser, PermissionsMixin):  
    nombre_completo = models.CharField(unique=True)
    email           = models.EmailField(unique=True)
    is_staff        = models.BooleanField()
    is_active       = models.BooleanField(default=False)
    fecha_nacimiento = models.DateField(null=True, blank=True)  


    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD  = 'nombre_completo'

    #* MANAGER
    objects         = UsuariosManager()

    def __str__(self):
        return f"{self.nombre_completo}, {self.id}"
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'