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
from applications.Clientes.models import Clientes
from .models import DescripcionesPedido



class ClienteFilter(admin.SimpleListFilter):  
    title = 'Clientes asociados'  
    parameter_name = 'clientes_asociados'  

    def lookups(self, request, model_admin):  
        clientes = Clientes.objects.all()  
        return [(c.id, c.perfil.nombre_completo) for c in clientes]  

    def queryset(self, request, queryset):  
        if self.value():  
            return queryset.filter(cliente_asociado__id=self.value())  
        return queryset  

@admin.register(DescripcionesPedido)  
class DescripcionesPedidoAdmin(admin.ModelAdmin):
    list_display = ("cantidad", "producto_asociado", "presentacion_asociada","pedido_asociado")
    def producto_asociado(self, obj):
        return obj.producto_asociado.titulo
    def pedido_asociado(self, obj):
        return obj.pedido_asociado.numero_de_orden
    def presentacion_asociada(self, obj):
        return obj.presentacion_asociada.proporcion
    producto_asociado.short_description = "Producto Asociado"
    presentacion_asociada.short_description = "Presentación Asociado"
    pedido_asociado.short_description = "Pedido Asociado"



@admin.register(Pedidos)  
class PedidosAdmin(admin.ModelAdmin):  
    list_display = ('numero_de_orden',  'monto_total',  'metodo_entrega', 'metodo_pago', 'estado', 'cliente_asociado', 'descripciones_pedido', 'direccion_entrega')  
    list_filter = (ClienteFilter,)  
    def cliente_asociado(self, obj):
        return obj.cliente_asociado.perfil.nombre_completo

    def descripciones_pedido(self, obj):  
        descripciones = []  
        for p in obj.descripciones_pedido.all():  
            descripciones.append(f"{p.producto_asociado.titulo} ({p.presentacion_asociada.proporcion if p.presentacion_asociada else None}) ({p.cantidad})")  
        return " + ".join(descripciones)  

    descripciones_pedido.short_description = 'descripcion'


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
@admin.register(Ventas)  
class VentasAdmin(admin.ModelAdmin):  
    list_display = ('fecha',   'nota')  
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

