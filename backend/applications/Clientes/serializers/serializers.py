from rest_framework import serializers

class CrearDireccionEnvioSerializer(serializers.Serializer):
    correo_cliente = serializers.EmailField()
    pais = serializers.CharField(required=False)
    ciudad = serializers.CharField(required=False)
    estado = serializers.CharField()
    direccion = serializers.CharField()
    referencia = serializers.CharField()
    codigo_postal = serializers.IntegerField()


class EliminarDireccionEnvioSerializer(serializers.Serializer):
    direccion_id = serializers.IntegerField()
