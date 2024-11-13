from rest_framework.authtoken.models import Token
from applications.Perfiles.models import Perfiles
from applications.Clientes.models import Clientes
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from django.core.exceptions import ObjectDoesNotExist
from backend.utils.constants import RolEnum


def register_social_user(provider, email, name):
    filtered_user_by_email = Clientes.objects.filter(perfil__correo=email)
    if filtered_user_by_email.exists():
        if provider == filtered_user_by_email[0].auth_provider:
            registered_user = filtered_user_by_email[0].perfil
            registered_user.check_password(settings.SOCIAL_SECRET) 
            Token.objects.filter(user=registered_user).delete()
            Token.objects.create(user=registered_user)
            new_token = list(Token.objects.filter(
                user_id=registered_user).values("key"))
            return {
                'user_id': registered_user.id,
                'tokens': str(new_token[0]['key'])}
        else:
            raise AuthenticationFailed(
                detail='Login using ' + filtered_user_by_email[0].auth_provider)
    else:
        user = Perfiles.objects.crear_perfil(email, settings.SOCIAL_SECRET, email, RolEnum.CLIENTE)
        user.is_active = True
        user.save()
        new_user = Perfiles.objects.get(correo=email)
        new_user.check_password(settings.SOCIAL_SECRET)
        Token.objects.create(user=new_user)
        new_token = list(Token.objects.filter(user_id=new_user).values("key"))
        return {
            'user_id': new_user.id,
            'tokens': str(new_token[0]['key']),
        }