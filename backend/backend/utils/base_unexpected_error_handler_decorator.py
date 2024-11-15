from backend.utils.constants import BASE_SERIALIZER_ERROR_RESPONSE
from django.http import JsonResponse

from rest_framework import status

def base_unexpected_error_handler_decorator(api_function):
    """
        El objetivo de este decorador es estandariza el manejo de errores inesperados
    """
    def wrapper(*args, **kwargs):
        try:
            return api_function(*args, **kwargs)
        except Exception as e:
            return JsonResponse({"error" : "unexpected_error", "details" : str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return wrapper