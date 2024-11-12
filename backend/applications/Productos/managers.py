from backend.utils.constants import BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS

from django.db.models.manager import Manager

class ProductosManager(Manager):
    def get_reviews_list(self, producto):
        reviews_list = []
        for r in producto.reviews.all():
            reviews_list.append({
                "calificacion" : r.calificacion,
                "descripcion" : r.descripcion,
                "autor_review" : r.cliente_asociado.perfil.nombre_completo,
            })
        return reviews_list
    def get_producto_info(self, producto):
        product_data = {k:v for k,v in producto.__dict__.items() if k in BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS}
        product_data["reviews"] = self.get_reviews_list(producto);
        return product_data
    def get_productos_list(self):
        productos = [] 
        for p in self.model.objects.all():
            productos.append({k:v for k,v in p.__dict__.items() if k in BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS})
        return productos

