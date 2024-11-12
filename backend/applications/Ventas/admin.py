from django.contrib import admin
from .models import Ventas
from django.utils import timezone
from datetime import timedelta
from .models import (
    Pedidos,
    Ventas
)
from openpyxl import Workbook
from io import BytesIO  
from django.http import HttpResponse
from applications.Productos.models import Productos


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



@admin.register(Pedidos)  
class PedidosAdmin(admin.ModelAdmin):  
    list_display = ('numero_de_orden',  'monto_total', 'productos', 'metodo_entrega', 'metodo_pago', 'estado')  
    list_filter = (ProductoFilter,)  
    def productos(self, obj):  
        productos_str = []  
        for p in obj.productos_asociados.all():  
            productos_str.append(f"{p.titulo}")  
        return "-".join(productos_str)  

    productos.short_description = 'productos'

@admin.register(Ventas)  
class VentasAdmin(admin.ModelAdmin):  
    list_display = ('fecha',  'direccion', 'nota')  
    list_filter = (FechaVentasFilter,)  # Uso del filtro personalizado  
    actions = ['export_to_excel']  

    def export_to_excel(self, request, queryset):  
        # Crear un libro de trabajo y una hoja  
        wb = Workbook()  
        ws = wb.active  
        ws.title = 'Ventas'  

        # Definir los encabezados de las columnas  
        headers = ['Número de Orden', 'Fecha', 'Monto Total', 'Dirección', 'Productos']  
        ws.append(headers)  

        # Agregar los datos de cada venta al archivo  
        for venta in queryset:  
            row = [  
                venta.numero_de_orden,  
                venta.fecha,  
                venta.monto_total,  
                venta.direccion.codigo_postal,  
                ", ".join([str(producto) for producto in venta.productos_asociados.all()]),  # Asegúrate de que tienes un método __str__ en el modelo Producto  
            ]  
            ws.append(row)  

        # Usar BytesIO para guardar el archivo en memoria  
        output = BytesIO()  
        wb.save(output)  
        output.seek(0)  # Volver al inicio del archivo  

        # Crear una respuesta HTTP  
        response = HttpResponse(output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')  
        response['Content-Disposition'] = 'attachment; filename="ventas.xlsx"'  

        # Devolver el archivo Excel  
        return response  

    export_to_excel.short_description = "Exportar a Excel"  

