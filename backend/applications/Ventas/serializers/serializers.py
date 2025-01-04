from rest_framework import serializers
from backend.utils.constants import (
    MetodoPagoEnum,
    MetodoEntregaEnum
)

class DescripcionesPedidosSerializer(serializers.Serializer):
    id_producto = serializers.IntegerField()
    id_presentacion = serializers.IntegerField()
    cantidad = serializers.IntegerField()

class CrearPedidoSerializer(serializers.Serializer):
    correo_cliente = serializers.EmailField()
    direccion_entrega_id = serializers.IntegerField()
    metodo_pago = serializers.ChoiceField(
        choices=[(role.value, role.name) for role in MetodoPagoEnum],
    )
    precio = serializers.IntegerField()
    metodo_entrega = serializers.ChoiceField(
        choices=[(role.value, role.name) for role in MetodoEntregaEnum]
    )
    descripciones = serializers.ListField(child=DescripcionesPedidosSerializer())

class ObtenerListaVentasSerializer(serializers.Serializer):
    pass

class ObtenerListaPedidosSerializer(serializers.Serializer):
    pass

class ConsultarFacturaByIdSerializer(serializers.Serializer):
    pass

class EditarEstadoPedidoSerializer(serializers.Serializer):
    numero_orden = serializers.IntegerField(required=True)
    cancelado = serializers.BooleanField(required=True)
