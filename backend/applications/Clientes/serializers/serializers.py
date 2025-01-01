from rest_framework import serializers

class CrearDireccionEnvioSerializer(serializers.Serializer):
    pais = serializers.CharField(required=False)
    ciudad = serializers.CharField(required=False)
    estado = serializers.CharField()
    direccion = serializers.CharField()
    referencia = serializers.CharField()
    codigo_postal = serializers.IntegerField()



