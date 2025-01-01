from django.http import JsonResponse
from backend.utils.get_info_dict import get_info_dict
from rest_framework.views import (
    APIView,
)
from rest_framework import status

from rest_framework.permissions import (
    AllowAny
)
from ..serializers.serializers import CrearDireccionEnvioSerializer

from backend.utils.base_serializercheck_decorator import (base_serializercheck_decorator)
from ..models import DireccionesEnvio
from backend.utils.constants import DEFAULT_CIUDAD, DEFAULT_PAIS, BASE_DIRECCIONES_SHOWABLE_FIELDS


class CrearDireccionEnvioAPI(APIView):
    serializer_class        = CrearDireccionEnvioSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def post(self, request, *args, **kwargs):
        serialized_data = kwargs['serialized_data']
        try:
            new_direccion = DireccionesEnvio.objects.create(
                pais=serialized_data["pais"].upper() if 'pais' in serialized_data.keys() and serialized_data['pais'] else DEFAULT_PAIS,
                ciudad=serialized_data["ciudad"].upper() if 'ciudad' in serialized_data.keys() and serialized_data['ciudad'] else DEFAULT_CIUDAD,
                estado=serialized_data["estado"].upper(),
                direccion = serialized_data["direccion"],
                referencia= serialized_data['referencia'],
                codigo_postal = serialized_data['codigo_postal']
                )
            return JsonResponse({"new_direccion": get_info_dict(new_direccion, BASE_DIRECCIONES_SHOWABLE_FIELDS)}, status=status.HTTP_201_CREATED)
        except:
            return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)

