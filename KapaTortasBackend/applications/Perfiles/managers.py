from django.contrib.auth.models import BaseUserManager
from KapaTortasBackend.utils.constants import RolEnum
from applications.Clientes.models import Clientes

class PerfilesManager(BaseUserManager):
    def _create_user(self, nombre_completo, password, correo, is_superuser, is_staff, **kwargs):
        new_user = self.model(
            nombre_completo = nombre_completo,
            correo = correo,
            is_superuser = is_superuser,
            is_staff = is_staff,
            **kwargs
        )
        new_user.set_password(password)
        new_user.save(using=self.db)
        return new_user
    def create_superuser(self, nombre_completo, password, correo, **kwargs):
        return self._create_user( nombre_completo, password, correo, True, True, **kwargs)
    def create_user(self, nombre_completo, password, correo, **kwargs):
        return self._create_user( nombre_completo, password, correo, False, False, **kwargs)
    def crear_perfil(self, nombre_completo, password, correo, numero_telefonico, fecha_nacimiento, rol):
        is_staff = rol in [RolEnum.ADMIN, RolEnum.ADMIN]
        is_superuser = rol == RolEnum.ADMIN
        new_profile =  self._create_user( nombre_completo, password, correo, is_superuser, is_staff)
        new_profile.numero_telefonico = numero_telefonico
        new_profile.fecha_nacimiento = fecha_nacimiento
        new_profile.rol = rol
        new_profile.save()
        if rol == RolEnum.CLIENTE:
            return Clientes.objects.crear_cliente(perfil=new_profile)
        else:
            return new_profile
    def user_exists(self, nombre_completo, correo, numero_telefonico):
        """
            Retornara false si no existe ningun perfil con el correo, numero_telefonico o nombre_completo indicado
            Un mensaje de error en caso de que si
        """
        if self.model.objects.filter(correo=correo):
            return "email_exists"
        elif self.model.objects.filter(nombre_completo=nombre_completo):
            return "nombre_completo_exists"
        elif self.model.objects.filter(numero_telefonico=numero_telefonico):
            return "numero_telefonico_exists"
        else:
            return False
