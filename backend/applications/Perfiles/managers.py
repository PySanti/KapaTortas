from django.contrib.auth.models import BaseUserManager
from backend.utils.constants import BASE_PROFILE_SHOWABLE_FIELDS
from backend.utils.constants import RolEnum

class PerfilesManager(BaseUserManager):
    def _create_user(self, nombre_completo, password, correo, is_superuser, is_staff, **kwargs):
        new_user = self.model(
            nombre_completo = nombre_completo,
            correo = correo,
            is_superuser = is_superuser,
            is_staff = is_staff,
            contraseña = password,
            is_active = is_staff or is_superuser,
            **kwargs
        )
        new_user.save(using=self.db)
        return new_user

    def create_superuser(self, nombre_completo, password, correo, **kwargs):
        return self._create_user( nombre_completo, password, correo, True, True, rol=RolEnum.ADMIN,  **kwargs)
    def create_user(self, nombre_completo, password, correo, **kwargs):
        return self._create_user( nombre_completo, password, correo, False, False, **kwargs)
    def crear_perfil(self, nombre_completo, password, correo,  rol, cedula):
        from applications.Clientes.models import Clientes
        new_profile =  self._create_user( nombre_completo, password, correo,rol == "administrador" , rol in ["administrador", "empleado"], rol=rol, cedula=cedula)
        if rol == "cliente":
            return Clientes.objects.crear_cliente(perfil=new_profile)
        else:
            return new_profile
    
