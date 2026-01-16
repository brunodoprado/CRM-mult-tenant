from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- CONFIGURAÇÕES DJANGO-TENANTS ---
# 1. Apps compartilhados (Schema 'public')
SHARED_APPS = [
    'django_tenants',
    'tenants',  # Seu app que contém o modelo Tenant e Domain

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'users',
]

# 2. Apps por cliente (Schemas individuais)
TENANT_APPS = [
    'django.contrib.auth', # Se os usuários forem isolados por tenant
    'django.contrib.contenttypes',
    
    # Apps de CRM que terão dados isolados por tenant
    'crm',
]

# 3. Junção obrigatória para o Django
INSTALLED_APPS = list(SHARED_APPS) + [app for app in TENANT_APPS if app not in SHARED_APPS]

# 4. Modelos de Tenant
TENANT_MODEL = "tenants.Tenant"
TENANT_DOMAIN_MODEL = "tenants.Domain"

# 5. Router de Banco de Dados
DATABASE_ROUTERS = (
    'django_tenants.routers.TenantSyncRouter',
)

# 6. Configuração de URLs públicas (schema 'public')
# Rotas que não precisam de tenant (signup, login, etc)
PUBLIC_SCHEMA_URLCONF = 'backend.public_urls'

# 7. Usar schema público quando não encontrar tenant para o hostname
SHOW_PUBLIC_IF_NO_TENANT_FOUND = True
# -----------------------------------

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-ioe(+onl*k)2h_$-l^9e5rc#3@j6o3at74pddepl(c2@6641e*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*'] # Recomendado colocar '*' em dev para aceitar subdomínios locais


# Application definition

MIDDLEWARE = [
    'django_tenants.middleware.main.TenantMainMiddleware', # DEVE ser o primeiro
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
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
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend', # Engine específica
        'NAME': 'crm_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


# CORS - Permitir localhost e todos os subdomínios .localhost
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

# Permitir qualquer subdomínio .localhost:5173
CORS_ALLOW_ALL_ORIGINS = True  # Em desenvolvimento, permitir todos os origens

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

AUTH_USER_MODEL = 'users.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'