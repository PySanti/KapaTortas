from django.core.mail import send_mail
from django.conf import settings

def send_client_mail(subject, html_content, correo):
    """
        Función creada para enviar mails a los usuarios
    """
    return send_mail(
            subject         =  subject, 
            html_message    =  html_content,
            message         =   "", 
            from_email      =   settings.EMAIL_HOST_USER, 
            recipient_list  =   [correo])