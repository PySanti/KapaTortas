from django.shortcuts import render
from rest_framework.views import (
    APIView,
)
from rest_framework import status
from rest_framework.permissions import (
    AllowAny
)
from django.http import JsonResponse
from backend.utils.constants import (BASE_SERIALIZER_ERROR_RESPONSE)
from backend.utils.base_serializercheck_decorator import (base_serializercheck_decorator)
from ..serializers.serializers import (CrearPedidoSerializer)
from backend.utils.base_serializercheck_decorator import base_serializercheck_decorator
from ..models import Pedidos
from random import randint
from applications.Clientes.models import Clientes
from ..models import DescripcionesPedido
from applications.Clientes.models import DireccionesEnvio



# Create your views here.
class CrearPedidoAPI(APIView):
    serializer_class        = CrearPedidoSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def post(self, request, *args, **kwargs):
        from applications.Productos.models import (Productos,Presentaciones)
        try:
            serialized_data = kwargs['serialized_data']
            if cliente:=Clientes.objects.filter(id=serialized_data["cliente_id"]):
                new_pedido = Pedidos.objects.create(
                    numero_de_orden=randint(10000, 99999),
                    cliente_asociado=cliente[0],
                    metodo_entrega=serialized_data["metodo_entrega"],
                    metodo_pago=serialized_data["metodo_pago"],
                    estado = "pendiente",
                    direccion_entrega=DireccionesEnvio.objects.get(id=serialized_data['direccion_entrega_id'])
                )
                monto_total = 0
                for d in serialized_data["descripciones"]:
                    new_descripcion = DescripcionesPedido.objects.create(
                        cantidad=d["cantidad"],
                        producto_asociado=Productos.objects.get(id=d["id_producto"]),
                        presentacion_asociada=Presentaciones.objects.get(id=d["id_presentacion"]),
                        pedido_asociado=new_pedido
                    )
                    monto_total += new_descripcion.presentacion_asociada.precio*new_descripcion.cantidad
                new_pedido.monto_total = monto_total
                new_pedido.save()
                return JsonResponse({'pedido' : Pedidos.objects.get_pedido_json(new_pedido)}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error' : "no_cliente_found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({"error" : "unexpedted_error", "detail" : str(e)}, status=status.HTTP_400_BAD_REQUEST)
