# 🚀 Pruebas de Carga y Estrés - KapaTortas

Este directorio contiene todos los scripts y herramientas necesarias para ejecutar pruebas de carga y estrés en el sistema KapaTortas.

## 📋 Tabla de Contenidos

- [Instalación](#instalación)
- [Preparación del Ambiente](#preparación-del-ambiente)
- [Casos de Prueba](#casos-de-prueba)
- [Ejecución de Pruebas](#ejecución-de-pruebas)
- [Monitoreo](#monitoreo)
- [Resultados y Análisis](#resultados-y-análisis)

---

## 📦 Instalación

### 1. Instalar Locust

```bash
pip install locust requests
```

### 2. Instalar dependencias opcionales (Celery + Redis)

```bash
pip install celery redis django-redis
```

### 3. Instalar PostgreSQL client (para queries de monitoreo)

```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client
```

---

## 🛠️ Preparación del Ambiente

### Paso 1: Cargar Datos de Prueba

```bash
cd ../backend
python scripts/load_test_data.py
```

Esto creará:
- **500 clientes** con emails `cliente0@test.com` a `cliente499@test.com`
- **50 productos** con imágenes de Cloudinary
- **150 presentaciones** (3-5 por producto)
- **2000 pedidos** históricos
- **1 presentación con stock bajo** (ID 1, stock: 10) para pruebas de race condition

**Contraseña de todos los clientes de prueba:** `test123`

### Paso 2: Configurar Django para Producción (Opcional)

Editar `backend/backend/settings.py`:

```python
# Cambiar para simular producción
DEBUG = False
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Descomentar si instalaste Redis
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### Paso 3: Iniciar el Servidor Django

```bash
cd ../backend
python manage.py runserver 0.0.0.0:8000
```

### Paso 4: Iniciar Celery Worker (Opcional)

En otra terminal:

```bash
cd backend
celery -A backend worker --loglevel=info
```

### Paso 5: Iniciar Redis (Si usas Celery/Cache)

```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis
```

---

## 📊 Casos de Prueba

### CASO 1: Carga Normal en API REST

**Objetivo:** Verificar que la API soporta 100 usuarios concurrentes.

**Script:** `locustfile.py`

**Ejecutar:**

```bash
locust -f locustfile.py --host=http://localhost:8000
```

Luego abrir http://localhost:8089 y configurar:
- **Number of users:** 100
- **Spawn rate:** 50
- **Run time:** 30m

**Criterios de aceptación:**
- ✅ Error rate < 1%
- ✅ Latencia P95 < 1.5s (lectura), < 2.5s (escritura)
- ✅ CPU < 80%

---

### CASO 2: Estrés en PostgreSQL

**Objetivo:** Determinar el punto de quiebre del pool de conexiones.

**Script:** `locustfile_stress_db.py`

**Ejecutar fases incrementales:**

```bash
# Fase 1: 50 usuarios
locust -f locustfile_stress_db.py --host=http://localhost:8000 \
       --users 50 --spawn-rate 10 --run-time 5m --headless --csv=results_fase1

# Fase 2: 100 usuarios
locust -f locustfile_stress_db.py --host=http://localhost:8000 \
       --users 100 --spawn-rate 20 --run-time 5m --headless --csv=results_fase2

# Fase 3: 200 usuarios
locust -f locustfile_stress_db.py --host=http://localhost:8000 \
       --users 200 --spawn-rate 40 --run-time 5m --headless --csv=results_fase3

# Fase 4: 400 usuarios
locust -f locustfile_stress_db.py --host=http://localhost:8000 \
       --users 400 --spawn-rate 80 --run-time 5m --headless --csv=results_fase4
```

**Monitorear PostgreSQL durante la prueba:**

```sql
-- Conexiones activas
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Queries lentas
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

**Criterios de aceptación:**
- ✅ Documentar punto de quiebre (usuarios donde error rate > 10%)
- ✅ Identificar causa raíz (conexiones agotadas, CPU saturada, etc.)
- ✅ Sistema se recupera al reducir carga

---

### CASO 3: Carga de Imágenes desde Cloudinary

**Objetivo:** Medir impacto de cargar imágenes desde CDN externo.

**Script:** `locustfile_images.py`

**Ejecutar:**

```bash
locust -f locustfile_images.py --host=http://localhost:8000 \
       --users 200 --spawn-rate 50 --run-time 20m --headless --csv=results_images
```

**Métricas clave:**
- Latencia del backend (generación de JSON)
- Latencia de Cloudinary (descarga de imágenes)
- Tamaño de payloads JSON

**Criterios de aceptación:**
- ✅ Latencia P95 backend < 2s
- ✅ Latencia Cloudinary < 500ms por imagen
- ✅ Error rate Cloudinary < 2%

---

### CASO 4: PDFs y Emails

**Objetivo:** Medir impacto de operaciones bloqueantes de I/O.

**Script:** `locustfile_pdf_email.py`

**Ejecutar:**

```bash
locust -f locustfile_pdf_email.py --host=http://localhost:8000 \
       --users 50 --spawn-rate 10 --run-time 15m --headless --csv=results_pdf_email
```

**Criterios de aceptación:**
- ✅ Latencia P95 `POST /api/pedidos/crear/` < 4s
- ✅ Latencia P95 `GET /api/pedidos/facturas/<numero>/download/` < 2s
- ✅ CPU < 85%

**Mejora esperada con Celery:**
- Reducir latencia de creación de pedidos de ~4s a ~1.5s

---

### CASO 5: Race Conditions en Stock

**Objetivo:** Identificar race conditions en compra de productos con stock bajo.

**Script:** `locustfile_race_condition.py`

**Preparación:**

```bash
# 1. Configurar stock inicial
psql -d kapatortas_db -c "UPDATE presentaciones SET stock = 10 WHERE id = 1;"

# 2. Ejecutar prueba
locust -f locustfile_race_condition.py --host=http://localhost:8000 \
       --users 50 --spawn-rate 50 --run-time 1m --headless --csv=results_race

# 3. Verificar stock final
psql -d kapatortas_db -c "SELECT id, stock FROM presentaciones WHERE id = 1;"

# 4. Verificar consistencia
cd ../backend
python scripts/verify_data_consistency.py
```

**Criterios de aceptación:**
- ✅ Stock nunca es negativo
- ✅ Pedidos exitosos ≤ Stock inicial
- ✅ No hay deadlocks

**Optimización aplicada:**
- `select_for_update()` en `applications/Ventas/controllers/views.py`
- `@transaction.atomic` para rollback automático

---

## 📈 Monitoreo

### Monitoreo de PostgreSQL

**En tiempo real:**

```bash
# Entrar a psql
psql -d kapatortas_db

-- Conexiones activas
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

-- Queries más lentas
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC
LIMIT 10;

-- Locks
SELECT pid, mode, granted, query
FROM pg_stat_activity
JOIN pg_locks ON pg_locks.pid = pg_stat_activity.pid
WHERE NOT granted;
```

### Monitoreo del Servidor Django

**CPU y Memoria:**

```bash
# macOS/Linux
top -p $(pgrep -f "python manage.py runserver")

# Alternativa: htop (más visual)
htop -p $(pgrep -f "python manage.py runserver")
```

**Logs de performance:**

```bash
tail -f backend/logs/performance.log
```

### Monitoreo de Conexiones de Red

```bash
# Conexiones activas en puerto 8000
netstat -an | grep :8000 | wc -l

# Detalle de conexiones
netstat -an | grep :8000
```

---

## 📊 Resultados y Análisis

### Analizar Resultados de Locust

Locust genera 3 archivos CSV cuando usas `--csv`:

1. **`results_stats.csv`** - Estadísticas por endpoint
2. **`results_stats_history.csv`** - Historial de métricas
3. **`results_failures.csv`** - Errores ocurridos

**Análisis con Python:**

```python
import pandas as pd

# Leer estadísticas
stats = pd.read_csv('results_stats.csv')

# Endpoints más lentos (P95)
print(stats.sort_values('95%', ascending=False)[['Name', 'Median', '95%', '99%']])

# Tasa de errores
print(stats[['Name', '# requests', '# failures', 'Failure rate (%)']])
```

### Generar Gráficas

```python
import matplotlib.pyplot as plt

# Leer historial
history = pd.read_csv('results_stats_history.csv')

# Gráfica de throughput
plt.figure(figsize=(12, 6))
plt.plot(history['Timestamp'], history['Requests/s'])
plt.title('Throughput a lo largo del tiempo')
plt.xlabel('Tiempo')
plt.ylabel('Requests/s')
plt.savefig('throughput.png')

# Gráfica de latencia
plt.figure(figsize=(12, 6))
plt.plot(history['Timestamp'], history['50%'], label='P50')
plt.plot(history['Timestamp'], history['95%'], label='P95')
plt.plot(history['Timestamp'], history['99%'], label='P99')
plt.legend()
plt.title('Latencia a lo largo del tiempo')
plt.xlabel('Tiempo')
plt.ylabel('Latencia (ms)')
plt.savefig('latency.png')
```

### Verificar Consistencia de Datos

```bash
cd ../backend
python scripts/verify_data_consistency.py
```

Esto verifica:
- ✅ No hay stock negativo
- ✅ No hay pedidos duplicados
- ✅ Todas las descripciones tienen presentación válida
- ✅ No hay overselling

---

## 🔧 Solución de Problemas

### Error: "Too many connections" en PostgreSQL

**Solución:**

```sql
-- Aumentar max_connections en postgresql.conf
ALTER SYSTEM SET max_connections = 200;

-- Reiniciar PostgreSQL
```

**O configurar PgBouncer:**

```bash
brew install pgbouncer
# Editar /usr/local/etc/pgbouncer.ini
max_client_conn = 1000
default_pool_size = 20
```

### Error: Celery worker no se conecta a Redis

**Solución:**

```bash
# Verificar que Redis está corriendo
redis-cli ping  # Debe responder: PONG

# Verificar puerto
redis-cli -p 6379 ping
```

### Error: Locust dice "Connection refused"

**Solución:**

1. Verificar que Django está corriendo:
   ```bash
   curl http://localhost:8000/api/productos/all_productos/
   ```

2. Verificar ALLOWED_HOSTS en settings.py:
   ```python
   ALLOWED_HOSTS = ['localhost', '127.0.0.1', '*']
   ```

---

## 📞 Soporte

Para dudas o problemas:

1. Revisar logs: `backend/logs/performance.log`
2. Verificar consistencia de BD: `python scripts/verify_data_consistency.py`
3. Resetear datos: `python scripts/reset_database.py`

---

## 📝 Notas Importantes

- **Contraseña de clientes de prueba:** `test123`
- **Emails de prueba:** `cliente0@test.com` a `cliente499@test.com`
- **Presentación con stock bajo:** ID 1 (stock: 10)
- **Puerto Django:** 8000
- **Puerto Locust:** 8089
- **Puerto Redis:** 6379
- **Puerto PostgreSQL:** 5432

---

**¡Buenas pruebas! 🚀**
