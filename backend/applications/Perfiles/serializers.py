from rest_framework import serializers
from backend.utils.constants import RolEnum


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