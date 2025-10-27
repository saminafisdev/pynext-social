import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.django.local")

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from django.core.asgi import get_asgi_application

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

# Import these AFTER Django settings are configured
from chat.auth_middleware import JWTAuthMiddlewareStack
from chat.routing import websocket_urlpatterns

allowed_origins = [
    "https://djsocial.onrender.com",  # backend domain
    "https://djsocial-omega.vercel.app",  # frontend domain
]

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": OriginValidator(
            JWTAuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
            allowed_origins=allowed_origins,
        ),
    }
)
