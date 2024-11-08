from KapaTortasBackend.utils.constants import BASE_SERIALIZER_ERROR_RESPONSE
def base_serializercheck_decorator(api_function):
    """
        La idea de este decorador es estandarizar la revision, serializacion y 
        manejo de errores de serializacion en API'S y no repetir codigo
    """
    def wrapper(*args, **kwargs):
        self_obj = args[0]
        request_obj = args[1]
        serialized_data = self_obj.serializer_class(data=request_obj.data)
        if serialized_data.is_valid():
            return api_function(*args, **kwargs, serialized_data=serialized_data)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE
    return wrapper