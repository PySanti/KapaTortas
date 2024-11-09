from django.contrib import admin
from .models import Ventas
from django.utils import timezone
from datetime import timedelta
from .models import Productos


class FechaVentasFilter(admin.SimpleListFilter):  
    title = 'Filtro por fecha'  
    parameter_name = 'fecha'  

    def lookups(self, request, model_admin):  
        return (  
            ('hoy', 'Hoy'),  
            ('semana', 'Esta semana'),  
            ('mes', 'Este mes'),  
        )  

    def queryset(self, request, queryset):  
        if self.value() == 'hoy':  
            return queryset.filter(fecha=timezone.now().date())  
        if self.value() == 'semana':  
            return queryset.filter(fecha__gte=timezone.now().date() - timedelta(days=7))  
        if self.value() == 'mes':  
            return queryset.filter(fecha__gte=timezone.now().date() - timedelta(days=30))  
        return queryset  

class ProductoFilter(admin.SimpleListFilter):  
    title = 'Productos asociados'  
    parameter_name = 'producto'  

    def lookups(self, request, model_admin):  
        productos = Productos.objects.all()  
        return [(producto.id, producto.titulo) for producto in productos]  

    def queryset(self, request, queryset):  
        if self.value():  
            return queryset.filter(productos_asociados__id=self.value())  
        return queryset  



@admin.register(Ventas)  
class VentasAdmin(admin.ModelAdmin):  
    list_display = ('numero_de_orden', 'fecha', 'monto_total', 'direccion', 'productos')  
    list_filter = (FechaVentasFilter, ProductoFilter)  # Uso del filtro personalizado  

    def productos(self, obj):  
        productos_str = []  
        for p in obj.productos_asociados.all():  
            productos_str.append(f"{p.titulo}")  
        return "-".join(productos_str)  

    productos.short_description = 'productos'  # Título de la columna  
