from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models  
from ..managers import PerfilesManager
from django.contrib.auth.hashers import make_password, check_password  
from backend.utils.constants import RolEnum



class Perfiles(AbstractBaseUser, PermissionsMixin):  
    nombre_completo     = models.CharField()
    cedula              = models.CharField(blank=True, null=True, max_length=9)
    correo              = models.EmailField(unique=True)
    contraseña          = models.CharField(max_length=128)
    numero_telefonico   = models.CharField(blank=True, null=True)
    fecha_nacimiento    = models.DateField(null=True, blank=True)
    link_foto           = models.CharField(blank=True)
    rol                 = models.CharField(choices=[(role.value, role.name) for role in RolEnum], default=RolEnum.EMPLEADO)
    stripeCustomerId    = models.CharField(unique=True, blank=True, null=True)
    is_active           = models.BooleanField(default=False) # para correo confirmado
    is_staff            = models.BooleanField(default=False) # para empelados y admin (staff)

    USERNAME_FIELD  = 'correo'
    REQUIRED_FIELDS = ['nombre_completo']

    #* MANAGER
    objects         = PerfilesManager()

    def set_password(self, raw_password):  
        """Establece la contraseña usando el hasheo."""  
        self.contraseña = raw_password
    def check_password(self, raw_password):  
        """Verifica si la contraseña está correcta."""  
        return check_password(raw_password, self.contraseña)  
    def save(self, *args, **kwargs):
        """
            Este metodo se ejecuta para guardar los cambios de los registros en la DB
            Se sobreescribe para evitar problemas de encriptacion de contraseñas por crear perfiles desde el admin
        """
        if self.pk is None:  
            self.contraseña = make_password(self.contraseña)
        elif Perfiles.objects.get(id=self.pk).contraseña != self.contraseña:
            self.contraseña = make_password(self.contraseña)
        super().save(*args, **kwargs)  


    def __str__(self):
        return f"{self.rol.split('.')[-1]} : {self.nombre_completo}"
    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfiles'

