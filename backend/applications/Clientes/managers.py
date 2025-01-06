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
        direcciones = []
        for d in cliente.direcciones.all():
            direcciones.append({
                **get_info_dict(d, BASE_DIRECCIONES_SHOWABLE_FIELDS),
                'is_favorite':(d.id == cliente.direccion_preferida.id) if cliente.direccion_preferida else False
            })
        return direcciones
    def get_direccion_preferida_json(self, cliente):
        return get_info_dict(cliente.direccion_preferida, BASE_DIRECCIONES_SHOWABLE_FIELDS) if cliente.direccion_preferida else None
    def get_client_json(self, cliente):
        from applications.Perfiles.models import Perfiles
        return {
            'perfil' : get_info_dict(cliente.perfil, BASE_PROFILE_SHOWABLE_FIELDS),
            'direcciones' : self.get_direcciones_json(cliente),
            'pedidos' : self.get_pedidos_json(cliente)
        }

    def get_pedidos_json(self, cliente) -> list:
        from applications.Ventas.models import Pedidos
        from django.db.models import Case, When, IntegerField
        from applications.Ventas.models import EstadoEnum

        pedidos = cliente.pedidos.all().order_by(
            Case(
                When(estado=EstadoEnum.EN_PROCESO.value, then=0),
                When(estado=EstadoEnum.RECIBIDO.value, then=1),
                When(estado=EstadoEnum.FINALIZADO.value, then=2),
                When(estado=EstadoEnum.CANCELADO.value, then=3),
                output_field=IntegerField(),
            )
        )
        return [Pedidos.objects.get_pedido_json(p) for p in pedidos]
