from rest_framework.response import Response
from rest_framework import status
from enum import Enum  

class RolEnum(Enum):  
    ADMIN = 'administrador'  
    EMPLEADO = 'empleado'  
    CLIENTE = 'cliente'


class EstadoEnum(Enum):
    PENDIENTE = "pendiente"
    CANCELADO = "cancelado"
    FINALIZADO = "finalizado"

class MetodoPagoEnum(Enum):
    ZELLE = "zelle"
    PAGO_MOVIL = "pago_movil"
    STRIPE = "stripe"

class MetodoEntrega(Enum):
    PICKUP = "pickup"
    DELIVERY = "delivery"



class CategoriaProducto(Enum):
    POSTRE = "postre"
    EXTRA = "extra"





BASE_SERIALIZER_ERROR_RESPONSE = Response({'error' : "serializer_error"}, status.HTTP_400_BAD_REQUEST)
BASE_PROFILE_SHOWABLE_FIELDS = ("nombre_completo", "numero_telefonico", "fecha_nacimiento", "correo", "id", "link_foto", "rol", "contraseña",  "stripeCustomerId")
BASE_DIRECCIONES_SHOWABLE_FIELDS = ["direccion", "referencia", "codigo_postal", "pais", "estado", "ciudad"]
BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS = ["id", "titulo", "stock", "imagenes", "descripcion", "precio", "calorias"]
BASE_REVIEWS_SHOWABLE_FIELDS = ["calificacion", "descripcion", ]
BASE_PEDIDOS_SHOWABLE_FIELDS = ["numero_de_orden", "monto_total", "estado", "metodo_pago", "metodo_entrega"]