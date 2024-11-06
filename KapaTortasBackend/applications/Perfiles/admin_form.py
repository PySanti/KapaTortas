from django import forms  
from .models import Perfiles  

class PerfilesAdminForm(forms.ModelForm):  
    class Meta:  
        model = Perfiles  
        fields = '__all__'  # Incluye todos los campos, o puedes listar explícitamente los que quieras mostrar  
        exclude = ['password', 'last_login', 'groups', 'user_permissions']  # Excluye el campo 'contrasena'  
