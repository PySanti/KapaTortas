from django.db import models

# Create your models here.

class Productos(models.Model):
    titulo      = models.CharField()
    descripcion = models.TextField()
    precio      = models.FloatField()
    stock       = models.IntegerField()

    def __str__(self):
        return f"{self.titulo} : {self.stock}"
    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'