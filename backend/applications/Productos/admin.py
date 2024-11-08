from django.contrib import admin  
from .models import Productos

@admin.register(Productos)  
class ProductosAdmin(admin.ModelAdmin):  
    list_display = ('titulo', 'stock')  # Agrega los campos que deseas mostrar en el admin  

