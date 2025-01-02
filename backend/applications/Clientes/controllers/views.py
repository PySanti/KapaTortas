from django.http import JsonResponse
from backend.utils.get_info_dict import get_info_dict
from rest_framework.views import (
    APIView,
)
from rest_framework import status

from rest_framework.permissions import (
    AllowAny
)
from ..serializers.serializers import CrearDireccionEnvioSerializer, EliminarDireccionEnvioSerializer,EditarDireccionEnvioSerializer

from backend.utils.base_serializercheck_decorator import (base_serializercheck_decorator)
from ..models import DireccionesEnvio
from backend.utils.constants import DEFAULT_CIUDAD, DEFAULT_PAIS, BASE_DIRECCIONES_SHOWABLE_FIELDS
from ..models import DireccionesEnvio


class CrearDireccionEnvioAPI(APIView):
    serializer_class        = CrearDireccionEnvioSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def post(self, request, *args, **kwargs):
        from applications.Clientes.models import Clientes
        serialized_data = kwargs['serialized_data']
        try:
            if cliente:=Clientes.objects.filter(perfil__correo=serialized_data['correo_cliente']):
                cliente = cliente[0]
                new_direccion = DireccionesEnvio.objects.create(
                    pais=serialized_data["pais"].upper() if 'pais' in serialized_data.keys() and serialized_data['pais'] else DEFAULT_PAIS,
                    ciudad=serialized_data["ciudad"].upper() if 'ciudad' in serialized_data.keys() and serialized_data['ciudad'] else DEFAULT_CIUDAD,
                    estado=serialized_data["estado"].upper(),
                    direccion = serialized_data["direccion"],
                    referencia= serialized_data['referencia'],
                    codigo_postal = serialized_data['codigo_postal']
                    )
                cliente.direcciones.add(new_direccion)
                cliente.save()
                return JsonResponse({"new_direccion": get_info_dict(new_direccion, BASE_DIRECCIONES_SHOWABLE_FIELDS)}, status=status.HTTP_201_CREATED)
            else:
                return JsonResponse({"error": "cliente_with_email_not_found"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)

class EliminarDireccionEnvioAPI(APIView):
    serializer_class        = EliminarDireccionEnvioSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def delete(self, request, *args, **kwargs):
        serialized_data = kwargs['serialized_data']
        try:
            if direccion := DireccionesEnvio.objects.filter(id=serialized_data['direccion_id']):
                direccion[0].delete()
                return JsonResponse({"deleted": True}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "direccion_not_found"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)


class EditarDireccionEnvioAPI(APIView):
    serializer_class        = EditarDireccionEnvioSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def patch(self, request, *args, **kwargs):
        from applications.Clientes.models import Clientes
        serialized_data = kwargs['serialized_data']
        try:
            if direccion := DireccionesEnvio.objects.filter(id=serialized_data['direccion_id']):
                direccion=direccion[0]
                if serialized_data["new_pais"]:
                    direccion.pais = serialized_data["new_pais"]
                if serialized_data["new_ciudad"]:
                    direccion.ciudad = serialized_data["new_ciudad"]
                if serialized_data["new_estado"]:
                    direccion.estado = serialized_data["new_estado"]
                if serialized_data["new_direccion"]:
                    direccion.direccion = serialized_data["new_direccion"]
                if serialized_data["new_referencia"]:
                    direccion.referencia = serialized_data["new_referencia"]
                if serialized_data["new_codigo_postal"]:
                    direccion.codigo_postal = serialized_data["new_codigo_postal"]
                direccion.save()
                return JsonResponse({"editado": True}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "direccion_not_found"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)



