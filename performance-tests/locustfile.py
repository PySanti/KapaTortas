"""
CASO 1: Prueba de Carga Normal en API REST
Simula 100 usuarios concurrentes realizando operaciones típicas de clientes
"""

from locust import HttpUser, task, between
import random
import json


class ClienteKapaTortas(HttpUser):
    wait_time = between(2, 5)  # Think time entre requests (2-5 segundos)

    def on_start(self):
        """Login al iniciar - obtener datos del usuario"""
        # Usar un cliente de prueba
        self.email = f"cliente{random.randint(0, 499)}@test.com"

        response = self.client.get(
            f"/api/perfiles/{self.email}/",
            name="/api/perfiles/[email]/"
        )

        if response.status_code == 200:
            self.user_data = response.json()
        else:
            print(f"⚠️ Error obteniendo perfil: {response.status_code}")
            self.user_data = None

    @task(10)  # Mayor peso: operación más común
    def ver_productos(self):
        """GET /api/productos/all_productos/ - Ver catálogo"""
        with self.client.get(
            "/api/productos/all_productos/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    productos = response.json()
                    if len(productos) > 0:
                        response.success()
                    else:
                        response.failure("No hay productos en el catálogo")
                except json.JSONDecodeError:
                    response.failure("Respuesta JSON inválida")
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(8)
    def ver_producto_detalle(self):
        """GET /api/productos/<id>/ - Ver detalle de producto"""
        producto_id = random.randint(1, 50)

        with self.client.get(
            f"/api/productos/{producto_id}/",
            name="/api/productos/[id]/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    producto = response.json()
                    # Verificar que tiene imágenes
                    if 'imagenes' in producto:
                        response.success()
                    else:
                        response.failure("Producto sin imágenes")
                except json.JSONDecodeError:
                    response.failure("Respuesta JSON inválida")
            elif response.status_code == 404:
                response.success()  # Es válido si el producto no existe
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(5)
    def ver_perfil(self):
        """GET /api/perfiles/<email>/ - Ver perfil propio"""
        if not self.user_data:
            return

        with self.client.get(
            f"/api/perfiles/{self.email}/",
            name="/api/perfiles/[email]/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(3)
    def ver_pedidos(self):
        """GET /api/perfiles/buscar_pedidos_cliente/<email>/ - Historial de pedidos"""
        if not self.user_data:
            return

        with self.client.get(
            f"/api/perfiles/buscar_pedidos_cliente/{self.email}/",
            name="/api/perfiles/buscar_pedidos_cliente/[email]/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(3)
    def ver_direcciones(self):
        """GET /api/perfiles/buscar_direcciones_cliente/<email>/ - Ver direcciones"""
        if not self.user_data:
            return

        with self.client.get(
            f"/api/perfiles/buscar_direcciones_cliente/{self.email}/",
            name="/api/perfiles/buscar_direcciones_cliente/[email]/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(2)
    def crear_pedido(self):
        """POST /api/pedidos/crear/ - Crear nuevo pedido"""
        payload = {
            "correo_cliente": self.email,
            "metodo_entrega": random.choice(["pickup", "delivery"]),
            "metodo_pago": random.choice(["zelle", "pago_movil", "stripe"]),
            "iva": 0.16,
            "precio": round(random.uniform(30.0, 150.0), 2),
            "nota": "Pedido de prueba de carga",
            "direccion_entrega_id": random.randint(1, 1000) if random.random() > 0.5 else None,
            "descripciones": [
                {
                    "cantidad": random.randint(1, 3),
                    "presentacion_asociada_id": random.randint(1, 150),
                    "sabor": "Chocolate" if random.random() > 0.7 else None
                }
                for _ in range(random.randint(1, 3))
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

    @task(1)
    def ver_pedidos_admin(self):
        """GET /api/pedidos/all_pedidos/sorted - Ver todos los pedidos (Admin)"""
        with self.client.get(
            "/api/pedidos/all_pedidos/sorted",
            name="/api/pedidos/all_pedidos/[sort]",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")


if __name__ == "__main__":
    # Para ejecutar: locust -f locustfile.py --host=http://localhost:8000
    pass
