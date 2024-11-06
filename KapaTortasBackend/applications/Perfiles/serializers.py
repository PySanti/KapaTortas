from rest_framework import serializers
from KapaTortasBackend.utils.constants import RolEnum


class ConsultarPerfilSerializer(serializers.Serializer):
    email = serializers.EmailField()


class CrearPerfilSerializer(serializers.Serializer):
    email = serializers.EmailField()
    nombre_completo = serializers.CharField()
    password = serializers.CharField()
    rol = serializers.CharField(choices=[(role.value, role.name) for role in RolEnum], default=RolEnum.CLIENTE)
    numero_telefonico = serializers.CharField()
    fecha_nacimiento = serializers.DateField()

