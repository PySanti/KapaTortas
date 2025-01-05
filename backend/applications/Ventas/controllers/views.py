from django.shortcuts import render

from ..models import Facturas
from rest_framework.views import (
    APIView,
)
from rest_framework import status
from rest_framework.permissions import (
    AllowAny
)
from django.http import JsonResponse
from backend.utils.base_serializercheck_decorator import (base_serializercheck_decorator)
from ..serializers.serializers import (CrearPedidoSerializer, ObtenerListaVentasSerializer, ObtenerListaPedidosSerializer, ConsultarFacturaByIdSerializer, EditarEstadoPedidoSerializer)
from backend.utils.base_serializercheck_decorator import base_serializercheck_decorator
from ..models import Pedidos
from random import randint
from applications.Clientes.models import Clientes
from ..models import DescripcionesPedido
from applications.Clientes.models import DireccionesEnvio
from ..models import Facturas
from backend.utils.constants import EstadoEnum
from backend.utils.send_client_mail import send_client_mail
from backend.utils.factura_mail_html_content import factura_mail_html_content
from backend.utils.crear_pdf import crear_pdf


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
            if cliente:=Clientes.objects.filter(perfil__correo=serialized_data["correo_cliente"]):
                new_pedido = Pedidos.objects.create(
                    numero_de_orden=randint(10000, 99999),
                    cliente_asociado=cliente[0],
                    metodo_entrega=serialized_data["metodo_entrega"],
                    metodo_pago=serialized_data["metodo_pago"],
                    # Lo hice yo Daniel
                    iva = serialized_data["iva"],
                    nota = serialized_data["nota"],
                    ##
                    estado = "recibido",
                    direccion_entrega=DireccionesEnvio.objects.get(id=serialized_data['direccion_entrega_id'])
                )
                # Lo hice yo Daniel
                monto_total = serialized_data["precio"];
                if serialized_data['metodo_entrega'] == "pickup":
                    precio_delivery = 0;
                else:
                    precio_delivery = 3

                for d in serialized_data["descripciones"]:
                    new_descripcion = DescripcionesPedido.objects.create(
                        cantidad=d["cantidad"],
                        presentacion_asociada=Presentaciones.objects.get(id=d["id_presentacion"]),
                        pedido_asociado=new_pedido,
                        sabor = d["sabor"]
                    )

                new_pedido.monto_total = monto_total
                new_pedido.precio_delivery = precio_delivery
                new_pedido.save()

                return JsonResponse({'pedido' : Pedidos.objects.get_pedido_json(new_pedido)}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error' : "no_cliente_found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({"error" : "unexpedted_error", "detail" : str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ObtenerListaVentasAPI(APIView):
    serializer_class        = ObtenerListaVentasSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def get(self, request, *args, **kwargs):
        from applications.Ventas.models import Ventas
        try:
            ventas = Ventas.objects.get_ventas_list_json()
            return JsonResponse({'ventas' : ventas}, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error' : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)


class ObtenerListaPedidosAPI(APIView):
    serializer_class        = ObtenerListaPedidosSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            pedidos = Pedidos.objects.get_pedidos_list_json()
            return JsonResponse({'pedidos' : pedidos}, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error' : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)

class ConsultarFacturaByOrderAPI(APIView):
    serializer_class        = ConsultarFacturaByIdSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def get(self, request, numero_de_orden, *args, **kwargs):
            try:
                # Filtrar la factura basada en el número de orden del pedido
                factura = Facturas.objects.filter(venta_asociada__pedido__numero_de_orden=numero_de_orden).first()

                if factura:
                    # Suponiendo que get_factura_json es un método que devuelve un dict con los detalles de la factura
                    return JsonResponse({'factura': Facturas.objects.get_factura_json(factura)}, status=status.HTTP_200_OK)
                else:
                    return JsonResponse({'error': 'factura_not_found'}, status=status.HTTP_404_NOT_FOUND)

            except Exception as e:
                return JsonResponse({'error': 'unexpected_error', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class EditarEstadoPedidoAPI(APIView):
    serializer_class = EditarEstadoPedidoSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    @base_serializercheck_decorator
    def patch(self, request, *args, **kwargs):
        from applications.Ventas.models import Ventas

        serialized_data = kwargs['serialized_data']
        try:
            # Find the pedido by numero_de_orden
            if pedido := Pedidos.objects.filter(numero_de_orden=serialized_data['numero_orden']).first():
                if (serialized_data['estado'] == EstadoEnum.FINALIZADO.value) and (Ventas.objects.filter(pedido__id=pedido.id)):
                    return JsonResponse({'error': "This pedido has a venta"}, status=status.HTTP_404_NOT_FOUND)
                else:
                    pedido.estado = serialized_data['estado']
                    pedido.save()
                    if pedido.estado == EstadoEnum.FINALIZADO.value:
                        new_venta = Ventas.objects.create(pedido=pedido)
                        new_factura = Facturas.objects.create(venta_asociada=new_venta)
                        pdf_content = crear_pdf(new_factura)
                        new_factura.pdf_file.save(
                            f"factura_{new_factura.venta_asociada.pedido.numero_de_orden}.pdf",
                            pdf_content
                        )
                        send_client_mail(
                            subject=f"Factura {new_factura.fecha_emision_factura}",
                                correo=pedido.cliente_asociado.perfil.correo,
                            html_content=factura_mail_html_content(factura=new_factura),
                            factura=new_factura
                        )
                    return JsonResponse({'modificado': True}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error': 'pedido_not_found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({'error': 'unexpected_error', 'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
