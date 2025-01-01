from rest_framework import serializers

class CrearDireccionEnvioSerializer(serializers.Serializer):
    pais = serializers.CharField()
    ciudad = serializers.CharField()
    estado = serializers.CharField()
    direccion = serializers.CharField()
    referencia = serializers.ChoiceField()
    codigo_postal = serializers.IntegerField()



