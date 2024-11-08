from django.db import models
from applications.Clientes.models import Clientes

class Productos(models.Model):
    titulo      = models.CharField(unique=True)
    descripcion = models.TextField()
    precio      = models.DecimalField(max_digits=5,decimal_places=2)
    stock       = models.IntegerField()

    def __str__(self):
        return f"{self.titulo} : {self.stock}"
    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

class Resenias(models.Model):
    calificacion = models.IntegerField()
    descripcion = models.TextField()
    # con el campo related_name, podemos acceder a traves de una instancia de cliente a sus resenias asociadas
    cliente_asociado = models.ForeignKey(Clientes, related_name="resenias", on_delete=models.CASCADE) 
    producto_asociado = models.ForeignKey(Productos, related_name="resenias", on_delete=models.CASCADE) 

    def __str__(self):
        return f"{self.calificacion} : {self.descripcion}"
    class Meta:
        verbose_name = 'Resenia'
        verbose_name_plural = 'Resenias'



