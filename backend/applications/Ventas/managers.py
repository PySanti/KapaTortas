from django.db.models.manager import Manager
from backend.utils.constants import BASE_PEDIDOS_SHOWABLE_FIELDS
from backend.utils.get_info_dict import get_info_dict

class PedidosManager(Manager):
    def get_formated_pedido_data(self, pedido):
        from .models import DescripcionesPedido
        pedido_dict = get_info_dict(pedido, BASE_PEDIDOS_SHOWABLE_FIELDS)
        pedido_dict["descripciones"] = [DescripcionesPedido.objects.get_formated_descripcion_data(p) for p in self.descripciones_pedido.all()];
        return pedido_dict

class DescripcionesPedidosManager(Manager):
    def get_formated_descripcion_data(self, descripcion):
        return {
            'titulo' : descripcion.producto_asociado.titulo,
            'presentacion' : descripcion.presentacion_asociada.proporcion,
            "precio_presentacion" : descripcion.presentacion_asociada.precio,
            'cantidad' : descripcion.cantidad
        }
