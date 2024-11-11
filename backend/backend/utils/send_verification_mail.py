from django.core.mail import send_mail
from django.conf import settings

def mail_html_content(title, content):
    return  """
<html>
    <head>
        <style>
            *{
                text-align : center;
                font-family : sans-serif;
                color : #000;
            }
            body{
                display : flex;
                justify-content : center;
                flex-direction : column;
            }
            .subject{
                font-weight : 400;
            }
        </style>
    </head>
    <body>
        <h3 class="title">
            %s
        </h3>
        <h3 class="subject">
            %s
        </h3>
    </body>
</html>""" % ( title, content);



def send_verification_mail(correo, username):
    """
        Función creada para enviar mails de verificación de los usuarios
    """
    return send_mail(
            subject         =   f"Correo de verificación", 
            html_message    =  mail_html_content(f"Verifica tu correo, {username}", "¡ prueba !"),
            message         =   "", 
            from_email      =   settings.EMAIL_HOST_USER, 
            recipient_list  =   [correo])