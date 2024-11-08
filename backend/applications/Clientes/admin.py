from django.contrib import admin  
from .models import (
    Clientes,
    DireccionesEnvio
)

admin.site.register(Clientes) 

@admin.register(DireccionesEnvio)  
class DireccionesEnvioAdmin(admin.ModelAdmin):  
    list_display = ('id', 'pais', 'codigo_postal')  # Agrega los campos que deseas mostrar en el admin  


