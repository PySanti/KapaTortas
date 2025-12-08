# PLAN DE PRUEBAS DE CARGA Y ESTRÉS
## Sistema KapaTortas - E-commerce de Postres

---

## 1. OBJETIVO DEL DOCUMENTO

Este documento establece el **plan de acción completo** para diseñar, implementar y ejecutar pruebas de carga y estrés sobre el sistema **KapaTortas**, con el fin de:

* Verificar la **eficiencia de desempeño** bajo carga esperada y carga máxima de usuarios concurrentes
* Evaluar la **capacidad de conexión de la API REST** (Django) con múltiples clientes simultáneos
* Medir la **capacidad de conexión del backend** con la base de datos PostgreSQL bajo carga
* Analizar la **capacidad de carga de imágenes** desde Cloudinary y el **contenido de la base de datos**
* Identificar cuellos de botella y proponer optimizaciones concretas

---

## 2. CONTEXTO DEL SISTEMA

### 2.1. Arquitectura Técnica

**Backend:**
- Django 4.2.16 + Django REST Framework 3.15.2
- Python 3.x
- PostgreSQL (localhost:5432)
- ORM: Django ORM
- Autenticación: Token Authentication + Google OAuth2
- Puerto: 8000

**Frontend:**
- Next.js 14.2.16 (React 18)
- Next-Auth (autenticación)
- Puerto: 3000

**Integraciones Externas:**
- **Cloudinary:** CDN para imágenes de productos
- **Stripe:** Procesamiento de pagos
- **Gmail SMTP:** Envío de facturas por email
- **Google OAuth2:** Autenticación social

**Base de Datos:**
- PostgreSQL 5432
- 4 aplicaciones: Perfiles, Clientes, Productos, Ventas
- Sin connection pooling explícito configurado
- Sin índices personalizados documentados

### 2.2. Puntos Críticos Identificados

**🔴 CRÍTICOS (Mayor Impacto en Performance):**

1. **GET /api/perfiles/<email>/**
   - Consulta perfil + pedidos + direcciones (múltiples JOINs)
   - Ejecutado en cada login

2. **POST /api/pedidos/crear/**
   - Creación de pedidos con múltiples descripciones
   - Operación de escritura con múltiples inserts

3. **GET /api/productos/todos/**
   - Lista TODOS los productos con presentaciones y reviews
   - N+1 queries potenciales

4. **GET /api/pedidos/all_pedidos/sorted**
   - Obtiene todos los pedidos con ordenamiento CASE/WHEN
   - Ejecutado frecuentemente en panel admin

5. **GET /api/pedidos/facturas/<numero>/download/**
   - Generación/descarga de PDF (WeasyPrint - CPU intensive)
   - Operación I/O bloqueante

**⚠️ MODERADOS:**

6. Email sending (bloqueante, sin queue)
7. Consultas sin prefetch_related/select_related
8. CORS middleware activo en todos los requests
9. Sin rate limiting implementado

---

## 3. ENFOQUE DE PRUEBAS: TRES PILARES

### 🎯 PILAR 1: Conexión de la API
**Objetivo:** Verificar que la API REST puede manejar múltiples conexiones HTTP concurrentes sin degradación.

**Métricas clave:**
- Tiempo de respuesta (P50, P95, P99)
- Throughput (requests/segundo)
- Tasa de errores HTTP (4xx, 5xx)
- Latencia de red

### 🎯 PILAR 2: Capacidad de Conexión con el Backend
**Objetivo:** Evaluar el pool de conexiones a PostgreSQL y la capacidad del ORM bajo carga.

**Métricas clave:**
- Conexiones activas a PostgreSQL
- Tiempo de ejecución de queries (Django Debug Toolbar)
- Uso de CPU/memoria del servidor Django
- Deadlocks o timeouts de BD

### 🎯 PILAR 3: Capacidad de Carga de Imágenes y Contenido de BD
**Objetivo:** Medir el impacto de cargar imágenes desde Cloudinary y datos pesados desde PostgreSQL.

**Métricas clave:**
- Tiempo de carga de imágenes desde Cloudinary
- Tamaño de payloads JSON (productos con múltiples imágenes)
- Latencia de endpoints que retornan ArrayFields (imágenes)
- Throughput de transferencia de datos

---

## 4. HERRAMIENTAS RECOMENDADAS

### Opción 1: Locust (RECOMENDADO para Django)
**Por qué:**
- Scripts en Python (mismo lenguaje que Django)
- Interface web en tiempo real
- Fácil simulación de comportamiento de usuario
- Excelente para APIs REST

**Instalación:**
```bash
pip install locust
```

### Opción 2: Apache JMeter
**Por qué:**
- GUI intuitiva
- Amplia documentación
- Reportes visuales detallados

### Opción 3: k6
**Por qué:**
- Scripts en JavaScript
- Orientado a DevOps
- Métricas Prometheus-compatible

---

## 5. CONFIGURACIÓN DEL AMBIENTE DE PRUEBAS

### 5.1. Requisitos del Servidor

**Especificaciones mínimas:**
- CPU: 4 cores
- RAM: 8 GB
- Sistema Operativo: Linux/macOS (mismo que producción)

**Configuración de Django:**

```python
# backend/backend/settings.py

# DATABASE CONNECTION POOLING
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'kapatortas_db',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
        'CONN_MAX_AGE': 60,  # ← AÑADIR: Persistent connections (60 segundos)
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}

# LOGGING PARA QUERIES
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',  # Ver todas las queries
        },
    },
}

# IMPORTANTE: Cambiar para pruebas
DEBUG = False  # Deshabilitar debug para simular producción
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
```

**Configuración de PostgreSQL:**

```sql
-- Verificar configuración actual
SHOW max_connections;  -- Default: 100
SHOW shared_buffers;   -- Recomendado: 25% de RAM

-- Ajustar si es necesario (en postgresql.conf)
max_connections = 200
shared_buffers = 2GB
effective_cache_size = 6GB
work_mem = 16MB
```

### 5.2. Datos de Prueba

**Script de carga de datos:**

```python
# backend/scripts/load_test_data.py
from applications.Perfiles.models import Perfiles
from applications.Clientes.models import Clientes, DireccionesEnvio
from applications.Productos.models import Productos, Presentaciones
from applications.Ventas.models import Pedidos, DescripcionesPedido
from django.contrib.auth.hashers import make_password
import random

def cargar_datos_prueba():
    print("Cargando datos de prueba...")

    # 1. Crear 500 clientes
    for i in range(500):
        perfil = Perfiles.objects.create(
            nombre_completo=f"Cliente Test {i}",
            cedula=f"V{10000000+i}",
            correo=f"cliente{i}@test.com",
            contraseña=make_password("test123"),
            numero_telefonico=f"04241234{i:04d}",
            rol="cliente",
            is_active=True
        )
        cliente = Clientes.objects.create(perfil=perfil)

        # 2-3 direcciones por cliente
        for j in range(random.randint(2, 3)):
            DireccionesEnvio.objects.create(
                pais="Venezuela",
                ciudad="Caracas",
                estado="Miranda",
                direccion=f"Av. Principal {i}, Casa {j}",
                codigo_postal="1060"
            )

    # 2. Crear 50 productos con imágenes
    categorias = ['postre', 'extra', 'especial']
    for i in range(50):
        Productos.objects.create(
            titulo=f"Producto Test {i}",
            categoria=random.choice(categorias),
            descripcion=f"Descripción del producto {i}",
            imagenes=[
                f"https://res.cloudinary.com/demo/image/upload/sample{j}.jpg"
                for j in range(random.randint(3, 8))
            ]
        )

    # 3. Crear presentaciones (3-5 por producto)
    productos = Productos.objects.all()
    for producto in productos:
        for i in range(random.randint(3, 5)):
            Presentaciones.objects.create(
                ref=f"{producto.titulo}-{i}",
                proporcion=f"{random.choice([6, 8, 10, 12])} porciones",
                precio=random.uniform(15.0, 100.0),
                stock=random.randint(10, 100),
                producto=producto
            )

    # 4. Crear 2000 pedidos históricos
    clientes = Clientes.objects.all()
    for i in range(2000):
        cliente = random.choice(clientes)
        pedido = Pedidos.objects.create(
            numero_de_orden=10000 + i,
            cliente_asociado=cliente,
            iva=0.16,
            monto_total=random.uniform(20.0, 200.0),
            estado=random.choice(['recibido', 'en_proceso', 'finalizado']),
            metodo_pago=random.choice(['zelle', 'pago_movil', 'stripe']),
            metodo_entrega=random.choice(['pickup', 'delivery'])
        )

    print("✅ Datos de prueba cargados exitosamente")

if __name__ == '__main__':
    cargar_datos_prueba()
```

**Ejecutar:**
```bash
cd backend
python manage.py shell < scripts/load_test_data.py
```

---

## 6. CASOS DE PRUEBA - PLAN DE EJECUCIÓN

### 📋 CASO 1: Prueba de Carga Normal en API REST

#### Objetivo
Verificar que la API soporta 100 usuarios concurrentes realizando operaciones típicas de clientes.

#### Escenario
Simular usuarios navegando la tienda, consultando productos, y realizando pedidos.

#### Flujo de Usuario (Locust)
```python
# locustfile.py
from locust import HttpUser, task, between
import random

class ClienteKapaTortas(HttpUser):
    wait_time = between(2, 5)  # Think time entre requests

    def on_start(self):
        """Login al iniciar"""
        response = self.client.get("/api/perfiles/cliente1@test.com/")
        if response.status_code == 200:
            self.user_data = response.json()

    @task(10)  # Mayor peso: más común
    def ver_productos(self):
        """GET /api/productos/all_productos/"""
        self.client.get("/api/productos/all_productos/")

    @task(8)
    def ver_producto_detalle(self):
        """GET /api/productos/<id>/"""
        producto_id = random.randint(1, 50)
        self.client.get(f"/api/productos/{producto_id}/")

    @task(5)
    def ver_perfil(self):
        """GET /api/perfiles/<email>/"""
        self.client.get(f"/api/perfiles/cliente1@test.com/")

    @task(3)
    def ver_pedidos(self):
        """GET /api/perfiles/buscar_pedidos_cliente/<email>/"""
        self.client.get(f"/api/perfiles/buscar_pedidos_cliente/cliente1@test.com/")

    @task(2)
    def crear_pedido(self):
        """POST /api/pedidos/crear/"""
        payload = {
            "correo_cliente": "cliente1@test.com",
            "metodo_entrega": "pickup",
            "metodo_pago": "stripe",
            "iva": 0.16,
            "precio": 45.50,
            "nota": "Test desde Locust",
            "direccion_entrega_id": None,
            "descripciones": [
                {
                    "cantidad": 2,
                    "presentacion_asociada_id": random.randint(1, 100)
                }
            ]
        }
        self.client.post("/api/pedidos/crear/", json=payload)
```

#### Parámetros de Ejecución
```bash
locust -f locustfile.py --host=http://localhost:8000
```

- **Usuarios concurrentes:** 100
- **Ramp-up:** 50 usuarios/minuto (2 minutos total)
- **Duración:** 30 minutos de carga sostenida
- **Think time:** 2-5 segundos

#### Métricas a Capturar

| Endpoint | Latencia P95 Esperada | Throughput Mínimo |
|----------|----------------------|-------------------|
| GET /api/productos/all_productos/ | < 1.5 segundos | 50 req/s |
| GET /api/productos/<id>/ | < 1.0 segundo | 80 req/s |
| POST /api/pedidos/crear/ | < 2.5 segundos | 20 req/s |
| GET /api/perfiles/<email>/ | < 1.2 segundos | 30 req/s |

#### Criterios de Aceptación
- ✅ Error rate < 1%
- ✅ Todos los endpoints dentro del SLA de latencia
- ✅ No hay conexiones colgadas en PostgreSQL (`pg_stat_activity`)
- ✅ CPU del servidor Django < 80%
- ✅ Memoria del proceso Django estable (sin memory leaks)

#### Comandos de Monitoreo Durante la Prueba

**PostgreSQL:**
```sql
-- Verificar conexiones activas
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Ver queries lentas
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

**Sistema (Linux/macOS):**
```bash
# CPU y Memoria del proceso Django
top -p $(pgrep -f "python manage.py runserver")

# Conexiones TCP activas en puerto 8000
netstat -an | grep :8000 | wc -l

# I/O de disco (para PDFs)
iostat -x 1
```

---

### 📋 CASO 2: Prueba de Estrés en Conexiones a PostgreSQL

#### Objetivo
Determinar el **punto de quiebre** del pool de conexiones de Django a PostgreSQL.

#### Descripción
Incrementar progresivamente usuarios hasta saturar las conexiones de BD y observar el comportamiento.

#### Fases de Incremento

| Fase | Usuarios | Duración | Objetivo |
|------|----------|----------|----------|
| 1 | 50 | 5 min | Baseline |
| 2 | 100 | 5 min | Carga normal |
| 3 | 200 | 5 min | Carga alta |
| 4 | 400 | 5 min | Carga extrema |
| 5 | 600+ | Hasta colapso | Punto de quiebre |

#### Script Locust
```python
# locustfile_stress_db.py
from locust import HttpUser, task, constant

class StressDatabaseUser(HttpUser):
    wait_time = constant(1)  # Requests agresivos cada segundo

    @task
    def query_pesada(self):
        """Endpoint que genera múltiples queries"""
        self.client.get("/api/pedidos/all_pedidos/sorted")

    @task
    def consulta_perfil(self):
        """Perfil con JOINs a pedidos y direcciones"""
        email = f"cliente{random.randint(0, 499)}@test.com"
        self.client.get(f"/api/perfiles/{email}/")
```

#### Ejecución
```bash
# Fase 1: 50 usuarios
locust -f locustfile_stress_db.py --host=http://localhost:8000 \
       --users 50 --spawn-rate 10 --run-time 5m --headless

# Fase 2: 100 usuarios
locust -f locustfile_stress_db.py --host=http://localhost:8000 \
       --users 100 --spawn-rate 20 --run-time 5m --headless

# ... y así sucesivamente
```

#### Métricas a Capturar

**Señales de colapso:**
- Error rate > 10%
- Latencia P95 > 10 segundos
- Timeouts de conexión a BD
- Logs de Django: "FATAL: remaining connection slots are reserved"

**Análisis:**
```sql
-- Conexiones totales vs. máximo
SELECT count(*) as current_connections,
       (SELECT setting::int FROM pg_settings WHERE name='max_connections') as max_connections
FROM pg_stat_activity;

-- Conexiones por estado
SELECT state, count(*)
FROM pg_stat_activity
GROUP BY state;
```

#### Criterios de Aceptación
- ✅ Documentar el número exacto de usuarios donde el sistema colapsa
- ✅ Identificar la causa raíz (conexiones agotadas, CPU saturada, memoria)
- ✅ Después de reducir carga, el sistema debe recuperarse automáticamente
- ✅ No debe haber corrupción de datos en BD (verificar consistencia)

#### Entregables
- Gráfica: Latencia P95 vs. Número de usuarios
- Gráfica: Throughput vs. Número de usuarios
- Gráfica: Conexiones activas PostgreSQL vs. Tiempo
- Análisis de causa raíz del colapso
- **Propuesta de optimización:**
  - Aumentar `CONN_MAX_AGE` en settings.py
  - Configurar `max_connections` en PostgreSQL
  - Implementar connection pooling con PgBouncer

---

### 📋 CASO 3: Capacidad de Carga de Imágenes desde Cloudinary

#### Objetivo
Medir el impacto de cargar imágenes desde Cloudinary (CDN externo) en la experiencia de usuario.

#### Descripción
Simular 200 usuarios navegando productos que tienen múltiples imágenes (ArrayField) desde Cloudinary.

#### Escenario
Los productos en KapaTortas tienen 3-8 imágenes cada uno almacenadas como URLs en Cloudinary:
```json
{
  "imagenes": [
    "https://res.cloudinary.com/demo/image/upload/sample1.jpg",
    "https://res.cloudinary.com/demo/image/upload/sample2.jpg",
    "..."
  ]
}
```

El frontend debe descargar estas imágenes del CDN mientras el backend retorna solo las URLs.

#### Script Locust (Simulando Frontend)
```python
# locustfile_images.py
from locust import HttpUser, task, between
import random
import requests

class ImageLoadUser(HttpUser):
    wait_time = between(1, 3)

    @task(5)
    def cargar_productos_con_imagenes(self):
        """GET /api/productos/todos/ - Retorna productos con URLs de imágenes"""
        response = self.client.get("/api/productos/todos/")

        if response.status_code == 200:
            productos = response.json()

            # Simular que el frontend descarga las imágenes
            for producto in productos[:5]:  # Primeros 5 productos
                imagenes = producto.get('imagenes', [])
                for img_url in imagenes[:3]:  # Primeras 3 imágenes
                    # Simular descarga de Cloudinary (NO pasa por Django)
                    # Medimos latencia de Cloudinary
                    try:
                        img_response = requests.get(img_url, timeout=5)
                    except requests.exceptions.Timeout:
                        print(f"⚠️ Timeout descargando imagen: {img_url}")

    @task(3)
    def cargar_producto_individual(self):
        """GET /api/productos/<id>/ - Producto con imágenes"""
        producto_id = random.randint(1, 50)
        response = self.client.get(f"/api/productos/{producto_id}/")

        if response.status_code == 200:
            producto = response.json()
            imagenes = producto.get('imagenes', [])

            # Descargar imágenes de Cloudinary
            for img_url in imagenes:
                requests.get(img_url, timeout=5)
```

#### Parámetros de Ejecución
- **Usuarios concurrentes:** 200
- **Ramp-up:** 3 minutos
- **Duración:** 20 minutos
- **Think time:** 1-3 segundos

#### Métricas a Capturar

**Separar tiempos:**

1. **Tiempo de respuesta del backend Django:**
   - GET /api/productos/todos/: Tiempo para generar el JSON con URLs

2. **Tiempo de descarga desde Cloudinary:**
   - Latencia de CDN externo
   - Throughput de imágenes

**Herramientas adicionales:**

```bash
# Medir latencia de Cloudinary directamente
curl -w "@curl-format.txt" -o /dev/null -s https://res.cloudinary.com/demo/image/upload/sample.jpg

# curl-format.txt:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

**Análisis de payloads:**

```python
# Verificar tamaño de respuesta JSON
import requests
response = requests.get("http://localhost:8000/api/productos/todos/")
print(f"Tamaño del payload: {len(response.content)} bytes")
print(f"Número de productos: {len(response.json())}")
```

#### Criterios de Aceptación
- ✅ Latencia P95 del endpoint `/api/productos/todos/` < 2 segundos (solo backend)
- ✅ Latencia promedio de Cloudinary < 500 ms por imagen
- ✅ Error rate de Cloudinary < 2% (tolerancia a fallos de CDN)
- ✅ Tamaño de payload JSON < 5 MB por request
- ✅ Throughput > 50 productos/segundo

#### Propuestas de Optimización

**Si la latencia del backend es alta:**
- Implementar paginación en `/api/productos/todos/`
- Crear endpoint `/api/productos/?limit=20&offset=0`
- Cachear respuestas con Django Cache Framework (Redis)

**Si Cloudinary es lento:**
- Implementar lazy loading de imágenes en frontend
- Usar formatos optimizados (WebP, AVIF)
- Agregar parámetros de transformación a URLs Cloudinary:
  ```
  https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/sample.jpg
  ```

**Ejemplo de caché en Django:**
```python
# applications/Productos/controllers/views.py
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # Cachear por 15 minutos
@api_view(['GET'])
def all_productos_view(request):
    # ...existing code...
```

---

### 📋 CASO 4: Impacto de Generación de PDFs y Envío de Email

#### Objetivo
Medir el impacto de operaciones **bloqueantes de I/O** (generación de PDFs y envío de emails) en la latencia.

#### Contexto
KapaTortas genera facturas en PDF usando WeasyPrint (CPU-intensive) y las envía por Gmail SMTP (I/O bloqueante).

**Endpoints afectados:**
- `POST /api/pedidos/crear/` → Puede generar factura
- `GET /api/pedidos/facturas/<numero>/download/` → Sirve PDF

#### Script Locust
```python
# locustfile_pdf_email.py
from locust import HttpUser, task, between
import random

class PDFEmailUser(HttpUser):
    wait_time = between(3, 6)

    @task(3)
    def crear_pedido_con_factura(self):
        """POST /api/pedidos/crear/ - Genera factura y envía email"""
        payload = {
            "correo_cliente": f"cliente{random.randint(0, 499)}@test.com",
            "metodo_entrega": "delivery",
            "metodo_pago": "stripe",
            "iva": 0.16,
            "precio": random.uniform(30, 150),
            "nota": "Pedido de prueba de carga",
            "direccion_entrega_id": random.randint(1, 1000),
            "descripciones": [
                {
                    "cantidad": random.randint(1, 3),
                    "presentacion_asociada_id": random.randint(1, 150)
                }
            ]
        }
        self.client.post("/api/pedidos/crear/", json=payload)

    @task(1)
    def descargar_factura(self):
        """GET /api/pedidos/facturas/<numero>/download/"""
        numero_orden = random.randint(10000, 12000)
        self.client.get(f"/api/pedidos/facturas/{numero_orden}/download/")
```

#### Parámetros de Ejecución
- **Usuarios concurrentes:** 50 (menor que otros casos porque es CPU-intensive)
- **Ramp-up:** 2 minutos
- **Duración:** 15 minutos

#### Métricas a Capturar

**Instrumentar el código:**

```python
# backend/backend/utils/crear_pdf.py
import time
import logging

logger = logging.getLogger(__name__)

def create_pdf(numero_orden, venta_data):
    start_time = time.time()

    # ... código existente de generación de PDF ...

    elapsed = time.time() - start_time
    logger.info(f"PDF generado para orden {numero_orden} en {elapsed:.2f} segundos")

    return pdf_file
```

```python
# backend/backend/utils/send_client_mail.py
import time
import logging

logger = logging.getLogger(__name__)

def send_email_with_attachment(to_email, subject, body, attachment):
    start_time = time.time()

    # ... código existente de envío de email ...

    elapsed = time.time() - start_time
    logger.info(f"Email enviado a {to_email} en {elapsed:.2f} segundos")
```

**Revisar logs:**
```bash
tail -f backend/logs/performance.log
```

#### Criterios de Aceptación
- ✅ Latencia P95 de `POST /api/pedidos/crear/` < 4 segundos (incluyendo PDF+Email)
- ✅ Latencia P95 de `GET /api/pedidos/facturas/<numero>/download/` < 2 segundos
- ✅ Error rate < 3%
- ✅ CPU del servidor < 85% sostenido
- ✅ Tiempo promedio de generación de PDF < 1.5 segundos
- ✅ Tiempo promedio de envío de email < 1 segundo

#### Propuesta de Optimización: Procesamiento Asíncrono

**Opción 1: Celery + Redis (RECOMENDADO)**

```bash
pip install celery redis
```

```python
# backend/backend/celery.py
from celery import Celery
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('kapatortas')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

```python
# backend/backend/settings.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
```

```python
# backend/applications/Ventas/tasks.py
from celery import shared_task
from backend.utils.crear_pdf import create_pdf
from backend.utils.send_client_mail import send_email_with_attachment

@shared_task
def generar_y_enviar_factura_async(numero_orden, venta_data, cliente_email):
    """Tarea asíncrona para generar PDF y enviar email"""
    pdf_file = create_pdf(numero_orden, venta_data)
    send_email_with_attachment(
        to_email=cliente_email,
        subject=f"Factura #{numero_orden}",
        body="Adjunto encontrará su factura",
        attachment=pdf_file
    )
```

```python
# applications/Ventas/controllers/views.py
from applications.Ventas.tasks import generar_y_enviar_factura_async

@api_view(['POST'])
def crear_pedido_view(request):
    # ... crear pedido y venta ...

    # ANTES (bloqueante):
    # pdf = create_pdf(numero_orden, venta_data)
    # send_email(cliente_email, pdf)

    # DESPUÉS (asíncrono):
    generar_y_enviar_factura_async.delay(numero_orden, venta_data, cliente_email)

    return Response({"mensaje": "Pedido creado, factura en proceso"}, status=201)
```

**Ejecutar worker de Celery:**
```bash
celery -A backend worker --loglevel=info
```

#### Validación de Mejora

**Ejecutar prueba ANTES de optimizar:**
```bash
locust -f locustfile_pdf_email.py --host=http://localhost:8000 \
       --users 50 --spawn-rate 10 --run-time 15m --headless \
       --csv=results_before
```

**Ejecutar prueba DESPUÉS de optimizar:**
```bash
locust -f locustfile_pdf_email.py --host=http://localhost:8000 \
       --users 50 --spawn-rate 10 --run-time 15m --headless \
       --csv=results_after
```

**Comparar resultados:**
```python
import pandas as pd

before = pd.read_csv('results_before_stats.csv')
after = pd.read_csv('results_after_stats.csv')

print("Mejora en latencia P95 de POST /api/pedidos/crear/:")
print(f"Antes: {before['95%'].iloc[0]} ms")
print(f"Después: {after['95%'].iloc[0]} ms")
print(f"Mejora: {((before['95%'].iloc[0] - after['95%'].iloc[0]) / before['95%'].iloc[0] * 100):.1f}%")
```

---

### 📋 CASO 5: Prueba de Condiciones de Carrera en Pedidos Concurrentes

#### Objetivo
Identificar **race conditions** cuando múltiples usuarios intentan comprar las últimas unidades de un producto.

#### Contexto
El modelo `Presentaciones` tiene un campo `stock`. Cuando se crea un pedido, se debe decrementar el stock. Si no hay manejo de concurrencia adecuado, puede haber:
- **Overselling:** Vender más unidades de las disponibles
- **Stock negativo:** `stock < 0` en BD

#### Escenario de Prueba

**Setup:**
1. Crear un producto con presentación de stock BAJO (ej: 10 unidades)
2. Simular 50 usuarios intentando comprar simultáneamente esa presentación

#### Script Locust
```python
# locustfile_race_condition.py
from locust import HttpUser, task, between
import random

TARGET_PRESENTACION_ID = 1  # Presentación con stock bajo

class RaceConditionUser(HttpUser):
    wait_time = between(0.1, 0.5)  # Requests muy rápidos para forzar race condition

    @task
    def comprar_producto_limitado(self):
        """POST /api/pedidos/crear/ - Intentar comprar presentación con stock bajo"""
        payload = {
            "correo_cliente": f"cliente{random.randint(0, 499)}@test.com",
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
        response = self.client.post("/api/pedidos/crear/", json=payload)

        if response.status_code == 400:
            # Esperado si stock agotado
            pass
        elif response.status_code == 201:
            # Pedido creado exitosamente
            pass
```

#### Ejecución
```bash
# 1. Configurar stock inicial
psql -d kapatortas_db -c "UPDATE Presentaciones SET stock = 10 WHERE id = 1;"

# 2. Ejecutar prueba con 50 usuarios concurrentes
locust -f locustfile_race_condition.py --host=http://localhost:8000 \
       --users 50 --spawn-rate 50 --run-time 1m --headless

# 3. Verificar stock final
psql -d kapatortas_db -c "SELECT id, stock FROM Presentaciones WHERE id = 1;"
```

#### Verificación de Consistencia

**Query de validación:**
```sql
-- Verificar si hay overselling
SELECT p.id, p.ref, p.stock,
       (SELECT COUNT(*) FROM DescripcionesPedido dp
        WHERE dp.presentacion_asociada_id = p.id) as pedidos_totales
FROM Presentaciones p
WHERE p.stock < 0 OR p.stock < (
    SELECT SUM(dp.cantidad) FROM DescripcionesPedido dp
    WHERE dp.presentacion_asociada_id = p.id
);
```

**Expected:**
- Stock final = Stock inicial - Total de pedidos exitosos
- Stock NO debe ser negativo
- Número de pedidos creados NO debe exceder stock inicial

#### Criterios de Aceptación
- ✅ Stock nunca es negativo
- ✅ Número de pedidos exitosos ≤ Stock inicial
- ✅ Requests que fallan devuelven 400 Bad Request con mensaje claro
- ✅ No hay deadlocks en PostgreSQL

#### Propuesta de Optimización: Select For Update

**ANTES (código vulnerable):**
```python
# applications/Ventas/controllers/views.py
@api_view(['POST'])
def crear_pedido_view(request):
    # ... validaciones ...

    for desc in descripciones:
        presentacion = Presentaciones.objects.get(id=desc['presentacion_asociada_id'])

        # ⚠️ RACE CONDITION: Otro thread puede modificar stock aquí
        if presentacion.stock < desc['cantidad']:
            return Response({"error": "Stock insuficiente"}, status=400)

        presentacion.stock -= desc['cantidad']  # ⚠️ NO ATÓMICO
        presentacion.save()
```

**DESPUÉS (código seguro):**
```python
from django.db import transaction

@api_view(['POST'])
@transaction.atomic
def crear_pedido_view(request):
    # ... validaciones ...

    for desc in descripciones:
        # ✅ SELECT FOR UPDATE: Bloquea la fila hasta el commit
        presentacion = Presentaciones.objects.select_for_update().get(
            id=desc['presentacion_asociada_id']
        )

        if presentacion.stock < desc['cantidad']:
            return Response({"error": "Stock insuficiente"}, status=400)

        presentacion.stock -= desc['cantidad']
        presentacion.save()  # ✅ Commit atómico garantizado por @transaction.atomic

    # ... crear pedido ...
```

**Validar la solución:**
```bash
# Ejecutar la misma prueba después del fix
locust -f locustfile_race_condition.py --host=http://localhost:8000 \
       --users 50 --spawn-rate 50 --run-time 1m --headless

# Verificar: stock NO debe ser negativo
psql -d kapatortas_db -c "SELECT id, stock FROM Presentaciones WHERE id = 1;"
```

---

## 7. ENTREGABLES ESPERADOS

### 7.1. Scripts de Prueba
- `locustfile.py` - Caso 1: Carga normal
- `locustfile_stress_db.py` - Caso 2: Estrés en BD
- `locustfile_images.py` - Caso 3: Carga de imágenes
- `locustfile_pdf_email.py` - Caso 4: PDFs y emails
- `locustfile_race_condition.py` - Caso 5: Race conditions

**Incluir README:**
```markdown
# Pruebas de Carga y Estrés - KapaTortas

## Instalación
```bash
pip install locust
```

## Ejecución

### Caso 1: Carga Normal
```bash
locust -f locustfile.py --host=http://localhost:8000
```
Abrir http://localhost:8089 y configurar:
- Number of users: 100
- Spawn rate: 50
- Run time: 30m

### Caso 2: Estrés en BD
```bash
locust -f locustfile_stress_db.py --host=http://localhost:8000 \
       --users 50 --spawn-rate 10 --run-time 5m --headless --csv=results
```
Incrementar usuarios manualmente en cada fase.
```

### 7.2. Informe de Resultados

**Estructura del informe:**
```
INFORME_PRUEBAS_CARGA_KAPATORTAS.md

1. Resumen Ejecutivo
   - Objetivo de las pruebas
   - Casos ejecutados
   - Principales hallazgos

2. Resultados por Caso
   Para cada caso:
   - Gráfica de latencia P50/P95/P99
   - Gráfica de throughput
   - Gráfica de uso de CPU/memoria
   - Tabla de métricas clave
   - Comparativa contra criterios de aceptación

3. Hallazgos y Cuellos de Botella
   - Cuello de botella 1: Descripción + evidencia
   - Cuello de botella 2: ...

4. Propuestas de Mejora Priorizadas
   - Alta prioridad
   - Media prioridad
   - Baja prioridad

5. Conclusiones
   - Punto de quiebre del sistema
   - Recomendaciones para producción
```

### 7.3. Configuración del Ambiente

**Documento:**
```markdown
# Configuración del Ambiente de Pruebas

## Hardware
- CPU: Intel Core i7-9700K (8 cores)
- RAM: 16 GB DDR4
- Disco: SSD 500 GB
- SO: macOS Sonoma 14.5.0

## Software
- Python 3.11.5
- Django 4.2.16
- PostgreSQL 14.2
- Locust 2.15.1

## Configuración de Django
backend/backend/settings.py:
- DEBUG = False
- CONN_MAX_AGE = 60
- LOGGING nivel DEBUG para django.db.backends

## Configuración de PostgreSQL
postgresql.conf:
- max_connections = 200
- shared_buffers = 4GB
- effective_cache_size = 12GB
```

### 7.4. Scripts de Datos de Prueba

- `backend/scripts/load_test_data.py` - Carga inicial
- `backend/scripts/reset_database.py` - Limpieza entre pruebas
- `backend/scripts/verify_data_consistency.py` - Validación post-prueba

---

## 8. CRONOGRAMA DE EJECUCIÓN

| Fase | Actividad | Duración Estimada |
|------|-----------|-------------------|
| 1 | Configurar ambiente de pruebas | 2 horas |
| 2 | Cargar datos de prueba (500 clientes, 50 productos, 2000 pedidos) | 1 hora |
| 3 | Desarrollar scripts Locust | 4 horas |
| 4 | Ejecutar Caso 1 (Carga Normal) | 1 hora |
| 5 | Ejecutar Caso 2 (Estrés BD) | 2 horas |
| 6 | Ejecutar Caso 3 (Imágenes) | 1.5 horas |
| 7 | Ejecutar Caso 4 (PDF/Email) | 1.5 horas |
| 8 | Ejecutar Caso 5 (Race Conditions) | 1 hora |
| 9 | Analizar resultados y generar gráficas | 3 horas |
| 10 | Redactar informe completo | 4 horas |
| 11 | Implementar optimizaciones prioritarias | 6 horas |
| 12 | Re-ejecutar pruebas (validación de mejoras) | 3 horas |

**Total: ~30 horas de trabajo**

---

## 9. MÉTRICAS CLAVE DE ÉXITO

Al finalizar las pruebas, el sistema debe cumplir:

### 9.1. Eficiencia de Desempeño - Conexión de la API

| Métrica | Valor Esperado |
|---------|----------------|
| Latencia P95 (lectura) | < 1.5 segundos |
| Latencia P95 (escritura) | < 2.5 segundos |
| Throughput (lectura) | > 50 req/s |
| Throughput (escritura) | > 20 req/s |
| Error rate (carga normal) | < 1% |

### 9.2. Capacidad de Conexión con el Backend

| Métrica | Valor Esperado |
|---------|----------------|
| Usuarios concurrentes soportados | > 100 |
| Conexiones activas PostgreSQL | < 80% de max_connections |
| Queries lentos (> 1 segundo) | < 5% |
| CPU del servidor Django | < 80% sostenido |

### 9.3. Capacidad de Carga de Imágenes y Contenido de BD

| Métrica | Valor Esperado |
|---------|----------------|
| Latencia Cloudinary | < 500 ms por imagen |
| Tamaño de payload JSON | < 5 MB |
| Throughput de productos | > 50 productos/s |
| Error rate Cloudinary | < 2% |

---

## 10. RIESGOS IDENTIFICADOS Y MITIGACIONES

### Riesgo 1: DEBUG=True en Producción
**Impacto:** Alto overhead de memoria, exposición de datos sensibles

**Mitigación:**
```python
# settings.py
DEBUG = False
ALLOWED_HOSTS = ['kapatortas.com', 'www.kapatortas.com']
```

### Riesgo 2: CORS Abierto a Todos los Orígenes
**Impacto:** Vulnerabilidad de seguridad, requests no autorizados

**Mitigación:**
```python
# settings.py
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://kapatortas.com",
    "https://www.kapatortas.com",
]
```

### Riesgo 3: Sin Connection Pooling Configurado
**Impacto:** Agotamiento de conexiones bajo carga

**Mitigación:**
```python
# settings.py
DATABASES = {
    'default': {
        # ... existing config ...
        'CONN_MAX_AGE': 600,  # 10 minutos de conexiones persistentes
    }
}
```

### Riesgo 4: N+1 Queries en Managers
**Impacto:** Alto número de queries, latencia elevada

**Mitigación:**
```python
# applications/Productos/managers.py
def get_productos_list_json(self):
    productos = Productos.objects.prefetch_related('presentaciones', 'reviews')  # ← Prefetch
    return [self.get_producto_json(p) for p in productos]
```

### Riesgo 5: Sin Rate Limiting
**Impacto:** Vulnerable a ataques DDoS

**Mitigación:**
```bash
pip install django-ratelimit
```

```python
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='60/m', method='GET')
@api_view(['GET'])
def all_productos_view(request):
    # ... existing code ...
```

---

## 11. SIGUIENTES PASOS DESPUÉS DE LAS PRUEBAS

### Fase 1: Optimizaciones Inmediatas (Prioridad Alta)
1. ✅ Configurar `CONN_MAX_AGE` en settings.py
2. ✅ Implementar `select_for_update()` en operaciones de stock
3. ✅ Añadir `prefetch_related()` en managers
4. ✅ Cambiar `DEBUG = False`
5. ✅ Restringir `CORS_ALLOWED_ORIGINS`

### Fase 2: Optimizaciones de Infraestructura (Prioridad Media)
1. Implementar Celery para PDFs y emails asíncronos
2. Configurar Redis para caché de Django
3. Implementar PgBouncer para connection pooling
4. Añadir índices en PostgreSQL:
   ```sql
   CREATE INDEX idx_pedidos_cliente ON Pedidos(cliente_asociado_id);
   CREATE INDEX idx_descripcionespedido_presentacion ON DescripcionesPedido(presentacion_asociada_id);
   ```

### Fase 3: Monitoreo en Producción (Prioridad Alta)
1. Configurar Django Debug Toolbar (solo en dev)
2. Implementar logging estructurado (JSON)
3. Configurar Prometheus + Grafana para métricas
4. Alertas de Slack/Email para:
   - Error rate > 5%
   - Latencia P95 > SLA
   - CPU > 90%

---

## 12. CONTACTO Y SOPORTE

**Equipo de desarrollo:** [Tu nombre]
**Fecha de inicio:** [Fecha]
**Fecha estimada de entrega:** [Fecha + 2 semanas]

**Formato de entrega:**
- Repositorio Git con branch `feature/performance-tests`
- Carpeta `/performance-tests/` con scripts Locust
- Carpeta `/docs/` con informe en Markdown
- Carpeta `/scripts/` con scripts de carga de datos

---

**Versión del documento:** 1.0
**Fecha:** Diciembre 2024
**Elaborado para:** Proyecto KapaTortas
