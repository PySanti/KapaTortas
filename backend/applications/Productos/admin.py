from django.contrib import admin  
from .models import (
    Productos,
    Reviews
)

@admin.register(Productos)  
class ProductosAdmin(admin.ModelAdmin):  
    list_display = ('titulo', 'stock')  # Agrega los campos que deseas mostrar en el admin  


@admin.register(Reviews)
class ReviewsAdmin(admin.ModelAdmin):  
    list_display = ('calificacion', 'cliente_nombre_completo', 'titulo_producto')  

    def cliente_nombre_completo(self, obj):  
        return obj.cliente_asociado.perfil.nombre_completo  # Accede al cliente relacionado y su propiedad  
    def titulo_producto(self, obj):
        return obj.producto_asociado.titulo
    cliente_nombre_completo.short_description = 'Cliente'  # Título de la columna  
    titulo_producto.short_description = 'Titulo del Producto'  # Título de la columna  

