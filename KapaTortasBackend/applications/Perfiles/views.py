from django.shortcuts import render
from rest_framework.views import (
    APIView,
)
from rest_framework import status
from .serializers import (
ConsultarPerfilSerializer,
CrearPerfilSerializer
)
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)
from django.http import JsonResponse
from KapaTortasBackend.utils.constants import (BASE_SERIALIZER_ERROR_RESPONSE, BASE_PROFILE_SHOWABLE_FIELDS, RolEnum)
from applications.Perfiles.models import Perfiles

class ConsultarPerfilAPI(APIView):
    serializer_class        = ConsultarPerfilSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            from applications.Clientes.models import Clientes
            serialized_data = serialized_data.data
            if (perfil:=Clientes.objects.filter(perfil__correo=serialized_data['email'])) or (perfil:=Perfiles.objects.filter(correo=serialized_data['email'])):
                profile_dict = perfil[0].__dict__.copy() if type(perfil[0])!=Clientes else perfil[0].perfil.__dict__.copy()
                return JsonResponse({"perfil": Perfiles.objects.get_perfil_dict(profile_dict)}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error":"no_profile"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE


class CrearPerfilAPI(APIView):
    serializer_class        = CrearPerfilSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            serialized_data = serialized_data.data
            if error_msg:=Perfiles.objects.user_exists(serialized_data['nombre_completo'], serialized_data['email']):
                return JsonResponse({"error":error_msg}, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    new_profile = Perfiles.objects.crear_perfil(
                        nombre_completo = serialized_data['nombre_completo'],
                        password = serialized_data['password'],
                        correo = serialized_data['email'],
                        rol = serialized_data['rol'],
                    )
                    new_profile = new_profile.perfil if serialized_data['rol'] == "cliente" else new_profile
                    return JsonResponse({"new_profile": Perfiles.objects.get_perfil_dict(new_profile)}, status=status.HTTP_200_OK)
                except:
                    return JsonResponse({"error":"unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return BASE_SERIALIZER_ERROR_RESPONSE

