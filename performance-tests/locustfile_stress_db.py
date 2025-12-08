"""
CASO 2: Prueba de Estrés en Conexiones a PostgreSQL
Determina el punto de quiebre del pool de conexiones
"""

from locust import HttpUser, task, constant
import random


class StressDatabaseUser(HttpUser):
    wait_time = constant(1)  # Requests agresivos cada 1 segundo

    def on_start(self):
        """Preparar cliente de prueba"""
        self.email = f"cliente{random.randint(0, 499)}@test.com"

    @task(5)
    def query_pesada_pedidos(self):
        """Endpoint que genera múltiples queries - Todos los pedidos ordenados"""
        with self.client.get(
            "/api/pedidos/all_pedidos/sorted",
            name="/api/pedidos/all_pedidos/sorted",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(5)
    def consulta_perfil_con_joins(self):
        """Perfil con JOINs a pedidos y direcciones"""
        with self.client.get(
            f"/api/perfiles/{self.email}/",
            name="/api/perfiles/[email]/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 404:
                response.success()  # Cliente puede no existir
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(3)
    def consulta_pedidos_cliente(self):
        """Buscar todos los pedidos de un cliente"""
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
    def todos_los_productos(self):
        """Obtener todos los productos (con presentaciones y reviews)"""
        with self.client.get(
            "/api/productos/todos/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(2)
    def todas_las_ventas(self):
        """Obtener todas las ventas"""
        with self.client.get(
            "/api/pedidos/all_ventas/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def crear_pedido_concurrente(self):
        """Crear pedidos concurrentemente (operación de escritura)"""
        payload = {
            "correo_cliente": self.email,
            "metodo_entrega": "pickup",
            "metodo_pago": "stripe",
            "iva": 0.16,
            "precio": 50.0,
            "nota": "Stress test",
            "direccion_entrega_id": None,
            "descripciones": [
                {
                    "cantidad": 1,
                    "presentacion_asociada_id": random.randint(1, 150)
                }
            ]
        }

        with self.client.post(
            "/api/pedidos/crear/",
            json=payload,
            catch_response=True
        ) as response:
            if response.status_code in [200, 201, 400]:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")


if __name__ == "__main__":
    # Ejecutar con fases incrementales:
    # Fase 1: locust -f locustfile_stress_db.py --host=http://localhost:8000 --users 50 --spawn-rate 10 --run-time 5m --headless --csv=results_fase1
    # Fase 2: --users 100
    # Fase 3: --users 200
    # Fase 4: --users 400
    # Fase 5: --users 600
    pass
