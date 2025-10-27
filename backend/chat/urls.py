from django.urls import path

from . import views

urlpatterns = [
    path("chats/search/", views.search_conversations, name="chat-search"),
    path("chats/new/", views.send_message, name="chat-create"),
]
