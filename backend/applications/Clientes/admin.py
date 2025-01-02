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
    list_display = ('id', 'nombre_completo', "correo_cliente")  # Agrega los campos que deseas mostrar en el admin  
    def nombre_completo(self, obj):
        return obj.perfil.nombre_completo
    def correo_cliente(self, obj):
        return obj.perfil.correo



admin.site.site_header = "Panel de administración KapaTortas"
admin.site.site_title = "Kapa"

