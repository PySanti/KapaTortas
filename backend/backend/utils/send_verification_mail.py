from django.core.mail import send_mail
from django.conf import settings

def mail_html_content(title):
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
            #activate_button{
                background-color : #BD681E;
                border-radius : 9999px;
                padding-bottom : 10px;
                padding: 1.5rem;
                padding-bottom: 1rem;
                padding-top: 1rem;
                font-weight: 700;
                color: #FFFAEE;
                border : none;
            }
        </style>
    </head>
    <body>
        <h3 class="title">
            %s
        </h3>
        <h3 class="subject">
            <a href='http://localhost:3000/'>
                <button id="activate_button">Activar</button>
            </a>
        </h3>
    </body>
</html>""" % ( title);



def send_verification_mail(correo, username):
    """
        Función creada para enviar mails de verificación de los usuarios
    """
    return send_mail(
            subject         =   f"Correo de verificación", 
            html_message    =  mail_html_content(f"Activa tu cuenta, {username}"),
            message         =   "", 
            from_email      =   settings.EMAIL_HOST_USER, 
            recipient_list  =   [correo])