
# Tutorial para correr el proyecto 



#   Paso 1

Descargar postgreSQL y crear usuario.

# Paso 2

**Crear base de datos del proyecto:** correr este comando en la terminal (estando dentro de psql).

```
CREATE DATABASE kapatortas_debug;

```


#   Paso 3

Clonar este repositorio

# Paso 4

Descargar archivo secrets.json.

Agregar archivo secrets.json en la carpeta KapaTortasBackend.

Modificar archivo secrets.json, poniendo usuario y contraseña de postgreSQL en los campos requeridos.

# Paso 5

**Activar entorno virtual:** python tiene una metodología de manejo de paquetes llamada 'entorno virtual'. Básicamente, en la carpeta 'dependencies' están todas las dependencias del proyecto, por tanto, para que el proyecto funcione, el entorno virtual debe estar activado. Para activarlo, usan el siguiente comando (al nivel de la carpeta KapaTortasBackend).

```
source dependencies/bin/activate
```
**Sabrán que el entorno virtual está activo si en el CLI aparece la palabra 'dependencies'.**

# Paso 6

Correr migraciones del proyecto. Ejecutar este comando al nivel del archivo manage.py (carpeta KapatortasBackend)

```
python manage.py migrate
```



# Paso Final

Después de haber hecho todo lo anterior, para correr el proyecto, las próximas veces solo necesitarán tener el entorno virtual activo y correr el siguiente comando (al nivel de la carpeta KapaTortasBackend):

```
python manage.py runserver
```



# Crear super usuario

En django a los administradores se les llama super users. Los super usuarios tienen la capacidad de acceder al CRM con nombre completo y contraseña.

Para crear un super usuario corren el siguiente comando en la terminal al nivel del archivo manage.py y con el entorno virtual activo:

```
python manage.py createsuperuser
```

Eso les abrira un formulario en la terminal para crear un super usuario


# Acceder al administrador

Cuando tengan el proyecto corriendo, entran al link del proyecto, que normalmente es ...

```
http://127.0.0.1:8000/
```

Y agregan 'admin' al final, quedaria algo asi ...

```
http://127.0.0.1:8000/admin

```
