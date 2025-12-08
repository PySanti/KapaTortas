"""
Configuración de Celery para tareas asíncronas
Permite ejecutar tareas en segundo plano (PDFs, emails, etc.)
"""

import os
from celery import Celery

# Configurar Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Crear app de Celery
app = Celery('kapatortas')

# Cargar configuración desde Django settings con el namespace CELERY
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-descubrir tareas en las aplicaciones Django
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    """Tarea de prueba"""
    print(f'Request: {self.request!r}')
