"""
CASO 3: Capacidad de Carga de Imágenes desde Cloudinary
Mide el impacto de cargar imágenes desde CDN externo
"""

from locust import HttpUser, task, between
import random
import requests
import time


class ImageLoadUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        """Preparar usuario"""
        self.cloudinary_stats = {
            'total_images': 0,
            'successful': 0,
            'failed': 0,
            'total_time': 0
        }

    @task(5)
    def cargar_productos_con_imagenes(self):
        """GET /api/productos/todos/ - Retorna productos con URLs de imágenes"""
        with self.client.get(
            "/api/productos/todos/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    productos = response.json()

                    # Simular que el frontend descarga las imágenes
                    # (solo los primeros 5 productos para no sobrecargar)
                    for producto in productos[:5]:
                        imagenes = producto.get('imagenes', [])

                        # Descargar primeras 3 imágenes de cada producto
                        for img_url in imagenes[:3]:
                            self._download_cloudinary_image(img_url)

                    response.success()
                except Exception as e:
                    response.failure(f"Error: {str(e)}")
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(3)
    def cargar_producto_individual(self):
        """GET /api/productos/<id>/ - Producto con imágenes"""
        producto_id = random.randint(1, 50)

        with self.client.get(
            f"/api/productos/{producto_id}/",
            name="/api/productos/[id]/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    producto = response.json()
                    imagenes = producto.get('imagenes', [])

                    # Descargar todas las imágenes del producto
                    for img_url in imagenes:
                        self._download_cloudinary_image(img_url)

                    response.success()
                except Exception as e:
                    response.failure(f"Error: {str(e)}")
            elif response.status_code == 404:
                response.success()  # Válido si no existe
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(2)
    def cargar_catalogo_sin_imagenes(self):
        """GET /api/productos/all_productos/ - Solo metadata"""
        with self.client.get(
            "/api/productos/all_productos/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    def _download_cloudinary_image(self, img_url):
        """
        Simula descarga de imagen desde Cloudinary
        (En producción esto lo hace el navegador, no el backend)
        """
        if not img_url or not img_url.startswith('http'):
            return

        self.cloudinary_stats['total_images'] += 1

        try:
            start_time = time.time()

            # Timeout de 5 segundos para evitar bloqueos
            response = requests.get(img_url, timeout=5, stream=True)

            elapsed = time.time() - start_time
            self.cloudinary_stats['total_time'] += elapsed

            if response.status_code == 200:
                self.cloudinary_stats['successful'] += 1

                # Registrar métrica personalizada en Locust
                self.environment.events.request.fire(
                    request_type="GET",
                    name="Cloudinary Image",
                    response_time=elapsed * 1000,  # Convertir a ms
                    response_length=int(response.headers.get('content-length', 0)),
                    exception=None,
                    context={}
                )
            else:
                self.cloudinary_stats['failed'] += 1

                self.environment.events.request.fire(
                    request_type="GET",
                    name="Cloudinary Image",
                    response_time=elapsed * 1000,
                    response_length=0,
                    exception=Exception(f"HTTP {response.status_code}"),
                    context={}
                )

        except requests.exceptions.Timeout:
            self.cloudinary_stats['failed'] += 1
            print(f"⚠️ Timeout descargando imagen: {img_url[:50]}...")

            self.environment.events.request.fire(
                request_type="GET",
                name="Cloudinary Image",
                response_time=5000,  # Timeout de 5s
                response_length=0,
                exception=Exception("Timeout"),
                context={}
            )

        except Exception as e:
            self.cloudinary_stats['failed'] += 1
            print(f"❌ Error descargando imagen: {str(e)}")

    def on_stop(self):
        """Mostrar estadísticas al finalizar"""
        if self.cloudinary_stats['total_images'] > 0:
            avg_time = self.cloudinary_stats['total_time'] / self.cloudinary_stats['total_images']
            print(f"\n📊 Estadísticas de Cloudinary:")
            print(f"   Total de imágenes: {self.cloudinary_stats['total_images']}")
            print(f"   Exitosas: {self.cloudinary_stats['successful']}")
            print(f"   Fallidas: {self.cloudinary_stats['failed']}")
            print(f"   Tiempo promedio: {avg_time:.3f}s")


if __name__ == "__main__":
    # Ejecutar:
    # locust -f locustfile_images.py --host=http://localhost:8000 --users 200 --spawn-rate 50 --run-time 20m --headless --csv=results_images
    pass
