from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import (
    APIView,
)
from rest_framework import status

from rest_framework.permissions import (
    AllowAny
)
from ..serializers import CrearDireccionEnvioSerializer

from backend.utils.base_serializercheck_decorator import (base_serializercheck_decorator)


class CrearDireccionEnvioAPI(APIView):
    serializer_class        = CrearDireccionEnvioSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def post(self, request, *args, **kwargs):
        serialized_data = kwargs['serialized_data']
        try:
            return JsonResponse({"new_direccion": 0}, status=status.HTTP_201_CREATED)
        except:
            return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)

