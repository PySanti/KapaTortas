"""
CASO 5: Prueba de Condiciones de Carrera en Pedidos Concurrentes
Identifica race conditions cuando múltiples usuarios compran las últimas unidades
"""

from locust import HttpUser, task, between
import random


# CONFIGURACIÓN: ID de presentación con stock bajo para probar
TARGET_PRESENTACION_ID = 1  # Configurar con una presentación de stock bajo


class RaceConditionUser(HttpUser):
    wait_time = between(0.1, 0.5)  # Requests muy rápidos para forzar race condition

    def on_start(self):
        """Preparar usuario"""
        self.email = f"cliente{random.randint(0, 499)}@test.com"
        self.pedidos_exitosos = 0
        self.pedidos_fallidos = 0

    @task(10)
    def comprar_producto_limitado(self):
        """
        POST /api/pedidos/crear/
        Intentar comprar presentación con stock bajo (race condition)
        """
        payload = {
            "correo_cliente": self.email,
            "metodo_entrega": "pickup",
            "metodo_pago": "stripe",
            "iva": 0.16,
            "precio": 50.0,
            "nota": "Race condition test",
            "direccion_entrega_id": None,
            "descripciones": [
                {
                    "cantidad": 1,  # Solo 1 unidad
                    "presentacion_asociada_id": TARGET_PRESENTACION_ID
                }
            ]
        }

        with self.client.post(
            "/api/pedidos/crear/",
            json=payload,
            catch_response=True
        ) as response:
            if response.status_code in [200, 201]:
                self.pedidos_exitosos += 1
                response.success()
                print(f"✅ Pedido exitoso (total: {self.pedidos_exitosos})")
            elif response.status_code == 400:
                # Esperado si stock agotado
                self.pedidos_fallidos += 1
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(3)
    def comprar_multiples_productos(self):
        """
        POST /api/pedidos/crear/
        Comprar múltiples presentaciones (algunas con stock bajo)
        """
        # Mezcla de presentaciones normales y con stock bajo
        descripciones = []

        # 1-2 presentaciones con stock bajo
        for _ in range(random.randint(1, 2)):
            descripciones.append({
                "cantidad": random.randint(1, 3),
                "presentacion_asociada_id": TARGET_PRESENTACION_ID
            })

        # 1-2 presentaciones normales
        for _ in range(random.randint(1, 2)):
            descripciones.append({
                "cantidad": random.randint(1, 2),
                "presentacion_asociada_id": random.randint(2, 150)
            })

        payload = {
            "correo_cliente": self.email,
            "metodo_entrega": "pickup",
            "metodo_pago": "stripe",
            "iva": 0.16,
            "precio": round(random.uniform(50.0, 200.0), 2),
            "nota": "Multi-product race condition test",
            "direccion_entrega_id": None,
            "descripciones": descripciones
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

    @task(2)
    def verificar_stock_presentacion(self):
        """
        GET /api/productos/<id>/
        Verificar stock actual de la presentación
        """
        # Asumiendo que TARGET_PRESENTACION_ID pertenece al producto 1
        producto_id = 1

        with self.client.get(
            f"/api/productos/{producto_id}/",
            name="/api/productos/[id]/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    producto = response.json()
                    presentaciones = producto.get('presentaciones', [])

                    # Buscar la presentación target
                    target = next(
                        (p for p in presentaciones if p.get('id') == TARGET_PRESENTACION_ID),
                        None
                    )

                    if target:
                        stock = target.get('stock', 0)
                        if stock >= 0:
                            response.success()
                        else:
                            response.failure(f"⚠️ STOCK NEGATIVO DETECTADO: {stock}")
                            print(f"⚠️⚠️⚠️ RACE CONDITION: Stock negativo = {stock}")
                    else:
                        response.success()
                except Exception as e:
                    response.failure(f"Error: {str(e)}")
            else:
                response.failure(f"HTTP {response.status_code}")

    def on_stop(self):
        """Mostrar estadísticas al finalizar"""
        print(f"\n📊 Estadísticas de usuario:")
        print(f"   Pedidos exitosos: {self.pedidos_exitosos}")
        print(f"   Pedidos fallidos: {self.pedidos_fallidos}")


if __name__ == "__main__":
    # INSTRUCCIONES:
    # 1. Configurar stock inicial:
    #    psql -d kapatortas_db -c "UPDATE Presentaciones SET stock = 10 WHERE id = 1;"
    #
    # 2. Ejecutar prueba:
    #    locust -f locustfile_race_condition.py --host=http://localhost:8000 \
    #           --users 50 --spawn-rate 50 --run-time 1m --headless --csv=results_race
    #
    # 3. Verificar stock final:
    #    psql -d kapatortas_db -c "SELECT id, stock FROM Presentaciones WHERE id = 1;"
    #
    # 4. Verificar consistencia:
    #    psql -d kapatortas_db -c "SELECT COUNT(*) FROM DescripcionesPedido WHERE presentacion_asociada_id = 1;"
    pass
