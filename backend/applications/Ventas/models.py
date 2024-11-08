from django.db import models
from applications.Productos.models import Productos
from applications.Clientes.models import DireccionesEnvio

# Create your models here.
class Ventas(models.Model):
    numero_de_orden         = models.IntegerField()
    fecha                   = models.DateField()
    productos_asociados     = models.ManyToManyField(Productos, related_name='ventas') # con el related_name podremos ver a cuales ventas pertenece cada producto
    monto_total             = models.DecimalField(max_digits=10,decimal_places=2)
    direccion               = models.ForeignKey(DireccionesEnvio, related_name="ventas", on_delete=models.DO_NOTHING)


    def __str__(self):
        return f"{self.numero_de_orden} : {self.monto_total}"
    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'