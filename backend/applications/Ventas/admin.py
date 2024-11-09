from django.contrib import admin
from .models import Ventas

@admin.register(Ventas)  
class VentasAdmin(admin.ModelAdmin):  
    list_display = ('numero_de_orden','fecha',  'monto_total', 'direccion', 'productos')  # Agrega los campos que deseas mostrar en el admin  
    def productos(self, obj):  
        productos_str = []
        for p in obj.productos_asociados.all():
            productos_str.append(f"{p.titulo}")
        return "-".join(productos_str) # Accede al cliente relacionado y su propiedad  
    productos.short_description = 'productos'  # Título de la columna  

