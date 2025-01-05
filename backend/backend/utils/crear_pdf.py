from django.template.loader import get_template
from weasyprint import HTML
from io import BytesIO
from django.core.files.base import ContentFile
import logging

logger = logging.getLogger(__name__)

def crear_pdf(factura):
    try:
        # Existing logic
        venta = factura.venta_asociada
        pedido = venta.pedido if venta else None
        descripciones_pedido = pedido.descripciones_pedido.all() if pedido else []

        cliente_asociado = pedido.cliente_asociado if pedido and pedido.cliente_asociado else None
        cliente_nombre = cliente_asociado.perfil.nombre_completo if cliente_asociado and cliente_asociado.perfil else "No Cliente Asociado"

        if not cliente_asociado:
            logger.warning(f"Pedido {pedido} has no cliente_asociado.")
        if cliente_asociado and not cliente_asociado.perfil:
            logger.warning(f"Cliente asociado {cliente_asociado} has no perfil.")

        # Render template
        template = get_template('facturas/factura_template.html')
        html_string = template.render({
            'factura': factura,
            'descripciones_pedido': descripciones_pedido,
            'cliente_nombre': cliente_nombre,
        })

        # Create PDF
        pdf_file = BytesIO()
        HTML(string=html_string).write_pdf(pdf_file)
        return ContentFile(pdf_file.getvalue())

    except Exception as e:
        logger.error(f"Error while creating PDF for factura {factura.id}: {e}")
        raise
