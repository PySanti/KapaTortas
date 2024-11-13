from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from applications.Clientes.models import Clientes
from .managers import ProductosManager
from django.contrib.postgres.fields import ArrayField  
from backend.utils.constants import CategoriaProductoEnum

class Productos(models.Model):
    titulo                  = models.CharField(unique=True)
    categoria               = models.CharField(choices=[(role.value, role.name) for role in CategoriaProductoEnum], default=CategoriaProductoEnum.POSTRE)
    descripcion             = models.TextField(default=None, null=True)
    imagenes                = ArrayField(models.CharField(max_length=200), blank=True, default=list)  

    objects     = ProductosManager()

    def __str__(self):
        return f"{self.titulo}"
    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

class Presentaciones(models.Model):
    ref             = models.TextField(null=True, blank=True)
    proporcion      = models.CharField(null=True, blank=True)
    precio          = models.DecimalField(max_digits=6, decimal_places=2)
    stock           = models.IntegerField()
    calorias        = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    producto_asociado = models.ForeignKey(Productos, related_name="presentaciones", on_delete=models.SET_NULL, null=True)


    def __str__(self):
        return f"{self.producto_asociado.titulo if self.producto_asociado else '()'} - {self.proporcion}"
    class Meta:
        verbose_name = 'Presentación'
        verbose_name_plural = 'Presentaciones'



class Reviews(models.Model):
    calificacion = models.IntegerField(validators=[  
            MinValueValidator(1),  
            MaxValueValidator(5)  
        ]  
    )
    descripcion = models.TextField()
    # con el campo related_name, podemos acceder a traves de una instancia de cliente a sus reviews asociadas
    cliente_asociado = models.ForeignKey(Clientes, related_name="reviews", on_delete=models.CASCADE) 
    producto_asociado = models.ForeignKey(Productos, related_name="reviews", on_delete=models.CASCADE) 

    def __str__(self):
        return f"{self.calificacion} : {self.descripcion}"
    class Meta:
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'



