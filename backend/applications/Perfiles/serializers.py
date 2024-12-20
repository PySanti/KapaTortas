from rest_framework import serializers
from django.conf import settings
from backend.utils.constants import RolEnum
from backend.utils.google import Google
from backend.utils.register import register_social_user
from rest_framework.exceptions import AuthenticationFailed  



class ConsultarPerfilSerializer(serializers.Serializer):
    pass


class CrearPerfilSerializer(serializers.Serializer):
    email = serializers.EmailField()
    nombre_completo = serializers.CharField()
    password = serializers.CharField()
    rol = serializers.ChoiceField(  
        choices=[(role.value, role.name) for role in RolEnum],  
    )  


class CheckPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password_attempt = serializers.CharField()


class ActualizarStripeCustomerIdSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_stripeId = serializers.CharField()

class ActivarPerfilSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ActivarPerfilByTokenSerializer(serializers.Serializer):
    token = serializers.CharField()

class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()
    def validate_auth_token(self, auth_token):
        user_data = Google.validate(auth_token)
        try:
            user_data['sub']
        except:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please login again.'
            )
        if user_data['aud'] != settings.GOOGLE_CLIENT_ID:
            raise AuthenticationFailed('oops, who are you?')
        return register_social_user(provider="google", email=user_data["email"], name=user_data["name"])

class SendVerificationMailSerializer(serializers.Serializer):
    email = serializers.EmailField()

class CheckVerifiedSerializer(serializers.Serializer):
    pass
class GetClientePedidosSerializer(serializers.Serializer):
    pass
class GetClienteDireccionesSerializer(serializers.Serializer):
    pass

class EditarPefilSerializer(serializers.Serializer):
    email                   = serializers.EmailField()
    new_nombre_completo     = serializers.CharField(allow_null=True)
    new_password            = serializers.CharField(allow_null=True)
    new_numero_telefonico   = serializers.CharField(allow_null=True)
    new_fecha_nacimiento    = serializers.CharField(allow_null=True)

class EliminarPerfilSerializer(serializers.Serializer):
    pass