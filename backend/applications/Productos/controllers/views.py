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
from ..serializers.serializers import (ConsultarProductoSerializer, ObtenerListaProductosSerializer)


# Create your views here.
class ConsultarProductoAPI(APIView):
    serializer_class        = ConsultarProductoSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def get(self, request, id_producto, *args, **kwargs):
        from applications.Productos.models import Productos
        try:
            if producto:=Productos.objects.filter(id=id_producto):
                return JsonResponse({'producto' : Productos.objects.get_producto_json(producto[0])}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error' : "no_producto_with_id"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return JsonResponse({'error' : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)

class ObtenerListaProductosAPI(APIView):
    serializer_class        = ObtenerListaProductosSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def get(self, request, *args, **kwargs):
        from applications.Productos.models import Productos
        try:
            productos = Productos.objects.get_productos_list_json()
            return JsonResponse({'productos' : productos}, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error' : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)