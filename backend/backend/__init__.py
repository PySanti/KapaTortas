# =€ OPTIMIZACIÓN: Importar Celery app para que Django lo reconozca
from .celery import app as celery_app

__all__ = ('celery_app',)
