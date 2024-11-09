from django.contrib.auth.models import BaseUserManager

class ProductosManager(BaseUserManager):
    def get_producto_info(self, id_producto):
        pass
    def get_productos_list(self):
        pass

