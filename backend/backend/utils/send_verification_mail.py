from django.core.mail import send_mail
from django.conf import settings

def mail_html_content(activation_token):
    return """
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KapaTortas Correo de Verificación</title>
    <style>
      body {
        background-color: #fff;
        color: #212121;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
          'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }
      .container {
        padding: 20px;
        margin: 0 auto;
        background-color: #eee;
      }
      .image-section {
        display: flex;
        padding: 20px 0;
        align-items: center;
        justify-content: center;
      }
      .upper-section {
        padding: 25px 35px;
      }
      h1 {
        color: #333;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      p {
        color: #333;
        font-size: 14px;
        margin: 24px 0;
      }
      .code-text {
        font-weight: bold;
        font-size: 36px;
        margin: 10px 0;
        text-align: center;
      }
      .validity-text {
        margin: 0;
      }
      .footer-text {
        font-size: 12px;
        padding: 0 20px;
      }
      a {
        color: #ef9d49;
        text-decoration: none;
        cursor : pointer;
      }
      .button-section {
        margin-top: 20px;
        text-align: center;
      }
      .button {
        background-color: #ef9d49;
        color: #000;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        border : none;
        cursor : pointer;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="image-section">
        <img
          src="https://res.cloudinary.com/dzgjxwvnw/image/upload/v1731093299/kapatortas/rll5qvj7dtgmcbwy6mn2.png"
          width="100"
          height="60"
          alt="Kapatortas Logo"
        />
      </div>
      <div class="upper-section">
        <h1>Verifica tu dirección de correo electrónico</h1>
        <p>
          Para acceder a tu cuenta, verifica tu dirección de correo electrónico 
        </p>
        <div class="button-section">
          <a href='http://localhost:3000/verify-email?token=%s'>
            <button class="button">
                Verificar Correo
            </button>
          </a>
        </div>
      </div>
      <hr />
      <p class="footer-text">
        Este mensaje fue producido por KapaTortas. © 2024. Todos los derechos reservados.
        <a href="https://kapatortas.com" target="_blank">KapaTortas</a>.
      </p>
    </div>
  </body>
</html>
""" % ( activation_token);


def send_verification_mail(correo, activation_token):
    """
        Función creada para enviar mails de verificación de los usuarios
    """
    return send_mail(
            subject         =   f"Correo de verificación", 
            html_message    =  mail_html_content( activation_token),
            message         =   "", 
            from_email      =   settings.EMAIL_HOST_USER, 
            recipient_list  =   [correo])