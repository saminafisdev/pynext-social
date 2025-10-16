from django.contrib import admin
from .models import Chat, ChatParticipant, ChatMessage

admin.site.register(Chat)
admin.site.register(ChatParticipant)
admin.site.register(ChatMessage)
