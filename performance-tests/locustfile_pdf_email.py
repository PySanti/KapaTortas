"""
CASO 4: Impacto de Generación de PDFs y Envío de Email
Mide el impacto de operaciones bloqueantes de I/O
"""

from locust import HttpUser, task, between
import random


class PDFEmailUser(HttpUser):
    wait_time = between(3, 6)

    def on_start(self):
        """Preparar usuario"""
        self.email = f"cliente{random.randint(0, 499)}@test.com"

    @task(3)
    def crear_pedido_con_factura(self):
        """
        POST /api/pedidos/crear/
        Puede generar factura PDF y enviar email (operaciones bloqueantes)
        """
        payload = {
            "correo_cliente": self.email,
            "metodo_entrega": random.choice(["delivery", "pickup"]),
            "metodo_pago": random.choice(["stripe", "zelle", "pago_movil"]),
            "iva": 0.16,
            "precio": round(random.uniform(30.0, 150.0), 2),
            "nota": "Pedido de prueba - PDF y Email",
            "direccion_entrega_id": random.randint(1, 1000) if random.random() > 0.5 else None,
            "descripciones": [
                {
                    "cantidad": random.randint(1, 3),
                    "presentacion_asociada_id": random.randint(1, 150),
                    "sabor": random.choice(["Chocolate", "Vainilla", "Fresa", None])
                }
                for _ in range(random.randint(1, 4))
            ]
        }

        with self.client.post(
            "/api/pedidos/crear/",
            json=payload,
            catch_response=True
        ) as response:
            if response.status_code in [200, 201]:
                response.success()
            elif response.status_code == 400:
                # Puede ser error válido (stock insuficiente, etc.)
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(2)
    def descargar_factura(self):
        """
        GET /api/pedidos/facturas/<numero>/download/
        Descarga PDF (operación de I/O)
        """
        # Números de orden de prueba (rango basado en datos cargados)
        numero_orden = random.randint(10000, 12000)

        with self.client.get(
            f"/api/pedidos/facturas/{numero_orden}/download/",
            name="/api/pedidos/facturas/[numero]/download/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                # Verificar que es un PDF
                content_type = response.headers.get('Content-Type', '')
                if 'pdf' in content_type.lower() or response.content[:4] == b'%PDF':
                    response.success()
                else:
                    response.failure("Respuesta no es PDF")
            elif response.status_code == 404:
                # Válido si la factura no existe
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def crear_usuario_con_email_verificacion(self):
        """
        POST /api/perfiles/crear/
        Crea usuario y envía email de verificación
        """
        random_id = random.randint(1000, 999999)

        payload = {
            "nombre_completo": f"Usuario Test {random_id}",
            "cedula": f"V{random_id}",
            "correo": f"test{random_id}@loadtest.com",
            "contraseña": "test123456",
            "numero_telefonico": f"04241234{random_id % 10000:04d}",
            "rol": "cliente"
        }

        with self.client.post(
            "/api/perfiles/crear/",
            json=payload,
            catch_response=True
        ) as response:
            if response.status_code in [200, 201]:
                response.success()
            elif response.status_code == 400:
                # Usuario ya existe o error de validación
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def ver_todas_las_ventas(self):
        """
        GET /api/pedidos/all_ventas/
        Obtener todas las ventas (puede ser pesado)
        """
        with self.client.get(
            "/api/pedidos/all_ventas/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")


if __name__ == "__main__":
    # Ejecutar:
    # locust -f locustfile_pdf_email.py --host=http://localhost:8000 --users 50 --spawn-rate 10 --run-time 15m --headless --csv=results_pdf_email
    pass
