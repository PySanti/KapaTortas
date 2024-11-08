from django.contrib.auth.models import BaseUserManager

class ClientesManager(BaseUserManager):
    def crear_cliente(self, perfil):
        return self.model.objects.create(perfil=perfil)
    def get_formated_direcciones_dict(self, direcciones):
        formated_direcciones = []
        BASE_DIRECCIONES_SHOWABLE_FIELDS = ["direccion_1", "direccion_2", "codigo_postal", "pais", "estado"]
        for d in direcciones:
            formated_direcciones.append(
                {k:v for k,v in d.__dict__.items() if k in BASE_DIRECCIONES_SHOWABLE_FIELDS}
            )
        return formated_direcciones;
    def get_client_info(self, cliente):
        from applications.Perfiles.models import Perfiles
        return {
            'perfil' : Perfiles.get_perfil_dict(cliente.perfil),
            'direcciones' : self.get_formated_direcciones_dict(cliente.direcciones.all()),
        }
        
