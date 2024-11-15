from django.db import models
from applications.Productos.models import (
    Productos,
    Presentaciones
)

from applications.Clientes.models import (
    DireccionesEnvio,
    Clientes
)
from backend.utils.constants import (
    EstadoEnum,
    MetodoPagoEnum,
    MetodoEntregaEnum
)
from .managers import (
    PedidosManager,
    DescripcionesPedidosManager
)
from backend.utils.get_current_time import get_current_time

class Pedidos(models.Model):
    numero_de_orden         = models.IntegerField(unique=True, blank=False, null=False)
    fecha_pedido            = models.DateTimeField(null=True, blank=True, default=get_current_time)
    fecha_entrega           = models.DateTimeField(null=True, blank=True)
    cliente_asociado        = models.ForeignKey(Clientes, on_delete=models.SET_NULL, null=True, related_name="pedidos")
    monto_total             = models.FloatField(null=True, blank=True)
    estado                  = models.CharField(choices=[(role.value, role.name) for role in EstadoEnum], default=EstadoEnum.PENDIENTE)
    metodo_pago             = models.CharField(choices=[(role.value, role.name) for role in MetodoPagoEnum], default=MetodoPagoEnum.PAGO_MOVIL)
    metodo_entrega          = models.CharField(choices=[(role.value, role.name) for role in MetodoEntregaEnum], default=MetodoEntregaEnum.PICKUP)
    direccion_entrega       = models.ForeignKey(DireccionesEnvio, related_name="pedidos",null=True, on_delete=models.SET_NULL )

    objects                 = PedidosManager()

    def __str__(self):
        return f"{self.cliente_asociado.perfil.nombre_completo} : {self.numero_de_orden}"
    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

class DescripcionesPedido(models.Model):
    cantidad                    = models.IntegerField()
    pedido_asociado             = models.ForeignKey(Pedidos, related_name="descripciones_pedido", on_delete=models.SET_NULL, null=True)
    presentacion_asociada       = models.ForeignKey(Presentaciones, related_name="descripciones_pedido", on_delete=models.SET_NULL, null=True)

    objects = DescripcionesPedidosManager()
    def __str__(self):
        return f"{self.cantidad} : {self.presentacion_asociada.producto_asociado.titulo}"
    class Meta:
        verbose_name = 'Descripción de pedido'
        verbose_name_plural = 'Descripciones de pedidos'




class Ventas(models.Model):
    fecha                   = models.DateTimeField()
    nota                    = models.TextField(blank=True, null=True)
    pedido                  = models.OneToOneField(Pedidos, on_delete=models.SET_NULL, null=True, related_name="venta")
    # factura


    def __str__(self):
        return f"{self.fecha} : {self.nota}"
    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'