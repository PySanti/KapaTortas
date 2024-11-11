from django.contrib import admin
from .models import Perfiles
from .admin_form import PerfilesAdminForm

@admin.register(Perfiles)
class PerfilesAdmin(admin.ModelAdmin):
    form = PerfilesAdminForm  # Usar el formulario personalizado
    list_display = ('nombre_completo', 'correo', 'rol', 'numero_telefonico', 'fecha_nacimiento')  # Agrega los campos que deseas mostrar en el admin
    list_filter = ("rol",)
