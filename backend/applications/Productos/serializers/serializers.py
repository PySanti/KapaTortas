from rest_framework import serializers
from backend.utils.constants import CategoriaProductoEnum

class ConsultarEspecialSerializer(serializers.Serializer):
    pass

class ConsultarProductoSerializer(serializers.Serializer):
    pass

class ObtenerListaProductosSerializer(serializers.Serializer):
    pass

class EditarProductoByIdSerializer(serializers.Serializer):
    new_titulo = serializers.CharField(allow_null=True)
    new_categoria = serializers.ChoiceField(
        choices=[(categoria.value, categoria.name) for categoria in CategoriaProductoEnum],
        allow_null=True
    )
    new_descripcion = serializers.CharField(allow_null=True)
    new_imagenes = serializers.ListField(
        child=serializers.CharField(max_length=200),
        allow_null=True
    )
