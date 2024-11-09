from rest_framework import serializers

class ConsultarProductoSerializer(serializers.Serializer):
    id_producto = serializers.IntegerField()

class ObtenerListaProductosSerializer(serializers.Serializer):
    pass



