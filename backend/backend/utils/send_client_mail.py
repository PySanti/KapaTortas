from django.core.mail import send_mail
from django.conf import settings
import smtplib

def send_client_mail(subject, correo, html_content):
    try:
        send_mail(
            subject=subject,
            message='',
            from_email='your_email@gmail.com',
            recipient_list=[correo],
            html_message=html_content,
        )
    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {e}")
        raise
    except smtplib.SMTPException as e:
        print(f"SMTP Exception: {e}")
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise
