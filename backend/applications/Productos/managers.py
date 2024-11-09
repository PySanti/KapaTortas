from django.contrib.auth.models import BaseUserManager
from backend.utils.constants import BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS

class ProductosManager(BaseUserManager):
    def get_producto_info(self, id_producto):
        pass
    def get_productos_list(self):
        productos = [] 
        for p in self.model.objects.all():
            productos.append({k:v for k,v in p.__dict__.items() if k in BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS})
        return productos

