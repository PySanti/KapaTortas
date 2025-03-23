from rest_framework import serializers

class CrearDireccionEnvioSerializer(serializers.Serializer):
    correo_cliente = serializers.EmailField()
    pais = serializers.CharField(required=False)
    ciudad = serializers.CharField(required=False)
    estado = serializers.CharField()
    direccion = serializers.CharField()
    referencia = serializers.CharField()
    codigo_postal = serializers.IntegerField()
    latitud = serializers.FloatField(required=False)
    longitud = serializers.FloatField(required=False)


class EliminarDireccionEnvioSerializer(serializers.Serializer):
    direccion_id = serializers.IntegerField()



class EditarDireccionEnvioSerializer(serializers.Serializer):
    direccion_id        = serializers.IntegerField()
    new_pais            = serializers.CharField(allow_null=True)
    new_ciudad          = serializers.CharField(allow_null=True)
    new_estado          = serializers.CharField(allow_null=True)
    new_direccion       = serializers.CharField(allow_null=True)
    new_referencia      = serializers.CharField(allow_null=True)
    new_codigo_postal   = serializers.IntegerField(allow_null=True)
    new_latitud         = serializers.FloatField(allow_null=True)
    new_longitud        = serializers.FloatField(allow_null=True)





