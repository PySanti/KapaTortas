from django.contrib.auth.models import BaseUserManager

class UsuariosManager(BaseUserManager):
    def _create_user(self, nombre_completo, password, email, is_staff, is_superuser, **kwargs):
        new_user = self.model(
            nombre_completo = nombre_completo,
            email = email,
            is_staff = is_staff,
            is_superuser = is_superuser,
            **kwargs
        )
        new_user.set_password(password)
        new_user.save(using=self.db)
        return new_user
    def create_superuser(self, nombre_completo, password, email, **kwargs):
        return self._create_user(nombre_completo, password, email, True, True, **kwargs)
    def create_user(self, nombre_completo, password, email, **kwargs):
        return self._create_user(nombre_completo, password, email, False, False, **kwargs)