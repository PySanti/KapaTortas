from django.utils import timezone  
from datetime import timedelta  

def get_expiration_date():
    return timezone.now() + timedelta(minutes=30)