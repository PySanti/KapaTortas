from rest_framework.response import Response
from rest_framework import status
from enum import Enum  

class RolEnum(Enum):  
    ADMIN = 'administrador'  
    EMPLEADO = 'empleado'  
    CLIENTE = 'cliente'


BASE_SERIALIZER_ERROR_RESPONSE = Response({'error' : "serializer_error"}, status.HTTP_400_BAD_REQUEST)
BASE_PROFILE_SHOWABLE_FIELDS = ("nombre_completo", "numero_telefonico", "fecha_nacimiento", "correo", "id", "link_foto", "rol")