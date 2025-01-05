def factura_mail_html_content(factura):
    table_string = ""
    for dp in factura.venta_asociada.pedido.descripciones_pedido.all():
        table_string+=f"""
          <tr>
            <td>{ dp.presentacion_asociada.ref }</td>
            <td>{ dp.cantidad }</td>
            <td>${ dp.presentacion_asociada.precio }</td>
          </tr>
          """
    return f"""
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Factura de KapaTortas</title>
    <style>
      body {{
        background-color: #f9f9f9;
        color: #212121;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        margin: 0;
        padding: 0;
      }}
      .container {{
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }}
      h1 {{
        color: #333;
        font-size: 24px;
        margin-bottom: 20px;
      }}
      p {{
        color: #333;
        font-size: 14px;
        margin: 10px 0;
      }}
      .invoice-table {{
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }}
      .invoice-table th, .invoice-table td {{
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }}
      .invoice-table th {{
        background-color: #ef9d49;
        color: white;
      }}
      .footer-text {{
        font-size: 12px;
        text-align: center;
        margin-top: 20px;
      }}
      a {{
        color: #ef9d49;
        text-decoration: none;
      }}
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Factura de KapaTortas</h1>
      <p><strong>Fecha de Emisión:</strong> { factura.fecha_emision_factura }</p>
      <p><strong>Domicilio Fiscal:</strong> { factura.domicilio_fiscal }</p>
      <p><strong>Teléfono:</strong> { factura.numero_telefonico_empresa }</p>
      <p><strong>RIF:</strong> { factura.rif_empresa }</p>
      <p><strong>Email:</strong> { factura.correo_electronico_empresa }</p>

      <h2>Detalles de la Venta</h2>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
            {table_string}
        </tbody>
      </table>
      <p><strong>IVA:</strong> { factura.venta_asociada.pedido.iva }</p>
      <p><strong>Total:</strong> { factura.venta_asociada.pedido.monto_total }</p>
      <p class="footer-text">
        Este mensaje fue producido por KapaTortas. © 2024. Todos los derechos reservados.
        <a href="https://kapatortas.com" target="_blank">KapaTortas</a>.
      </p>
    </div>
  </body>
</html>
"""
