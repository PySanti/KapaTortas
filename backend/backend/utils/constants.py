from rest_framework.response import Response
from rest_framework import status
from enum import Enum

class DeliveryZoneEnum(Enum):
    CENTRO_HISTORICO = 1
    LA_CANDELARIA = 1
    SABANA_GRANDE = 2
    EL_ROSAL = 2
    CHACAO = 2
    ALTAMIRA = 3
    LAS_MERCEDES = 3
    LA_URBINA = 3
    PETARE = 4
    EL_HATILLO = 4
    LOS_TEQUES = 4

class RolEnum(Enum):
    ADMIN = 'administrador'
    EMPLEADO = 'empleado'
    CLIENTE = 'cliente'


class EstadoEnum(Enum):
    RECIBIDO = "recibido"
    EN_PROCESO = "en_proceso"
    CANCELADO = "cancelado"
    FINALIZADO = "finalizado"

class MetodoPagoEnum(Enum):
    ZELLE = "zelle"
    PAGO_MOVIL = "pago_movil"
    STRIPE = "stripe"

class MetodoEntregaEnum(Enum):
    PICKUP = "pickup"
    DELIVERY = "delivery"



class CategoriaProductoEnum(Enum):
    ESPECIAL = "especial"
    POSTRE = "postre"
    EXTRA = "extra"





BASE_SERIALIZER_ERROR_RESPONSE = Response({'error' : "serializer_error"}, status.HTTP_400_BAD_REQUEST)
BASE_PROFILE_SHOWABLE_FIELDS = ("nombre_completo", "is_active","numero_telefonico", "fecha_nacimiento", "correo", "id", "link_foto", "rol", "contraseña",  "stripeCustomerId")
BASE_DIRECCIONES_SHOWABLE_FIELDS = ["id", "direccion", "referencia", "codigo_postal", "pais", "estado", "ciudad"]
BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS = ["id", "titulo", "imagenes", "descripcion", "categoria"]
BASE_PRESENTACIONES_SHOWABLE_FIELDS = ["id", "ref", "proporcion", "precio", "stock", "calorias"]
BASE_REVIEWS_SHOWABLE_FIELDS = ["calificacion", "descripcion", ]
BASE_PEDIDOS_SHOWABLE_FIELDS = ["numero_de_orden","fecha_pedido","fecha_entrega", "monto_total", "estado", "nota", "metodo_pago", "metodo_entrega"]
BASE_VENTAS_LIST_SHOWABLE_FIELDS = ["id", "fecha", "nota"]
BASE_FACTURAS_SHOWABLE_FIELDS = ["id", "fecha_emision_factura", "domicilio_fiscal", "numero_telefonico_empresa", "rif_empresa", "correo_electronico_empresa"]


DEFAULT_PAIS = "VENEZUELA"
DEFAULT_CIUDAD = "CARACAS"

DEFAULT_DOMICILIO_FISCAL = "Santa Rosa de Lima"
DEFAULT_NUMERO_TELEFONICO_EMPRESA = "+58 4242955147"
DEFAULT_CORREO_EMPRESA = "kapatortas@gmail.com"
DEFAULT_RIF_EMPRESA = "J-310651032"

DEFAULT_ACTIVATION_MAIL_SUBJECT = "Correo de verificación"
