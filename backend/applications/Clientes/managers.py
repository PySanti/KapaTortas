from django.db.models.manager import Manager
from backend.utils.constants import (
    BASE_DIRECCIONES_SHOWABLE_FIELDS,
    BASE_PEDIDOS_SHOWABLE_FIELDS
)

class ClientesManager(Manager):
    def crear_cliente(self, perfil):
        return self.model.objects.create(perfil=perfil)
    def get_formated_direcciones_dict(self, cliente):
        formated_direcciones = []
        for d in cliente.direcciones.all():
            formated_direcciones.append(
                {k:v for k,v in d.__dict__.items() if k in BASE_DIRECCIONES_SHOWABLE_FIELDS}
            )
        return formated_direcciones;
    def get_formated_direccion_preferida(self, cliente):
        return {k:v for k,v in cliente.direccion_preferida.__dict__.items() if k in BASE_DIRECCIONES_SHOWABLE_FIELDS} if cliente.direccion_preferida else None
    def get_client_info(self, cliente):
        from applications.Perfiles.models import Perfiles
        from applications.Ventas.models import Pedidos
        return {
            'perfil' : Perfiles.objects.get_perfil_dict(cliente.perfil),
            'direcciones' : self.get_formated_direcciones_dict(cliente),
            'direccion_preferida' : self.get_formated_direccion_preferida(cliente),
            'pedidos' : self.get_formated_pedidos_list(cliente)
        }

    def get_formated_pedidos_list(self, cliente):
        pedidos_list = []
        for u in cliente.pedidos.all():
            pedidos_list.append(u.get_info_dict())
        return pedidos_list
