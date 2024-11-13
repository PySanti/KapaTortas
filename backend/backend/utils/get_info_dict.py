def get_info_dict(obj, fields):
    """
        Utilidad creada para facilitar el retorno de data de los registros
    """
    return {k:v for k,v in obj.__dict__.items() if k in fields}