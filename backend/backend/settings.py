from pathlib import Path
import json
import os

BASE_DIR = Path(__file__).resolve().parent.parent
with open(BASE_DIR / 'secrets.json', 'r') as archivo:
    # Carga el contenido del archivo en un diccionario de Python
    secret_data = json.load(archivo)


# Carpeta base para archivos subidos
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # Carpeta "media" dentro del proyecto
MEDIA_URL = '/media/'  # URL para servir los archivos subidos


SECRET_KEY = secret_data['SECRET_KEY']

# ⚠️ OPTIMIZACIÓN: Cambiar a False en producción
DEBUG = True

# ⚠️ SEGURIDAD: Restringir CORS en producción
CORS_ALLOW_ALL_ORIGINS = True  # Cambiar a False en producción
ALLOWED_HOSTS = ["*"]  # Especificar dominios en producción

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # dominio de tu frontend en desarrollo
    "http://127.0.0.1:3000",
]

#modelo para usuarios

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

PROJECT_APPS = [
    'applications.Perfiles',
    'applications.Clientes',
    'applications.Productos',
    'applications.Ventas'
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    "rest_framework.authtoken"
]
INSTALLED_APPS = THIRD_PARTY_APPS + DJANGO_APPS + PROJECT_APPS
AUTH_USER_MODEL = 'Perfiles.Perfiles'
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Make sure it points to the templates folder
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': secret_data['DATABASE_NAME'],
        'USER': secret_data['DATABASE_USERNAME'],
        'PASSWORD': secret_data['DATABASE_PASSWORD'],
        'HOST': 'localhost',  # o la dirección IP del servidor
        'PORT': '5432',       # por defecto, PostgreSQL usa el puerto 5432

        # 🚀 OPTIMIZACIÓN: Persistent connections (reduce overhead de crear/destruir conexiones)
        'CONN_MAX_AGE': 600,  # 10 minutos - mantiene conexiones abiertas

        # 🚀 OPTIMIZACIÓN: Timeout de conexión
        'OPTIONS': {
            'connect_timeout': 10,  # 10 segundos timeout
        }
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# email config



EMAIL_BACKEND       = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST          = 'smtp.gmail.com'
EMAIL_PORT          = 587
EMAIL_USE_TLS       = True
EMAIL_HOST_USER     = "kapatortas@gmail.com"
EMAIL_HOST_PASSWORD = secret_data['EMAIL_PASSWORD']
DEFAULT_FROM_EMAIL = 'kapatortas@gmail.com'  # El correo electrónico que se usará como remitente por defecto

# GOOGLE CLOUD

GOOGLE_CLIENT_ID = secret_data['GOOGLE_CLOUD_ID']
SOCIAL_SECRET = secret_data["AUTH_SECRET"]
AUTH_GOOGLE_SECRET =  secret_data["AUTH_GOOGLE_SECRET"]

# 🚀 OPTIMIZACIÓN: Logging para pruebas de carga
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{levelname}] {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'performance.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        # Log de queries SQL (solo activar para debugging)
        # 'django.db.backends': {
        #     'handlers': ['console'],
        #     'level': 'DEBUG',
        # },
        'performance': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# 🚀 OPTIMIZACIÓN: Caché (descomentar cuando se instale Redis)
# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.redis.RedisCache',
#         'LOCATION': 'redis://127.0.0.1:6379/1',
#         'OPTIONS': {
#             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
#         },
#         'KEY_PREFIX': 'kapatortas',
#         'TIMEOUT': 300,  # 5 minutos por defecto
#     }
# }

# 🚀 OPTIMIZACIÓN: Celery (descomentar cuando se configure)
# CELERY_BROKER_URL = 'redis://localhost:6379/0'
# CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
# CELERY_ACCEPT_CONTENT = ['json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_SERIALIZER = 'json'
# CELERY_TIMEZONE = TIME_ZONE
