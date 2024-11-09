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
from .serializers import (ConsultarProductoSerializer, ObtenerListaProductosSerializer)


# Create your views here.
class ConsultarProductoAPI(APIView):
    serializer_class        = ConsultarProductoSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def get(self, request, *args, **kwargs):
        # se debe retornar la data basica de cada producto
        # se debe retornar las reviews asociadas a cada producto
        pass

class ObtenerListaProductosAPI(APIView):
    serializer_class        = ObtenerListaProductosSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    @base_serializercheck_decorator
    def get(self, request, *args, **kwargs):
        from applications.Productos.models import Productos
        try:
            productos = Productos.objects.get_productos_list()
            return JsonResponse({'productos' : productos}, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error' : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)