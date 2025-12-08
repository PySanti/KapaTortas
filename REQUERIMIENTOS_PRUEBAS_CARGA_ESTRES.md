# REQUERIMIENTOS DE PRUEBAS DE CARGA Y ESTRÉS
## Sistema de Simulación de Trading de Acciones (Stock Simulator)

---

## 1. OBJETIVO DEL DOCUMENTO

Este documento establece los **requerimientos mínimos de pruebas de carga y estrés** que el equipo de desarrollo debe diseñar, implementar y ejecutar sobre el sistema **Stock Simulator** (backend Spring Boot), con el fin de:

* Verificar el comportamiento del sistema bajo **carga esperada** y **carga máxima** de usuarios concurrentes.
* Identificar cuellos de botella de rendimiento, problemas de estabilidad y posibles condiciones de carrera.
* Generar evidencias objetivas del desempeño del sistema en operaciones críticas de trading.
* Validar la integración con servicios externos (Tiingo API) bajo carga.
* Evaluar el impacto del servicio de correo electrónico en la latencia de las operaciones.

---

## 2. ALCANCE Y CONTEXTO DEL SISTEMA

### 2.1. Descripción del Sistema

El **Stock Simulator** es una aplicación web de simulación de trading de acciones que incluye:

* **Gestión de usuarios:** Registro, login, verificación por email, edición de perfil
* **Catálogo de acciones:** Consulta de stocks disponibles y precios en tiempo real (vía API Tiingo)
* **Operaciones de trading:** Compra, venta y transferencia de acciones entre usuarios
* **Gestión de portafolio:** Visualización de acciones en propiedad y historial de transacciones
* **Sistema de soporte:** Formularios de contacto para usuarios

### 2.2. Arquitectura Técnica

* **Backend:** Spring Boot 3.3.5, Java 17+
* **Base de datos:** PostgreSQL (localhost:5432)
* **ORM:** Hibernate JPA
* **Seguridad:** Spring Security (actualmente en modo permissive, sin autenticación real)
* **Integraciones externas:**
  * Tiingo API para precios de acciones (https://api.tiingo.com)
  * Gmail SMTP para envío de correos electrónicos

### 2.3. Endpoints REST Identificados

#### **UserController** (`/api/user`)
- `POST /register` - Registro de nuevo usuario + envío de email de confirmación
- `POST /login` - Autenticación de usuario
- `POST /confirm` - Confirmación de email con código de verificación
- `GET /all` - Obtener todos los usuarios (excepto administradores)
- `POST /edit` - Editar perfil de usuario
- `POST /delete` - Eliminar cuenta de usuario (cascada a transacciones)

#### **StockController** (`/api/stock`)
- `GET /all` - Obtener todas las acciones disponibles en BD
- `GET /{ticker}` - Obtener precio actual de acción desde Tiingo API
- `GET /{ticker}/month` - Obtener datos históricos del último mes desde Tiingo API
- `GET /ownedstocks/{user}` - Obtener acciones en propiedad de un usuario
- `POST /admin/create` - Crear nuevas acciones en catálogo (solo admin)

#### **TransactionController** (`/api/transaction`)
- `GET /all?username=X` - Obtener todas las transacciones de un usuario
- `POST /verify-visa` - Verificar número de tarjeta VISA (algoritmo de Luhn)
- `POST /buy` - Comprar acciones (lógica compleja: verificar existencia, actualizar cantidad, crear transacción)
- `POST /sell` - Vender acciones (actualizar cantidad, eliminar si llega a 0, crear transacción)
- `POST /transfer` - Transferir acciones entre usuarios (actualizar ambos portafolios + envío de email)

#### **ContactFormController** (`/api/contact`)
- `GET /all` - Obtener formularios de contacto
- `POST /add` - Crear formulario de contacto
- `POST /delete` - Resolver formulario (envía email de resolución)

---

## 3. DEFINICIONES DE TIPOS DE PRUEBA

El equipo de desarrollo debe implementar al menos los siguientes tipos de pruebas:

### 3.1. Pruebas de Carga (Load Testing)
Verificar que la aplicación soporta la **carga esperada de usuarios concurrentes** realizando operaciones típicas de trading, cumpliendo con los tiempos de respuesta definidos.

### 3.2. Pruebas de Estrés (Stress Testing)
Incrementar la carga por encima de los niveles esperados para identificar el **punto de quiebre** del sistema y observar su comportamiento cuando recursos críticos (pool de conexiones, CPU, memoria) se saturan.

### 3.3. Pruebas de Condiciones de Carrera (Race Condition Testing)
Simular operaciones concurrentes sobre los **mismos recursos** (compra/venta de la misma acción, transferencias simultáneas) para identificar inconsistencias de datos o deadlocks.

### 3.4. Pruebas de Estabilidad (Soak Testing)
Aplicar una carga moderada durante un periodo prolongado (2-4 horas) para detectar **fugas de memoria, degradación de rendimiento o errores acumulativos**, especialmente relacionados con:
- Conexiones de base de datos no cerradas
- Timeout de llamadas externas (Tiingo API)
- Acumulación de colas de email

---

## 4. MÉTRICAS Y CRITERIOS DE ACEPTACIÓN

El equipo debe definir, documentar y probar **como mínimo** las siguientes métricas:

### 4.1. Tiempo de Respuesta (Latencia)

Definir y cumplir con SLAs para operaciones críticas:

| Endpoint | Tiempo máximo aceptable (P95) | Tiempo máximo crítico (P99) |
|----------|-------------------------------|----------------------------|
| `POST /api/transaction/buy` | < 1.5 segundos | < 3 segundos |
| `POST /api/transaction/sell` | < 1.5 segundos | < 3 segundos |
| `POST /api/transaction/transfer` | < 3 segundos | < 5 segundos |
| `GET /api/stock/{ticker}` | < 2 segundos | < 4 segundos |
| `POST /api/user/register` | < 3 segundos | < 6 segundos |
| `POST /api/user/login` | < 1 segundo | < 2 segundos |
| `GET /api/transaction/all` | < 2 segundos | < 4 segundos |

### 4.2. Throughput (Peticiones por Segundo)

El sistema debe soportar **al menos**:
* **100 peticiones/segundo** en operaciones de lectura (`GET /api/stock/all`, `GET /api/stock/ownedstocks/{user}`)
* **50 transacciones/segundo** en operaciones de escritura combinadas (buy + sell + transfer)
* **30 registros/segundo** en operaciones que implican envío de email (`POST /api/user/register`, `POST /api/transaction/transfer`)

### 4.3. Uso de Recursos

Monitorear y documentar bajo carga esperada y máxima:

* **CPU:** No debe superar el 80% sostenido en carga esperada
* **Memoria:** Uso de heap JVM (debe estabilizarse sin crecimiento continuo)
* **Pool de conexiones a BD:** Número de conexiones activas vs. disponibles
* **Threads:** Uso de threads del servidor de aplicaciones
* **Latencia de red:** Tiempo de respuesta de Tiingo API y servicio SMTP

### 4.4. Tasa de Errores

* **Carga esperada:** Error rate < 0.5% (errores HTTP 4xx/5xx)
* **Carga pico:** Error rate < 2%
* **Punto de quiebre:** Documentar error rate en momento de colapso

### 4.5. Consistencia de Datos

Verificar después de pruebas de estrés:
* No hay transacciones duplicadas
* Cantidades de acciones (`quantity`) en `OwnedStock` son consistentes con suma/resta de transacciones
* No hay acciones con `quantity <= 0` en la tabla `OwnedStock`
* Todas las transferencias tienen emisor y receptor correctamente registrados

---

## 5. REQUERIMIENTOS TÉCNICOS PARA LAS PRUEBAS

### 5.1. Herramientas de Prueba

El equipo debe utilizar **al menos una** de las siguientes herramientas:

* **JMeter** (recomendado para Spring Boot)
* **Gatling** (recomendado para reportes visuales)
* **k6** (recomendado para scripts en JavaScript)
* **Locust** (recomendado para scripts en Python)

**Justificación:** Herramientas ampliamente utilizadas con soporte para HTTP REST, generación de reportes y capacidad de simular miles de usuarios concurrentes.

### 5.2. Ambiente de Prueba

El ambiente debe ser **lo más similar posible a producción**:

#### Configuración del Servidor de Aplicaciones:
* **JVM Heap Size:** Documentar el valor usado (ej: `-Xmx2g -Xms1g`)
* **Garbage Collector:** Documentar el GC utilizado (ej: G1GC, ZGC)
* **Pool de Conexiones:** Configurar HikariCP con valores específicos:
  ```properties
  spring.datasource.hikari.maximum-pool-size=20
  spring.datasource.hikari.minimum-idle=5
  spring.datasource.hikari.connection-timeout=30000
  ```
* **Threads del servidor:** Documentar configuración de Tomcat embebido

#### Base de Datos:
* PostgreSQL con configuración de conexiones máximas documentada
* Base de datos con **datos representativos**:
  * Mínimo **1,000 usuarios**
  * Mínimo **50 acciones** en catálogo
  * Mínimo **10,000 transacciones** históricas
  * Distribución realista de `OwnedStock` (algunos usuarios con muchas acciones, otros con pocas)

#### Infraestructura:
* Documentar CPU, RAM, y sistema operativo del servidor de pruebas
* **Importante:** Servicio de email y Tiingo API deben estar disponibles o mockeados adecuadamente

### 5.3. Datos de Prueba

El equipo debe:

1. Proveer **scripts de carga masiva de datos** (SQL o scripts Java) para poblar:
   * Tabla `stockuser` con 1,000+ usuarios
   * Tabla `stock` con 50+ acciones (tickers reales: AAPL, GOOGL, TSLA, etc.)
   * Tabla `ownedstock` con distribución variada por usuario
   * Tabla `transaction` con historial de 10,000+ transacciones

2. Documentar cómo generar usuarios de prueba con passwords hasheados (BCrypt)

3. Incluir scripts de limpieza para resetear el ambiente entre pruebas

---

## 6. CASOS DE PRUEBA MÍNIMOS REQUERIDOS

A continuación se detallan **5 escenarios obligatorios** de pruebas de carga y estrés que el equipo debe implementar.

---

### CASO DE PRUEBA 1: Carga Normal de Operaciones de Trading

#### Objetivo:
Validar que el sistema soporta la carga de usuarios concurrentes realizando operaciones típicas de trading durante horario de mercado activo.

#### Descripción del Escenario:
Simular **100 usuarios concurrentes** durante **30 minutos** realizando el siguiente flujo:

1. Login (`POST /api/user/login`)
2. Consultar catálogo de acciones (`GET /api/stock/all`)
3. Consultar precio actual de 3 acciones diferentes (`GET /api/stock/{ticker}`)
4. Consultar portafolio propio (`GET /api/stock/ownedstocks/{user}`)
5. Realizar 1 operación aleatoria:
   * 60% probabilidad: Comprar acciones (`POST /api/transaction/buy`)
   * 30% probabilidad: Vender acciones (`POST /api/transaction/sell`)
   * 10% probabilidad: Transferir acciones (`POST /api/transaction/transfer`)
6. Consultar historial de transacciones (`GET /api/transaction/all`)
7. Pausa de 10-30 segundos (think time)
8. Repetir ciclo

#### Parámetros de Ejecución:
* **Usuarios concurrentes:** 100
* **Ramp-up time:** 5 minutos (20 usuarios nuevos/minuto)
* **Duración:** 30 minutos en carga sostenida
* **Think time:** 10-30 segundos entre operaciones

#### Métricas a Capturar:
* Tiempo de respuesta promedio, P90, P95, P99 por endpoint
* Throughput (peticiones/segundo) sostenido
* Uso de CPU y memoria del servidor
* Número de conexiones activas a base de datos
* Tasa de errores (debe ser < 0.5%)

#### Criterios de Aceptación:
* ✅ Todos los endpoints responden dentro del SLA definido (P95 < límites de sección 4.1)
* ✅ Error rate < 0.5%
* ✅ Uso de CPU < 80% sostenido
* ✅ No hay fugas de conexiones de BD (pool estable)
* ✅ Consistencia de datos: Suma de transacciones = cantidad en `OwnedStock`

#### Entregables:
* Script de JMeter/Gatling/k6 documentado
* Reporte con gráficas de latencia, throughput y uso de recursos
* Capturas de pantalla de métricas clave

---

### CASO DE PRUEBA 2: Prueba de Estrés en Operaciones de Compra/Venta

#### Objetivo:
Determinar el **punto de quiebre** del sistema cuando múltiples usuarios realizan transacciones de compra y venta de forma masiva y concurrente.

#### Descripción del Escenario:
Incrementar progresivamente la carga de usuarios realizando **únicamente operaciones de compra y venta** (las más críticas) hasta que el sistema colapse.

**Fases de incremento:**
1. **Fase 1:** 50 usuarios concurrentes durante 5 minutos
2. **Fase 2:** 100 usuarios concurrentes durante 5 minutos
3. **Fase 3:** 200 usuarios concurrentes durante 5 minutos
4. **Fase 4:** 400 usuarios concurrentes durante 5 minutos
5. **Fase 5:** Incrementar de 50 en 50 hasta observar colapso

**Flujo por usuario:**
1. Comprar acción aleatoria (`POST /api/transaction/buy`)
2. Pausa 2 segundos
3. Vender acción aleatoria (`POST /api/transaction/sell`)
4. Pausa 2 segundos
5. Repetir

#### Parámetros de Ejecución:
* **Ramp-up:** Escalonado según fases (50, 100, 200, 400...)
* **Think time:** 2 segundos (carga intensiva)
* **Duración por fase:** 5 minutos
* **Criterio de colapso:** Error rate > 10% o latencia P95 > 10 segundos

#### Métricas a Capturar:
* Latencia P95/P99 por fase
* Throughput de transacciones/segundo por fase
* Uso de CPU, memoria, y pool de conexiones por fase
* Tasa de errores por fase
* **Punto de quiebre:** Número de usuarios concurrentes donde el sistema colapsa

#### Criterios de Aceptación:
* ✅ Documentar el punto de quiebre con evidencia (gráficas, logs)
* ✅ Identificar la causa del colapso (CPU saturada, pool de conexiones agotado, deadlocks, etc.)
* ✅ Después de reducir carga, el sistema debe recuperarse sin reinicio manual
* ✅ No debe haber inconsistencias en BD después de la prueba (verificar `OwnedStock` vs `Transaction`)

#### Entregables:
* Script de prueba con fases de incremento
* Gráfica de latencia vs. número de usuarios
* Gráfica de throughput vs. número de usuarios
* Gráfica de uso de recursos vs. número de usuarios
* Análisis de causa raíz del colapso
* Propuestas de mejora (ej: aumentar pool de conexiones, optimizar queries, caching)

---

### CASO DE PRUEBA 3: Condiciones de Carrera en Transferencias

#### Objetivo:
Identificar **condiciones de carrera** cuando múltiples usuarios realizan transferencias de acciones simultáneas sobre los mismos recursos.

#### Descripción del Escenario:
Simular **50 pares de usuarios** (100 usuarios totales) donde cada par realiza **transferencias concurrentes** de la misma acción entre ellos durante **15 minutos**.

**Flujo por par de usuarios (Usuario A ↔ Usuario B):**
1. Usuario A transfiere 10 acciones de AAPL a Usuario B (`POST /api/transaction/transfer`)
2. **Simultáneamente**, Usuario B transfiere 5 acciones de GOOGL a Usuario A
3. Pausa 5 segundos
4. Usuario A consulta su portafolio (`GET /api/stock/ownedstocks/{user}`)
5. Usuario B consulta su portafolio
6. Repetir

**Casos extremos a incluir:**
* Transferir más acciones de las que se posee (debe devolver error)
* Transferencias simultáneas de la misma acción entre A→B y B→A
* Usuario con exactamente 10 acciones transfiere 10 (debe quedar en 0, eliminar `OwnedStock`)

#### Parámetros de Ejecución:
* **Usuarios concurrentes:** 100 (50 pares)
* **Ramp-up:** 2 minutos
* **Duración:** 15 minutos
* **Think time:** 5 segundos

#### Métricas a Capturar:
* Tasa de errores (4xx, 5xx)
* Número de emails enviados (debe coincidir con transferencias exitosas)
* Latencia P95 de `/api/transaction/transfer`
* **Consistencia de datos:** Verificar que:
  * Suma de `quantity` en `OwnedStock` para cada acción se mantiene constante (no se crean ni destruyen acciones)
  * Todas las transacciones de tipo "transfer" tienen `issuer` y `receptor` válidos
  * No hay registros en `OwnedStock` con `quantity <= 0`

#### Criterios de Aceptación:
* ✅ No hay inconsistencias en cantidades de acciones (verificación con queries SQL post-prueba)
* ✅ No hay deadlocks ni timeouts de BD
* ✅ Error rate < 5% (solo errores esperados: "insufficient stocks")
* ✅ 100% de transferencias exitosas tienen email enviado
* ✅ Latencia P95 < 5 segundos

#### Entregables:
* Script de prueba con lógica de pares de usuarios
* Query SQL para validar consistencia de datos
* Reporte de inconsistencias encontradas (si las hay)
* Propuestas de solución (ej: locks optimistas, transacciones atómicas)

---

### CASO DE PRUEBA 4: Carga en Integración Externa (Tiingo API)

#### Objetivo:
Evaluar el impacto de la **latencia de la API externa Tiingo** en el rendimiento del sistema cuando múltiples usuarios consultan precios de acciones simultáneamente.

#### Descripción del Escenario:
Simular **200 usuarios concurrentes** durante **20 minutos** consultando precios actuales e históricos de acciones de forma intensiva.

**Flujo por usuario:**
1. Consultar precio actual de 5 acciones diferentes (`GET /api/stock/{ticker}`)
2. Consultar datos históricos del último mes de 2 acciones (`GET /api/stock/{ticker}/month`)
3. Pausa 3 segundos
4. Repetir

**Variante de prueba:**
* **Subcaso A:** Todos los usuarios consultan las mismas 5 acciones (AAPL, GOOGL, TSLA, MSFT, AMZN) → Evaluar beneficio de caching
* **Subcaso B:** Usuarios consultan acciones aleatorias de las 50 disponibles → Sin beneficio de caching

#### Parámetros de Ejecución:
* **Usuarios concurrentes:** 200
* **Ramp-up:** 3 minutos
* **Duración:** 20 minutos
* **Think time:** 3 segundos

#### Métricas a Capturar:
* Latencia P95/P99 de endpoints que llaman a Tiingo API
* **Separar tiempo de respuesta:** Tiempo en backend vs. tiempo en Tiingo API (requiere logging de tiempos)
* Throughput de peticiones a Tiingo API
* Tasa de errores de Tiingo API (timeouts, 429 rate limit, 5xx)
* Uso de threads del servidor (pueden bloquearse esperando respuesta de Tiingo)

#### Criterios de Aceptación:
* ✅ Latencia P95 < 4 segundos (incluyendo Tiingo)
* ✅ Error rate < 5% (tolerancia a fallos de API externa)
* ✅ Documentar latencia promedio de Tiingo API
* ✅ Si error rate > 5%, implementar estrategia de fallback (ej: cache de precios, mensaje de error amigable)

#### Entregables:
* Script de prueba con ambos subcasos (A y B)
* Gráfica comparativa de latencia con vs. sin caching (si se implementa)
* Análisis de dependencia del sistema en API externa
* Propuestas de mejora:
  * Implementar caching con TTL (ej: 30 segundos para precios, 1 hora para histórico)
  * Implementar circuit breaker (Spring Cloud Circuit Breaker)
  * Timeout configurado en `RestTemplate` (actualmente no visible)

---

### CASO DE PRUEBA 5: Impacto del Servicio de Email en Latencia

#### Objetivo:
Medir el impacto del **envío de emails** (operación I/O bloqueante) en la latencia de endpoints críticos y proponer optimización.

#### Descripción del Escenario:
Simular **100 usuarios concurrentes** durante **20 minutos** realizando operaciones que disparan envío de emails:

1. **Registro de nuevos usuarios** (`POST /api/user/register`) → Envía email de confirmación
2. **Transferencias de acciones** (`POST /api/transaction/transfer`) → Envía email al receptor

**Flujo:**
* 50% de usuarios: Realizar registro (envío de email de confirmación)
* 50% de usuarios: Realizar transferencias (envío de email de notificación)

#### Parámetros de Ejecución:
* **Usuarios concurrentes:** 100
* **Ramp-up:** 3 minutos
* **Duración:** 20 minutos
* **Think time:** 5 segundos

#### Métricas a Capturar:
* Latencia P95/P99 de `/api/user/register` y `/api/transaction/transfer`
* **Separar tiempo de respuesta:** Tiempo en lógica de negocio vs. tiempo en envío de email (requiere logging)
* Throughput de operaciones con email
* Uso de threads (pueden bloquearse esperando SMTP)
* **Verificación:** ¿Todos los emails se enviaron? (revisar logs de email service)

#### Criterios de Aceptación:
* ✅ Latencia P95 < 5 segundos para ambos endpoints
* ✅ Error rate < 2%
* ✅ Documentar tiempo promedio de envío de email
* ✅ 100% de operaciones exitosas tienen email enviado (verificar logs)

#### Mejora Propuesta (Implementación Opcional):
Si la latencia > 5 segundos, implementar **envío asíncrono de emails**:
* Opción 1: `@Async` de Spring con `ThreadPoolTaskExecutor`
* Opción 2: Cola de mensajes (RabbitMQ, Redis Queue)
* **Validación:** Ejecutar prueba nuevamente y comprobar mejora en latencia

#### Entregables:
* Script de prueba enfocado en operaciones con email
* Comparativa de latencia antes/después de optimización asíncrona (si se implementa)
* Análisis de riesgo: ¿Qué pasa si el email falla pero la operación se completó? (ej: usuario registrado pero sin email de confirmación)
* Propuesta de manejo de errores en envío asíncrono

---

## 7. ENTREGABLES ESPERADOS DEL EQUIPO DE DESARROLLO

El equipo debe entregar **un informe completo** con los siguientes componentes:

### 7.1. Plan de Pruebas de Rendimiento
* Objetivos y alcance de las pruebas
* Tipos de pruebas implementadas (carga, estrés, condiciones de carrera)
* Lista de escenarios de prueba (mínimo los 5 especificados en este documento)
* Métricas y criterios de aceptación
* Cronograma de ejecución de pruebas

### 7.2. Scripts de Prueba
* Archivos de JMeter/Gatling/k6/Locust (.jmx, .scala, .js, .py)
* **README.md** con:
  * Instrucciones de instalación de herramientas
  * Comandos para ejecutar cada escenario
  * Parámetros configurables (usuarios, duración, ramp-up)
* Scripts de carga de datos de prueba (SQL, scripts Java)

### 7.3. Configuración del Ambiente
* Documento con especificaciones:
  * Hardware del servidor (CPU, RAM, almacenamiento)
  * Configuración de JVM (heap size, GC, flags)
  * Configuración de pool de conexiones (HikariCP)
  * Configuración de Tomcat (threads, timeouts)
  * Configuración de PostgreSQL (conexiones máximas, parámetros de rendimiento)

### 7.4. Informe de Resultados
Para cada caso de prueba:
* **Gráficas:**
  * Latencia (promedio, P90, P95, P99) a lo largo del tiempo
  * Throughput (peticiones/segundo) a lo largo del tiempo
  * Uso de CPU y memoria a lo largo del tiempo
  * Tasa de errores a lo largo del tiempo
* **Tablas de métricas:**
  * Resumen de métricas clave por endpoint
  * Comparativa contra criterios de aceptación
* **Análisis de hallazgos:**
  * Cuellos de botella identificados (ej: "Pool de conexiones agotado en Caso 2")
  * Punto de quiebre del sistema (Caso 2)
  * Condiciones de carrera detectadas (Caso 3)
  * Impacto de servicios externos (Caso 4 y 5)

### 7.5. Propuestas de Mejora
* Lista priorizada de optimizaciones recomendadas, con:
  * **Descripción del problema:** Qué cuello de botella se detectó
  * **Propuesta de solución:** Qué cambio de código/configuración se sugiere
  * **Impacto estimado:** Mejora esperada en métricas (ej: "Reducir latencia P95 de 5s a 2s")
  * **Prioridad:** Alta/Media/Baja

Ejemplos de mejoras comunes:
* Implementar caching de precios de Tiingo API (Redis, Caffeine)
* Envío asíncrono de emails con `@Async` o cola de mensajes
* Aumentar pool de conexiones de BD (actualmente no configurado explícitamente)
* Implementar paginación en `/api/transaction/all` y `/api/stock/all`
* Agregar índices en BD (ej: índice en `ticker` en tabla `ownedstock`)
* Implementar locks optimistas en transferencias para evitar condiciones de carrera
* Configurar timeout en `RestTemplate` para Tiingo API
* Implementar circuit breaker para API externa

### 7.6. Evidencias de Correcciones (Si se implementan mejoras)
Para cada mejora aplicada:
* **Código modificado:** Diff o commit de Git
* **Configuración modificada:** Cambios en `application.properties` o configuración de BD
* **Métricas antes vs. después:**
  * Tabla comparativa de latencia, throughput, error rate
  * Gráficas antes/después de la optimización

---

## 8. CRITERIOS FINALES DE ACEPTACIÓN DEL INFORME

Para que el informe de pruebas sea aceptado, debe cumplir:

* ✅ **Los 5 casos de prueba mínimos** fueron ejecutados y documentados
* ✅ Todos los scripts de prueba están funcionales y reproducibles
* ✅ Se adjuntan gráficas y tablas de resultados reales (no simulados)
* ✅ Se identificaron **al menos 3 cuellos de botella o problemas de rendimiento**
* ✅ Se proponen **soluciones específicas** para los problemas detectados
* ✅ Se validó la **consistencia de datos** después de pruebas de estrés (Caso 3)
* ✅ Se documentó el **punto de quiebre** del sistema (Caso 2)
* ✅ Se analizó el impacto de **servicios externos** (Caso 4 y 5)

---

## 9. RIESGOS CONOCIDOS DEL SISTEMA (Contexto para las Pruebas)

Basado en el análisis estático del código, se identificaron los siguientes riesgos de rendimiento:

### 9.1. Seguridad (Impacto en rendimiento bajo ataque)
* **Spring Security en modo permissive:** Todos los endpoints son públicos
  * **Riesgo:** Ataques de fuerza bruta en login, spam de registros
  * **Prueba recomendada:** Simular 1000 requests/segundo en `/login` y `/register`

### 9.2. Integraciones Externas
* **Tiingo API sin timeout configurado:** Puede causar threads bloqueados indefinidamente
* **Email service síncrono:** Bloquea el thread de respuesta HTTP

### 9.3. Base de Datos
* **No hay paginación:** Endpoints `/api/transaction/all` y `/api/stock/all` devuelven todos los registros
  * **Riesgo:** Usuario con 10,000 transacciones causa OOM
* **Pool de conexiones no configurado explícitamente:** Puede agotarse bajo carga
* **Falta de índices:** No se evidencian índices en columnas clave como `ticker`, `username`

### 9.4. Condiciones de Carrera
* **Transferencias:** Operación en dos fases (decrementar emisor + incrementar receptor) sin lock
  * **Riesgo:** Transferencias concurrentes pueden causar inconsistencia
* **Compra/Venta:** Verificación de existencia y actualización no son atómicas

### 9.5. Manejo de Errores
* **Excepciones genéricas:** `catch (Exception e)` sin manejo específico
* **No hay validación de entrada:** Posibilidad de SQL injection (aunque JPA mitiga en parte)

---

## 10. RECOMENDACIONES ADICIONALES

### 10.1. Monitoreo en Producción
Después de las pruebas, implementar:
* **APM (Application Performance Monitoring):** ej: Spring Boot Actuator + Prometheus + Grafana
* **Logging estructurado:** ej: Logback con formato JSON
* **Alertas:** Configurar alertas para latencia P95 > SLA, error rate > 1%, CPU > 80%

### 10.2. Estrategia de Caché
Implementar caching en:
* Precios de acciones de Tiingo API (TTL: 30 segundos - 1 minuto)
* Catálogo de acciones (`GET /api/stock/all`) (TTL: 1 hora)
* Portafolio de usuarios (`GET /api/stock/ownedstocks/{user}`) (invalidar al realizar transacción)

### 10.3. Optimización de Base de Datos
* Crear índices en:
  * `stockuser.username`
  * `stockuser.email`
  * `ownedstock.ticker`
  * `transaction.issuer_id`, `transaction.receptor_id`
* Implementar paginación en endpoints que devuelven colecciones grandes
* Considerar uso de DTOs de proyección para evitar cargar entidades completas

---

## 11. CONTACTO Y SOPORTE

Para dudas sobre este documento o los requerimientos de pruebas:

* **Equipo solicitante:** [Insertar nombre del equipo]
* **Fecha de entrega esperada:** [Insertar fecha]
* **Formato de entrega:** Repositorio Git con informe en Markdown + scripts en carpeta `/performance-tests`

---

**Versión del documento:** 1.0
**Fecha:** Diciembre 2025
**Elaborado por:** Equipo de Aseguramiento de Calidad
