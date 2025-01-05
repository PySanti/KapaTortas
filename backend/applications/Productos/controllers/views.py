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
from django.db.models import Q
from ..serializers.serializers import (ConsultarProductoSerializer, ObtenerListaProductosSerializer, EditarProductoByIdSerializer, ConsultarEspecialSerializer)
from applications.Productos.models import Productos
from backend.utils.get_info_dict import get_info_dict
from backend.utils.constants import BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS

# Create your views here.
class ConsultarProductoAPI(APIView):
    serializer_class        = ConsultarProductoSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]

    def get(self, request, id_producto, *args, **kwargs):
        try:
            if producto:=Productos.objects.filter(id=id_producto):
                return JsonResponse({'producto' : Productos.objects.get_producto_json(producto[0])}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error' : "no_producto_with_id"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return JsonResponse({'error' : "unexpected_error"}, status=status.HTTP_400_BAD_REQUEST)


# Trae todos los productos (sin filtro de categoria)
class ObtenerTodosProductosAPI(APIView):
    serializer_class = ObtenerListaProductosSerializer 
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        from applications.Productos.models import Productos

        try:
            productos = Productos.objects.get_productos_list_json()
            return JsonResponse({'productos' : productos}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({'error': "unexpected_error", 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Trae todos los productos excepto los de categoria especial
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

class EditarProductoByIdAPI(APIView):
    serializer_class = EditarProductoByIdSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    @base_serializercheck_decorator
    def patch(self, request, id_producto, *args, **kwargs):
        serialized_data = kwargs["serialized_data"]
        try:
            if producto := Productos.objects.filter(id=id_producto):
                # Check for unique titulo constraint
                if serialized_data["new_titulo"]:
                    if Productos.objects.filter(titulo=serialized_data['new_titulo']).exclude(id=id_producto).exists():
                        return JsonResponse(
                            {'error': "titulo_already_exists"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    producto[0].titulo = serialized_data['new_titulo']

                if serialized_data["new_categoria"]:
                    producto[0].categoria = serialized_data['new_categoria']
                if serialized_data["new_descripcion"]:
                    producto[0].descripcion = serialized_data['new_descripcion']
                if serialized_data["new_imagenes"]:
                    producto[0].imagenes = serialized_data['new_imagenes']

                producto[0].save()
                return JsonResponse(
                    {"new_producto": get_info_dict(producto[0], BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS)},
                    status=status.HTTP_200_OK
                )
            else:
                return JsonResponse(
                    {'error': "producto_not_found"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return JsonResponse(
                {'error': "unexpected_error", 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

