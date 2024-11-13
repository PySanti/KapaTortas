from django.db.models.manager import Manager
from backend.utils.constants import (
    BASE_DIRECCIONES_SHOWABLE_FIELDS,
    BASE_PROFILE_SHOWABLE_FIELDS
)
from backend.utils.get_info_dict import get_info_dict

class ClientesManager(Manager):
    def crear_cliente(self, perfil):
        return self.model.objects.create(perfil=perfil)
    def get_direcciones_json(self, cliente) -> list:
        return [get_info_dict(d, BASE_DIRECCIONES_SHOWABLE_FIELDS) for d in cliente.direcciones.all()]
    def get_direccion_preferida_json(self, cliente):
        return get_info_dict(cliente.direccion_preferida, BASE_DIRECCIONES_SHOWABLE_FIELDS) if cliente.direccion_preferida else None
    def get_client_json(self, cliente):
        from applications.Perfiles.models import Perfiles
        return {
            'perfil' : get_info_dict(cliente.perfil, BASE_PROFILE_SHOWABLE_FIELDS),
            'direcciones' : self.get_direcciones_json(cliente),
            'direccion_preferida' : self.get_direccion_preferida_json(cliente),
            'pedidos' : self.get_pedidos_json(cliente)
        }

    def get_pedidos_json(self, cliente) -> list:
        from applications.Ventas.models import Pedidos
        return [Pedidos.objects.get_pedido_json(p) for p in cliente.pedidos.all()]
