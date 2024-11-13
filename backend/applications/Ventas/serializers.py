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
    cliente_id = serializers.IntegerField()
    direccion_entrega_id = serializers.IntegerField()
    metodo_pago = serializers.ChoiceField(  
        choices=[(role.value, role.name) for role in MetodoPagoEnum], 
    )  
    metodo_entrega = serializers.ChoiceField(  
        choices=[(role.value, role.name) for role in MetodoEntregaEnum]  
    )
    descripciones = serializers.ListField(child=DescripcionesPedidosSerializer())