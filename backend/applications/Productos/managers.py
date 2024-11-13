from backend.utils.constants import BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS, BASE_PRESENTACIONES_SHOWABLE_FIELDS
from backend.utils.get_info_dict import get_info_dict
from django.db.models.manager import Manager

class ProductosManager(Manager):
    def get_reviews_list(self, producto):
        from applications.Productos.models import Reviews
        return [Reviews.objects.get_review_data(r) for r in producto.reviews.all()]
    def get_presentaciones_list(self, producto):
        return [get_info_dict(u, BASE_PRESENTACIONES_SHOWABLE_FIELDS) for u in producto.presentaciones.all()]
    def get_producto_info(self, producto):
        product_data = get_info_dict(producto, BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS)
        product_data["reviews"] = self.get_reviews_list(producto);
        return product_data
    def get_productos_list(self):
        productos = [] 
        for p in self.model.objects.all():
            producto_dict = get_info_dict(p, BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS)
            producto_dict["presentaciones"] = self.get_presentaciones_list(p)
            productos.append(producto_dict)
        return productos

class ReviewsManager(Manager):
    def get_review_data(self, r):
        return {
                "calificacion" : r.calificacion,
                "descripcion" : r.descripcion,
                "autor_review" : r.cliente_asociado.perfil.nombre_completo,
            }