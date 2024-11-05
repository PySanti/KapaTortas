from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from applications.Perfiles.models import Perfiles
from .managers import ClientesManager


# Create your models here.

class Clientes(AbstractBaseUser, PermissionsMixin):  
    perfil          =   models.OneToOneField(Perfiles, on_delete=models.CASCADE)
    # ordenes
    # direcciones de envio


    objects         =   ClientesManager()
