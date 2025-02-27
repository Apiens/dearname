from .common import *

# INSTALLED_APPS += ["debug_toolbar"]

# MIDDLEWARE = [
#     "debug_toolbar.middleware.DebugToolbarMiddleware",
# ] + MIDDLEWARE

INTERNAL_IPS = ["127.0.0.1"]

# CORS_ORIGIN_WHITELIST = ["http://localhost:3000"]
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
# ]

CORS_ALLOW_ALL_ORIGINS = True

INSTALLED_APPS += [
    "django_extensions",
]