"""
Tareas asíncronas de Celery para el módulo de Ventas
Permite ejecutar generación de PDFs y envío de emails en segundo plano
"""

from celery import shared_task
from backend.utils.crear_pdf import crear_pdf
from backend.utils.send_client_mail import send_client_mail
from backend.utils.factura_mail_html_content import factura_mail_html_content
import logging
import time

logger = logging.getLogger('performance')


@shared_task(bind=True, max_retries=3)
def generar_y_enviar_factura_async(self, numero_orden, venta_data, cliente_email, cliente_nombre):
    """
    Tarea asíncrona para generar PDF de factura y enviarlo por email

    Args:
        numero_orden: Número de orden del pedido
        venta_data: Diccionario con datos de la venta
        cliente_email: Email del cliente
        cliente_nombre: Nombre del cliente

    Returns:
        dict: Resultado de la operación
    """
    start_time = time.time()

    try:
        logger.info(f"[ASYNC] Iniciando generación de factura para orden #{numero_orden}")

        # 1. Generar PDF
        pdf_start = time.time()
        pdf_file = crear_pdf(numero_orden, venta_data)
        pdf_elapsed = time.time() - pdf_start
        logger.info(f"[ASYNC] PDF generado en {pdf_elapsed:.3f}s para orden #{numero_orden}")

        # 2. Generar contenido HTML del email
        html_content = factura_mail_html_content(
            cliente_nombre=cliente_nombre,
            numero_orden=numero_orden,
            fecha=venta_data.get('fecha', 'N/A'),
            monto_total=venta_data.get('monto_total', 0)
        )

        # 3. Enviar email con PDF adjunto
        email_start = time.time()
        send_client_mail(
            to_email=cliente_email,
            subject=f"Factura #{numero_orden} - KapaTortas",
            html_content=html_content,
            pdf_file=pdf_file,
            pdf_filename=f"factura_{numero_orden}.pdf"
        )
        email_elapsed = time.time() - email_start
        logger.info(f"[ASYNC] Email enviado en {email_elapsed:.3f}s a {cliente_email}")

        total_elapsed = time.time() - start_time
        logger.info(
            f"[ASYNC] Factura #{numero_orden} completada en {total_elapsed:.3f}s "
            f"(PDF: {pdf_elapsed:.3f}s, Email: {email_elapsed:.3f}s)"
        )

        return {
            'success': True,
            'numero_orden': numero_orden,
            'tiempo_total': total_elapsed,
            'tiempo_pdf': pdf_elapsed,
            'tiempo_email': email_elapsed
        }

    except Exception as e:
        logger.error(f"[ASYNC] Error generando factura #{numero_orden}: {str(e)}")

        # Reintentar la tarea (máximo 3 veces)
        try:
            raise self.retry(exc=e, countdown=60)  # Reintentar en 60 segundos
        except self.MaxRetriesExceededError:
            logger.error(f"[ASYNC] Máximo de reintentos alcanzado para factura #{numero_orden}")
            return {
                'success': False,
                'numero_orden': numero_orden,
                'error': str(e)
            }


@shared_task
def enviar_email_verificacion_async(cliente_email, cliente_nombre, verification_token):
    """
    Tarea asíncrona para enviar email de verificación de cuenta

    Args:
        cliente_email: Email del cliente
        cliente_nombre: Nombre del cliente
        verification_token: Token de verificación

    Returns:
        dict: Resultado de la operación
    """
    start_time = time.time()

    try:
        logger.info(f"[ASYNC] Enviando email de verificación a {cliente_email}")

        html_content = f"""
        <html>
            <body>
                <h2>¡Bienvenido a KapaTortas, {cliente_nombre}!</h2>
                <p>Gracias por registrarte. Por favor verifica tu cuenta usando el siguiente código:</p>
                <h1 style="color: #ff6b6b; letter-spacing: 5px;">{verification_token}</h1>
                <p>Este código expirará en 24 horas.</p>
                <p>Si no solicitaste esta cuenta, ignora este mensaje.</p>
                <br>
                <p>Saludos,<br>El equipo de KapaTortas</p>
            </body>
        </html>
        """

        send_client_mail(
            to_email=cliente_email,
            subject="Verifica tu cuenta - KapaTortas",
            html_content=html_content
        )

        elapsed = time.time() - start_time
        logger.info(f"[ASYNC] Email de verificación enviado en {elapsed:.3f}s a {cliente_email}")

        return {
            'success': True,
            'email': cliente_email,
            'tiempo': elapsed
        }

    except Exception as e:
        logger.error(f"[ASYNC] Error enviando email de verificación a {cliente_email}: {str(e)}")
        return {
            'success': False,
            'email': cliente_email,
            'error': str(e)
        }


@shared_task
def enviar_email_transferencia_async(receptor_email, receptor_nombre, emisor_nombre, producto_nombre, cantidad):
    """
    Tarea asíncrona para enviar notificación de transferencia de acciones

    Args:
        receptor_email: Email del receptor
        receptor_nombre: Nombre del receptor
        emisor_nombre: Nombre del emisor
        producto_nombre: Nombre del producto transferido
        cantidad: Cantidad transferida

    Returns:
        dict: Resultado de la operación
    """
    try:
        logger.info(f"[ASYNC] Enviando notificación de transferencia a {receptor_email}")

        html_content = f"""
        <html>
            <body>
                <h2>¡Has recibido un producto, {receptor_nombre}!</h2>
                <p><strong>{emisor_nombre}</strong> te ha transferido:</p>
                <ul>
                    <li><strong>Producto:</strong> {producto_nombre}</li>
                    <li><strong>Cantidad:</strong> {cantidad}</li>
                </ul>
                <p>Revisa tu cuenta para ver los detalles.</p>
                <br>
                <p>Saludos,<br>El equipo de KapaTortas</p>
            </body>
        </html>
        """

        send_client_mail(
            to_email=receptor_email,
            subject="Has recibido un producto - KapaTortas",
            html_content=html_content
        )

        logger.info(f"[ASYNC] Email de transferencia enviado a {receptor_email}")

        return {'success': True, 'email': receptor_email}

    except Exception as e:
        logger.error(f"[ASYNC] Error enviando email de transferencia a {receptor_email}: {str(e)}")
        return {'success': False, 'email': receptor_email, 'error': str(e)}
