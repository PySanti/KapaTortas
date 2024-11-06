from rest_framework import serializers


class ConsultarPerfilSerializer(serializers.Serializer):
    email = serializers.EmailField()