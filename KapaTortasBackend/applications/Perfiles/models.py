from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models  
from .managers import PerfilesManager
from django.contrib.auth.hashers import make_password, check_password  
from enum import Enum  

class RolEnum(Enum):  
    ADMIN = 'administrador'  
    EMPLEADO = 'empleado'  
    CLIENTE = 'cliente'


class Perfiles(AbstractBaseUser, PermissionsMixin):  
    nombre_completo     = models.CharField(unique=True)
    correo              = models.EmailField(unique=True)
    contraseña          = models.CharField(max_length=128)
    numero_telefonico   = models.CharField(unique=True)
    fecha_nacimiento    = models.DateField(null=True, blank=True)
    link_foto           = models.CharField(blank=True)
    rol                 = models.CharField(choices=[(role.value, role.name) for role in RolEnum], default=RolEnum.CLIENTE)
    is_active           = models.BooleanField(default=False) # para correo confirmado


    REQUIRED_FIELDS = ['correo']
    USERNAME_FIELD  = 'nombre_completo'

    #* MANAGER
    objects         = PerfilesManager()


    def set_password(self, raw_password):  
        """Establece la contraseña usando el hasheo."""  
        self.contraseña = make_password(raw_password)  
    def check_password(self, raw_password):  
        """Verifica si la contraseña está correcta."""  
        return check_password(raw_password, self.contraseña)  
    def __str__(self):
        return f"{self.rol} : {self.nombre_completo}"
    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfiles'