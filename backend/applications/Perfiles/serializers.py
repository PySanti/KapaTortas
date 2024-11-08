from rest_framework import serializers
from backend.utils.constants import RolEnum


class ConsultarPerfilSerializer(serializers.Serializer):
    email = serializers.EmailField()


class CrearPerfilSerializer(serializers.Serializer):
    email = serializers.EmailField()
    nombre_completo = serializers.CharField()
    password = serializers.CharField()
    rol = serializers.ChoiceField(  
        choices=[(role.value, role.name) for role in RolEnum],  
    )  


