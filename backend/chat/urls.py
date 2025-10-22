from django.urls import path

from . import views

urlpatterns = [
    path("chats/search/", views.search_conversations, name="chat-search"),
]
