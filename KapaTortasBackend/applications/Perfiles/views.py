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
from KapaTortasBackend.utils.constants import (BASE_SERIALIZER_ERROR_RESPONSE, BASE_PROFILE_SHOWABLE_FIELDS)
from applications.Clientes.models import Clientes
from applications.Perfiles.models import Perfiles

class ConsultarPerfilAPI(APIView):
    serializer_class        = ConsultarPerfilSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            serialized_data = serialized_data.data
            if (perfil:=Clientes.objects.filter(perfil__correo=serialized_data['email'])) or (perfil:=Perfiles.objects.filter(correo=serialized_data['email'])):
                profile_dict = perfil[0].__dict__.copy() if type(perfil[0])!=Clientes else perfil[0].perfil.__dict__.copy()
                return JsonResponse({"perfil":{k:v for k,v in profile_dict.items() if k in BASE_PROFILE_SHOWABLE_FIELDS}}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error":"no_profile"}, status=status.HTTP_200_OK)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE

