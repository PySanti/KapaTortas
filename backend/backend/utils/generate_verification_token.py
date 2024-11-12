from django.utils.crypto import get_random_string

def generate_verification_token():
    return get_random_string(10)