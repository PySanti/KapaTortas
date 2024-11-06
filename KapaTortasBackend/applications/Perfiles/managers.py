from django.contrib.auth.models import BaseUserManager

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