from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.conf import settings
import smtplib


def send_client_mail(subject, correo, html_content, factura=None):
    try:
        # Create the email
        email = EmailMessage(
            subject=subject,
            body=html_content,
            from_email='your_email@gmail.com',
            to=[correo],
        )
        email.content_subtype = 'html'  # Specify the email is HTML

        # Attach the PDF if provided
        if factura and factura.pdf_file:
            email.attach_file(factura.pdf_file.path)

        # Send the email
        email.send()
    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {e}")
        raise
    except smtplib.SMTPException as e:
        print(f"SMTP Exception: {e}")
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise
