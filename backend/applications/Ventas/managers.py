from django.db.models.manager import Manager
from backend.utils.constants import BASE_PEDIDOS_SHOWABLE_FIELDS, BASE_DIRECCIONES_SHOWABLE_FIELDS, BASE_VENTAS_LIST_SHOWABLE_FIELDS, BASE_FACTURAS_SHOWABLE_FIELDS
from backend.utils.get_info_dict import get_info_dict

class PedidosManager(Manager):
    def get_pedido_json(self, pedido):
        from .models import DescripcionesPedido
        pedido_dict = get_info_dict(pedido, BASE_PEDIDOS_SHOWABLE_FIELDS)
        pedido_dict["direccion_entrega"] = get_info_dict(pedido.direccion_entrega, BASE_DIRECCIONES_SHOWABLE_FIELDS) if pedido.direccion_entrega else None
        pedido_dict["descripciones"] = [DescripcionesPedido.objects.get_descripcion_json(p) for p in pedido.descripciones_pedido.all()];
        return pedido_dict

    def get_pedidos_list_json(self, sorted):
        basic_query = self.all().order_by('-id')
        if sorted:
            pass
        return [self.get_pedido_json(p) for p in basic_query]

class DescripcionesPedidosManager(Manager):
    def get_descripcion_json(self, descripcion):
        producto_asociado = descripcion.presentacion_asociada.producto_asociado
        return {
            'titulo' : producto_asociado.titulo,
            'id_producto_asociado' : producto_asociado.id,
            'categoria' : producto_asociado.categoria,
            'presentacion' : descripcion.presentacion_asociada.proporcion if descripcion.presentacion_asociada else None,
            "precio_presentacion" : descripcion.presentacion_asociada.precio if descripcion.presentacion_asociada else None,
            'cantidad' : descripcion.cantidad,
            'imagenes_producto' : producto_asociado.imagenes,
            'sabor': descripcion.sabor
        }


class VentasManager(Manager):
    def get_venta_json(self, venta):
        venta_data = get_info_dict(venta, BASE_VENTAS_LIST_SHOWABLE_FIELDS)
        venta_data["pedido_asociado"] = PedidosManager().get_pedido_json(venta.pedido)
        return venta_data

    def get_ventas_list_json(self) -> list:
        return [self.get_venta_json(v) for v in self.select_related('pedido').all()]

class FacturasManager(Manager):
    def get_factura_json(self, factura):
        factura_data = get_info_dict(factura, BASE_FACTURAS_SHOWABLE_FIELDS)
        factura_data["venta_asociada"] = VentasManager().get_venta_json(factura.venta_asociada)
        return factura_data
