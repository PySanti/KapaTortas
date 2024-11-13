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
from .serializers import (CrearPedidoSerializer)



# Create your views here.
class CrearPedidoAPI(APIView):
    serializer_class        = CrearPedidoSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def get(self, request, id_producto, *args, **kwargs):
        pass
