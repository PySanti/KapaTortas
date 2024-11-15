from django.db.models.manager import Manager
from backend.utils.constants import BASE_PEDIDOS_SHOWABLE_FIELDS
from backend.utils.constants import BASE_DIRECCIONES_SHOWABLE_FIELDS
from backend.utils.get_info_dict import get_info_dict

class PedidosManager(Manager):
    def get_pedido_json(self, pedido):
        from .models import DescripcionesPedido
        pedido_dict = get_info_dict(pedido, BASE_PEDIDOS_SHOWABLE_FIELDS)
        pedido_dict["direccion_entrega"] = get_info_dict(pedido.direccion_entrega, BASE_DIRECCIONES_SHOWABLE_FIELDS) if pedido.direccion_entrega else None
        pedido_dict["descripciones"] = [DescripcionesPedido.objects.get_descripcion_json(p) for p in pedido.descripciones_pedido.all()];
        return pedido_dict

class DescripcionesPedidosManager(Manager):
    def get_descripcion_json(self, descripcion):
        producto_asociado = descripcion.presentacion_asociada.producto_asociado
        return {
            'titulo' : producto_asociado.titulo,
            'id_producto_asociado' : producto_asociado.id,
            'presentacion' : descripcion.presentacion_asociada.proporcion if descripcion.presentacion_asociada else None,
            "precio_presentacion" : descripcion.presentacion_asociada.precio if descripcion.presentacion_asociada else None,
            'cantidad' : descripcion.cantidad,
            'imagenes_producto' : producto_asociado.imagenes
        }
