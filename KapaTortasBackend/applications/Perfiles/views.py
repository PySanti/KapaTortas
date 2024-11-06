from django.shortcuts import render
from rest_framework.views import (
    APIView,
)
from rest_framework import status
from .serializers import ConsultarPerfilSerializer
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)
from django.http import JsonResponse
from KapaTortasBackend.utils.constants import BASE_SERIALIZER_ERROR_RESPONSE
from applications.Clientes.models import Clientes
from applications.Perfiles.models import Perfiles

class ConsultarPerfilAPI(APIView):
    serializer_class        = ConsultarPerfilSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            if cliente:=Clientes.objects.filter(perfil__correo=serialized_data['email']):
                return JsonResponse({"perfil":cliente[0]}, status=status.HTTP_200_OK)
            else:
                if perfil:=Perfiles.objects.filter(correo=serialized_data['email']):
                    return JsonResponse({"perfil":perfil[0]}, status=status.HTTP_200_OK)
                else:
                    return JsonResponse({"error":"no_profile"}, status=status.HTTP_200_OK)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE

