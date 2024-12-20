from django.contrib import admin  
from .models import (
    Clientes,
    DireccionesEnvio,
    VerificationToken
)

admin.site.register(VerificationToken) 

@admin.register(DireccionesEnvio)  
class DireccionesEnvioAdmin(admin.ModelAdmin):  
    list_display = ('id', 'pais', 'codigo_postal')  # Agrega los campos que deseas mostrar en el admin  

@admin.register(Clientes)  
class ClientesAdmin(admin.ModelAdmin):  
    list_display = ('id', 'nombre_completo')  # Agrega los campos que deseas mostrar en el admin  
    def nombre_completo(self, obj):
        return obj.perfil.nombre_completo




