from django.db.models.manager import Manager
from backend.utils.constants import (
    BASE_DIRECCIONES_SHOWABLE_FIELDS,
    BASE_PEDIDOS_SHOWABLE_FIELDS
)

class ClientesManager(Manager):
    def crear_cliente(self, perfil):
        return self.model.objects.create(perfil=perfil)
    def get_formated_direcciones_dict(self, direcciones):
        formated_direcciones = []
        for d in direcciones:
            formated_direcciones.append(
                {k:v for k,v in d.__dict__.items() if k in BASE_DIRECCIONES_SHOWABLE_FIELDS}
            )
        return formated_direcciones;
    def get_client_info(self, cliente):
        from applications.Perfiles.models import Perfiles
        return {
            'perfil' : Perfiles.objects.get_perfil_dict(cliente.perfil),
            'direcciones' : self.get_formated_direcciones_dict(cliente.direcciones.all()),
            'direccion_preferida' : {k:v for k,v in cliente.direccion_preferida.__dict__.items() if k in BASE_DIRECCIONES_SHOWABLE_FIELDS} if cliente.direccion_preferida else None,
            'pedidos' : self.get_formated_pedidos_list(cliente)
        }
    def get_formated_pedidos_list(self, cliente):
        pedidos_list = []
        for u in cliente.pedidos.all():
            pedido_dict = {k:v for k,v in u.__dict__.items() if k in BASE_PEDIDOS_SHOWABLE_FIELDS}
            pedido_dict["descripciones"] = [{
                'titulo' : p.producto_asociado.titulo,
                'presentacion' : p.presentacion_asociada.proporcion,
                'cantidad' : p.cantidad
            } for p in u.descripciones_pedido.all()];
            pedidos_list.append(pedido_dict)
        return pedidos_list
