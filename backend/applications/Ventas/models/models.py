from django.db import models
from backend.utils.constants import (DEFAULT_DOMICILIO_FISCAL, DEFAULT_CORREO_EMPRESA, DEFAULT_NUMERO_TELEFONICO_EMPRESA, DEFAULT_RIF_EMPRESA)
from applications.Productos.models import (
    Presentaciones
)

from ..managers import FacturasManager

from applications.Clientes.models import (
    DireccionesEnvio,
    Clientes
)
from backend.utils.constants import (
    EstadoEnum,
    MetodoPagoEnum,
    MetodoEntregaEnum,
    DeliveryZoneEnum
)
from ..managers import (
    PedidosManager,
    DescripcionesPedidosManager,
    VentasManager
)
from backend.utils.get_current_time import get_current_time

class Pedidos(models.Model):
    numero_de_orden         = models.IntegerField(unique=True, blank=False, null=False)
    fecha_pedido            = models.DateTimeField(null=True, blank=True, default=get_current_time)
    fecha_entrega           = models.DateTimeField(null=True, blank=True)
    cliente_asociado        = models.ForeignKey(Clientes, on_delete=models.SET_NULL, null=True, related_name="pedidos")
    iva                     = models.FloatField(null=True, blank=True)
    monto_total             = models.FloatField(null=True, blank=True)
    nota                    = models.TextField(blank=True, null=True)
    estado                  = models.CharField(choices=[(role.value, role.name) for role in EstadoEnum], default=EstadoEnum.RECIBIDO)
    metodo_pago             = models.CharField(choices=[(role.value, role.name) for role in MetodoPagoEnum], default=MetodoPagoEnum.PAGO_MOVIL)
    metodo_entrega          = models.CharField(choices=[(role.value, role.name) for role in MetodoEntregaEnum], default=MetodoEntregaEnum.PICKUP)
    direccion_entrega       = models.ForeignKey(DireccionesEnvio, related_name="pedidos",null=True, on_delete=models.SET_NULL )
    precio_delivery         = models.IntegerField(blank=True, null=True, choices=[(delzone.value, delzone.name) for delzone in DeliveryZoneEnum], default=3)

    objects                 = PedidosManager()

    def __str__(self):
        return f"{self.cliente_asociado.perfil.nombre_completo} : {self.numero_de_orden}" if self.cliente_asociado else f"--- : {self.numero_de_orden}"
    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

class DescripcionesPedido(models.Model):
    cantidad                    = models.IntegerField()
    pedido_asociado             = models.ForeignKey(Pedidos, related_name="descripciones_pedido", on_delete=models.SET_NULL, null=True)
    presentacion_asociada       = models.ForeignKey(Presentaciones, related_name="descripciones_pedido", on_delete=models.SET_NULL, null=True)
    sabor                    = models.TextField(blank=True, null=True)

    objects = DescripcionesPedidosManager()
    def __str__(self):
        if self.presentacion_asociada:
            return f"{self.cantidad} : {self.presentacion_asociada.producto_asociado.titulo} : {self.presentacion_asociada.producto_asociado.categoria}"
        else:
            return f"{self.cantidad} : presentación desconocida"
    class Meta:
        verbose_name = 'Descripción de pedido'
        verbose_name_plural = 'Descripciones de pedidos'




class Ventas(models.Model):
    fecha                   = models.DateTimeField(default=get_current_time)
    nota                    = models.TextField(blank=True, null=True)
    pedido                  = models.OneToOneField(Pedidos, on_delete=models.SET_NULL, null=True, related_name="venta")
    # factura

    objects = VentasManager()
    def __str__(self):
        return f"{self.fecha} : {self.nota}"
    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'

class Facturas(models.Model):
    pdf_file = models.FileField(upload_to='facturas/', null=True, blank=True)
    fecha_emision_factura               = models.DateTimeField(default=get_current_time)
    venta_asociada                      = models.OneToOneField(Ventas, on_delete=models.SET_NULL, null=True, related_name="factura")
    domicilio_fiscal                    = models.CharField(blank=True, default=DEFAULT_DOMICILIO_FISCAL)
    numero_telefonico_empresa           = models.CharField(blank=True, default=DEFAULT_NUMERO_TELEFONICO_EMPRESA)
    rif_empresa                         = models.CharField(blank=True, default=DEFAULT_RIF_EMPRESA)
    correo_electronico_empresa          = models.EmailField(blank=True, default=DEFAULT_CORREO_EMPRESA)

    objects = FacturasManager()

    class Meta:
        verbose_name = 'Factura'
        verbose_name_plural = 'Facturas'

    def __str__(self):
        return f"{self.id} : {self.fecha_emision_factura}"
