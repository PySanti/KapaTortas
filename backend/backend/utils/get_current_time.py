from django.utils import timezone
from datetime import timedelta


def get_current_time():
    return timezone.now() - timedelta(hours=4)