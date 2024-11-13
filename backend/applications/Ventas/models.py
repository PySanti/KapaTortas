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
from backend.utils.constants import BASE_PEDIDOS_SHOWABLE_FIELDS

class Pedidos(models.Model):
    numero_de_orden         = models.IntegerField(unique=True, blank=False, null=False)
    cliente_asociado        = models.ForeignKey(Clientes, on_delete=models.SET_NULL, null=True, related_name="pedidos")
    monto_total             = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    estado                  = models.CharField(choices=[(role.value, role.name) for role in EstadoEnum], default=EstadoEnum.PENDIENTE)
    metodo_pago             = models.CharField(choices=[(role.value, role.name) for role in MetodoPagoEnum], default=MetodoPagoEnum.PAGO_MOVIL)
    metodo_entrega          = models.CharField(choices=[(role.value, role.name) for role in MetodoEntregaEnum], default=MetodoEntregaEnum.PICKUP)

    objects                 = PedidosManager()

    def get_info_dict(self):
        pedido_dict = {k:v for k,v in self.__dict__.items() if k in BASE_PEDIDOS_SHOWABLE_FIELDS}
        pedido_dict["descripciones"] = [{
            'titulo' : p.producto_asociado.titulo,
            'presentacion' : p.presentacion_asociada.proporcion,
            "precio_presentacion" : p.presentacion_asociada.precio,
            'cantidad' : p.cantidad
        } for p in self.descripciones_pedido.all()];
        return pedido_dict
    def __str__(self):
        return f"{self.cliente_asociado.perfil.nombre_completo} : {self.numero_de_orden}"
    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

class DescripcionesPedido(models.Model):
    cantidad                    = models.IntegerField()
    producto_asociado           = models.ForeignKey(Productos, related_name="descripciones_pedido", on_delete=models.DO_NOTHING)
    pedido_asociado             = models.ForeignKey(Pedidos, related_name="descripciones_pedido", on_delete=models.DO_NOTHING)
    presentacion_asociada       = models.ForeignKey(Presentaciones, related_name="descripciones_pedido", on_delete=models.DO_NOTHING, null=True)

    objects = DescripcionesPedidosManager()
    def __str__(self):
        return f"{self.cantidad} : {self.producto_asociado.titulo}"
    class Meta:
        verbose_name = 'Descripción de pedido'
        verbose_name_plural = 'Descripciones de pedidos'




class Ventas(models.Model):
    fecha                   = models.DateField()
    direccion               = models.ForeignKey(DireccionesEnvio, related_name="ventas", on_delete=models.DO_NOTHING)
    nota                    = models.TextField(blank=True, null=True)
    pedido                  = models.OneToOneField(Pedidos, on_delete=models.SET_NULL, null=True)
    # factura


    def __str__(self):
        return f"{self.fecha} : {self.nota}"
    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'