from django.template.loader import get_template
from weasyprint import HTML
from io import BytesIO
from django.core.files.base import ContentFile

def crear_pdf(factura):
    # Use get_template to load the template
    template = get_template('facturas/factura_template.html')
    html_string = template.render({'factura': factura})  # Render the template with context

    pdf_file = BytesIO()
    HTML(string=html_string).write_pdf(pdf_file)  # Create the PDF from HTML

    return ContentFile(pdf_file.getvalue())  # Return the content as a file
