from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chats/$", consumers.ChatListConsumer.as_asgi()),
    re_path(r"ws/chats/(?P<chat_id>\d+)/$", consumers.ChatDetailConsumer.as_asgi()),
]
