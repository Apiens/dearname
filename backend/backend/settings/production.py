from .common import *

SECRET_KEY = os.environ["SECRET_KEY"]
JWT_AUTH["JWT_SECRET_KEY"] = SECRET_KEY

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(
    ","
)  # long string->separated by comma->list
print("ALLOWED_HOSTS: ", ALLOWED_HOSTS)

# storing Static&Media files at S3
INSTALLED_APPS += [
    "storages",
]
DEFAULT_FILE_STORAGE = "backend.settings.storages.MediaStorage"
STATICFILES_STORAGE = "backend.settings.storages.StaticStorage"

AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]
AWS_STORAGE_BUCKET_NAME = os.environ["AWS_STORAGE_BUCKET_NAME"]
AWS_QUERYSTRING_AUTH = False

CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOW_ALL_ORIGINS", "https://dearname.app"
).split(",")
print("CORS_ALLOWED_ORIGINS: ", CORS_ALLOWED_ORIGINS)
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000", "dearname.app"
# ]
# CORS_ALLOW_ALL_ORIGINS = True
# CORS_ORIGIN_WHITELIST = ["http://localhost:3000", "https://dearname.app"]

if os.environ.get("ENABLE_EXTENSIONS"):
    INSTALLED_APPS += [
        "django_extensions",
    ]

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("DB_ENGINE", "django.db.backends.postgresql"),
        "USER": os.environ["DB_USER"],
        "PASSWORD": os.environ["DB_PASSWORD"],
        "HOST": os.environ["DB_HOST"],
        "PORT": os.environ.get("DB_PORT", "5432"),
        "NAME": os.environ.get("DB_NAME", "dearname"),
    }
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "level": "ERROR",
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "ERROR",
        }
    },
}