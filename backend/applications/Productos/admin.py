from django.contrib import admin  
from .models import (
    Productos,
    Resenias
)

@admin.register(Productos)  
class ProductosAdmin(admin.ModelAdmin):  
    list_display = ('titulo', 'stock')  # Agrega los campos que deseas mostrar en el admin  


@admin.register(Resenias)
class ReseniasAdmin(admin.ModelAdmin):  
    list_display = ('calificacion', 'cliente_nombre_completo')  

    def cliente_nombre_completo(self, obj):  
        return obj.cliente_asociado.perfil.nombre_completo  # Accede al cliente relacionado y su propiedad  
    cliente_nombre_completo.short_description = 'Cliente'  # Título de la columna  

