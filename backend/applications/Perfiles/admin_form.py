from django import forms  
from .models import Perfiles  

class PerfilesAdminForm(forms.ModelForm):  
    class Meta:  
        model = Perfiles  
        fields = '__all__'  
        exclude = ['password', 'last_login', 'groups', 'user_permissions']  
