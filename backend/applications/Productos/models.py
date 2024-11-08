from django.db import models
from applications.Clientes.models import Clientes
from django.contrib.postgres.fields import ArrayField  


class Productos(models.Model):
    titulo      = models.CharField(unique=True)
    descripcion = models.TextField()
    precio      = models.DecimalField(max_digits=5,decimal_places=2)
    stock       = models.IntegerField()
    imagenes    = ArrayField(models.CharField(max_length=200), blank=True, default=list)  

    def __str__(self):
        return f"{self.titulo} : {self.stock}"
    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

class Reviews(models.Model):
    calificacion = models.IntegerField()
    descripcion = models.TextField()
    # con el campo related_name, podemos acceder a traves de una instancia de cliente a sus reviews asociadas
    cliente_asociado = models.ForeignKey(Clientes, related_name="reviews", on_delete=models.CASCADE) 
    producto_asociado = models.ForeignKey(Productos, related_name="reviews", on_delete=models.CASCADE) 

    def __str__(self):
        return f"{self.calificacion} : {self.descripcion}"
    class Meta:
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'



