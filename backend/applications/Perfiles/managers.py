from django.contrib.auth.models import BaseUserManager
from backend.utils.constants import BASE_PROFILE_SHOWABLE_FIELDS

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
    def crear_perfil(self, nombre_completo, password, correo,  rol):
        from applications.Clientes.models import Clientes
        new_profile =  self._create_user( nombre_completo, password, correo,rol == "administrador" , rol in ["administrador", "empleado"])
        new_profile.rol = rol
        new_profile.save()
        if rol == "cliente":
            return Clientes.objects.crear_cliente(perfil=new_profile)
        else:
            return new_profile
    def user_exists(self, nombre_completo, correo):
        """
            Retornara false si no existe ningun perfil con el correo o nombre_completo indicado
            Un mensaje de error en caso de que si
        """
        if self.model.objects.filter(correo=correo):
            return "email_exists"
        elif self.model.objects.filter(nombre_completo=nombre_completo):
            return "nombre_completo_exists"
        else:
            return False
    def get_perfil_dict(self, perfil):
        """
            Toma un objeto tipo Perfil y retorna un diccionario a partir de los SHOWABLE_FIELDS, 
            retornable en un JsonResponse
        """
        return {k:v for k,v in perfil.items() if k in BASE_PROFILE_SHOWABLE_FIELDS}
