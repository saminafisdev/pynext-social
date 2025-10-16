import json
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware
from channels.auth import AuthMiddlewareStack
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from urllib.parse import parse_qs


class JWTAuthMiddleware:
    """
    Custom WebSocket Auth Middleware that checks the JWT token in the cookies.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Extract the cookies
        cookies = scope["cookies"]
        access_token = cookies.get("access")
        refresh_token = cookies.get("refresh")

        if access_token and refresh_token:
            try:
                # Try to decode and validate access token
                access_token_obj = AccessToken(access_token)
                user = await self.get_user_from_token(access_token_obj)

                # Attach user to scope if valid
                scope["user"] = user

            except (InvalidToken, TokenError):
                # Handle invalid token
                scope["user"] = AnonymousUser()

        # Call the inner consumer (like the WebSocket handler)
        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user_from_token(self, token):
        """
        Retrieve the user from the token.
        """
        try:
            user_id = token["user_id"]
            return get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            return AnonymousUser()


# This function will allow the middleware to be used in the Channels routing
def JWTAuthMiddlewareStack(inner):
    return CookieMiddleware(JWTAuthMiddleware(inner))
