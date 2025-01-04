from rest_framework.views import (
    APIView,
)
from rest_framework import status
from rest_framework.permissions import (
    AllowAny
)
from django.http import JsonResponse
from backend.utils.constants import (BASE_SERIALIZER_ERROR_RESPONSE, CategoriaProductoEnum)
from backend.utils.base_serializercheck_decorator import (base_serializercheck_decorator)
from ..serializers.serializers import (ConsultarProductoSerializer, ObtenerListaProductosSerializer,
    ConsultarEspecialSerializer)
from django.db.models import Q


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
    serializer_class = ObtenerListaProductosSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        from applications.Productos.models import Productos

        try:
            # Filter products with categories "postre" or "extra" and exclude "especial"
            productos = Productos.objects.filter(
                categoria__in=["postre", "extra"]
            ).exclude(categoria="especial")

            # Convert the filtered products to JSON using a utility function
            productos_json = [Productos.objects.get_producto_json(producto) for producto in productos]

            return JsonResponse({'productos': productos_json}, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({'error': "unexpected_error", 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ConsultarProductoEspecialAPI(APIView):
    serializer_class = ConsultarEspecialSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def get(self, request, *args, **kwargs):
           from applications.Productos.models import Productos

           try:
               # Filter the product by category "ESPECIAL" (case insensitive)
               if producto := Productos.objects.filter(
                   categoria__iexact=CategoriaProductoEnum.ESPECIAL.value
               ).first():  # Use `.first()` to get the first match
                   return JsonResponse(
                       {'producto': Productos.objects.get_producto_json(producto)},
                       status=status.HTTP_200_OK,
                   )
               else:
                   return JsonResponse(
                       {'error': "no_producto_with_category_especial"},
                       status=status.HTTP_400_BAD_REQUEST,
                   )
           except Exception as e:
               return JsonResponse(
                   {'error': "unexpected_error", 'details': str(e)},
                   status=status.HTTP_400_BAD_REQUEST,
               )
