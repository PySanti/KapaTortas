from backend.utils.constants import BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS, BASE_PRESENTACIONES_SHOWABLE_FIELDS
from backend.utils.get_info_dict import get_info_dict
from django.db.models.manager import Manager

class ProductosManager(Manager):
    def get_reviews_json(self, producto) -> list:
        from applications.Productos.models import Reviews
        # 🚀 OPTIMIZACIÓN: Las reviews ya están prefetched en get_productos_list_json
        return [Reviews.objects.get_review_json(r) for r in producto.reviews.all()]

    def get_presentaciones_json(self, producto) -> list:
        # 🚀 OPTIMIZACIÓN: Las presentaciones ya están prefetched en get_productos_list_json
        return [get_info_dict(u, BASE_PRESENTACIONES_SHOWABLE_FIELDS) for u in producto.presentaciones.all()]

    def get_producto_json(self, producto):
        product_data = get_info_dict(producto, BASE_PRODUCTOS_LIST_SHOWABLE_FIELDS)
        product_data["reviews"] = self.get_reviews_json(producto);
        product_data["presentaciones"] = self.get_presentaciones_json(producto)
        return product_data

    def get_productos_list_json(self) -> list:
        # 🚀 OPTIMIZACIÓN: Usar prefetch_related para evitar N+1 queries
        # En lugar de 1 query + N queries de reviews + M queries de presentaciones
        # Ahora solo: 1 query productos + 1 query reviews + 1 query presentaciones
        productos = self.model.objects.prefetch_related(
            'reviews__cliente__perfil',  # Prefetch reviews y su cliente asociado
            'presentaciones'  # Prefetch presentaciones
        ).all()
        return [self.get_producto_json(p) for p in productos] 

class ReviewsManager(Manager):
    def get_review_json(self, r):
        return {
                "calificacion" : r.calificacion,
                "descripcion" : r.descripcion,
                "autor_review" : r.cliente_asociado.perfil.nombre_completo,
            }