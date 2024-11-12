from django.contrib import admin
from .models import Perfiles
from .admin_form import PerfilesAdminForm

@admin.register(Perfiles)
class PerfilesAdmin(admin.ModelAdmin):
    form = PerfilesAdminForm  # Usar el formulario personalizado
    list_display = ('nombre_completo', 'correo', 'rol', 'numero_telefonico', 'fecha_nacimiento')  # Agrega los campos que deseas mostrar en el admin
    list_filter = ("rol",)

    def save_model(self, request, obj, form, change):  
        super().save_model(request, obj, form, change)  # Llama al método de super  
        if not change:  # Es un nuevo objeto  
            from applications.Clientes.models import Clientes
            if obj.rol == "cliente":
                Clientes.objects.crear_cliente(perfil=obj)
            obj.is_active = True
            obj.save()