from rest_framework.views import (
    APIView,
)
from rest_framework import status
from .serializers import (
ConsultarPerfilSerializer,
CrearPerfilSerializer,
CheckPasswordSerializer,
ActualizarStripeCustomerIdSerializer,
ActivarPerfilSerializer,
ActivarPerfilByTokenSerializer,
GoogleSocialAuthSerializer,
SendVerificationMailSerializer,
CheckVerifiedSerializer,
GetClientePedidosSerializer,
GetClienteDireccionesSerializer

)
from rest_framework.permissions import (
    AllowAny
)
from django.http import JsonResponse
from backend.utils.constants import (BASE_PROFILE_SHOWABLE_FIELDS)
from backend.utils.base_serializercheck_decorator import (base_serializercheck_decorator)
from django.contrib.auth.hashers import check_password  
from applications.Perfiles.models import Perfiles
from backend.utils.send_verification_mail import send_verification_mail
from rest_framework.response import Response
from applications.Clientes.models import VerificationToken
from applications.Clientes.models import Clientes
from backend.utils.get_info_dict import get_info_dict



class ConsultarPerfilAPI(APIView):
    serializer_class        = ConsultarPerfilSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def get(self, request, email_perfil, *args, **kwargs):
        from applications.Clientes.models import Clientes
        if (perfil:=Clientes.objects.filter(perfil__correo=email_perfil)) or (perfil:=Perfiles.objects.filter(correo=email_perfil)):
            # si es un cliente, el diccionario de su perfil es perfil[0].perfil.__dict__
            # si es un perfil, el diccionario de su perfil es perfil[0].__dict__
            if (type(perfil[0]) == Clientes):
                client_info = Clientes.objects.get_client_json(perfil[0])
                return JsonResponse({
                    "perfil": client_info["perfil"], 
                    "direcciones" : client_info["direcciones"], 
                    "pedidos" : client_info["pedidos"]}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"perfil": get_info_dict(perfil[0], BASE_PROFILE_SHOWABLE_FIELDS)}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"error":"no_profile"}, status=status.HTTP_400_BAD_REQUEST)



class CrearPerfilAPI(APIView):
    serializer_class        = CrearPerfilSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def post(self, request, *args, **kwargs):
        serialized_data = kwargs['serialized_data']
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
                if (serialized_data["rol"] == "cliente"):
                    new_profile.verification_token = VerificationToken.objects.create()
                    new_profile.save()
                    send_verification_mail(new_profile.perfil.correo, new_profile.verification_token.token)
                new_profile = new_profile.perfil if serialized_data['rol'] == "cliente" else new_profile
                return JsonResponse({"new_profile": get_info_dict(new_profile, BASE_PROFILE_SHOWABLE_FIELDS)}, status=status.HTTP_201_CREATED)
            except:
                return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)




class CheckPasswordAPI(APIView):
    serializer_class        = CheckPasswordSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def post(self, request, *args, **kwargs):
        serialized_data = kwargs['serialized_data']
        try:
            if profile := Perfiles.objects.filter(correo=serialized_data["email"]):
                return JsonResponse({"valid_password" : profile[0].check_password(serialized_data["password_attempt"])}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error" : "no_profile_with_email"}, status=status.HTTP_400_BAD_REQUEST)

        except:
            return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)

class ActualizarStripeCustomerIdAPI(APIView):
    serializer_class        = ActualizarStripeCustomerIdSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def patch(self, request, *args, **kwargs):
        serialized_data = kwargs['serialized_data']
        try:
            if profile := Perfiles.objects.filter(correo=serialized_data["email"]):
                profile[0].stripeCustomerId = serialized_data["new_stripeId"]
                profile[0].save()
                return JsonResponse({"profile" : get_info_dict(profile[0], BASE_PROFILE_SHOWABLE_FIELDS)}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error" : "no_profile_with_email"}, status=status.HTTP_400_BAD_REQUEST)

        except:
            return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)

class ActivarPerfilAPI(APIView):
    serializer_class        = ActivarPerfilSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def patch(self, request, *args, **kwargs):
        serialized_data = kwargs['serialized_data']
        try:
            if profile := Perfiles.objects.filter(correo=serialized_data["email"]):
                profile[0].is_active = True
                profile[0].save()
                return JsonResponse({"activated" : True}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error" : "no_profile_with_email"}, status=status.HTTP_400_BAD_REQUEST)

        except:
            return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)



class ActivarPerfilByTokenAPI(APIView):
    serializer_class        = ActivarPerfilByTokenSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def patch(self, request, *args, **kwargs):
        serialized_data = kwargs['serialized_data']
        try:
            if cliente := Clientes.objects.filter(verification_token__token=serialized_data["token"]):
                cliente = cliente[0]
                if not cliente.verification_token.is_expired():
                    cliente.perfil.is_active = True
                    cliente.perfil.save()
                    cliente.save()
                    return JsonResponse({"activated" : True}, status=status.HTTP_200_OK)
                else:
                    return JsonResponse({"error" : "token_expired"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return JsonResponse({"error" : "no_cliente_with_token"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)


class GoogleSocialAuthView(APIView):
    serializer_class        = GoogleSocialAuthSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = ((serializer.validated_data)['auth_token'])
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"error" : "authentication_failed"}, status=status.HTTP_400_BAD_REQUEST)



class SendVerificationMailAPI(APIView):
    serializer_class        = SendVerificationMailSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def post(self, request, *args, **kwargs):
        serialized_data = kwargs['serialized_data']
        if cliente:=Clientes.objects.filter(perfil__correo=serialized_data["email"]):
            try:
                cliente = cliente[0]
                cliente.verification_token = VerificationToken.objects.create()
                cliente.save()
                send_verification_mail(cliente.perfil.correo,  cliente.verification_token.token)
                return JsonResponse({"email_sent" : True}, status=status.HTTP_200_OK)
            except:
                return JsonResponse({"error" : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({"error" : "no_cliente_with_email"}, status=status.HTTP_400_BAD_REQUEST)


class CheckVerifiedAPI(APIView):
    serializer_class = CheckVerifiedSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, email_perfil, *args, **kwargs):
        try:
            # Check if the profile exists by email in the Perfiles model
            if profile := Perfiles.objects.filter(correo=email_perfil):
                return JsonResponse({"is_active": profile[0].is_active}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "no_profile_with_email"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle any unexpected errors
            return JsonResponse({"error": "unexpected_error", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GetClientePedidosAPI(APIView):
    serializer_class = GetClientePedidosSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, email_perfil, *args, **kwargs):
        try:
            if cliente := Clientes.objects.filter(perfil__correo=email_perfil):
                return JsonResponse({"pedidos": Clientes.objects.get_pedidos_json(cliente[0])}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "no_profile_with_email"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({"error": "unexpected_error", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)




class GetClienteDireccionesAPI(APIView):
    serializer_class = GetClienteDireccionesSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, email_perfil, *args, **kwargs):
        try:
            if cliente := Clientes.objects.filter(perfil__correo=email_perfil):
                return JsonResponse({"direcciones": Clientes.objects.get_direcciones_json(cliente[0])}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "no_profile_with_email"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({"error": "unexpected_error", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)


