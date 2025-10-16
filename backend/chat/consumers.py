import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db.models import Subquery, OuterRef, F, Value, Prefetch
from django.db.models.functions import Concat

from chat.serializers import (
    ChatListSerializer,
    ChatMessageSerializer,
    ChatSerializer,
    SimpleChatSerializer,
)
from chat.models import Chat, ChatMessage, ChatParticipant

from social.models import Profile

User = get_user_model()


@database_sync_to_async
def get_profile(user):
    return user.profile


@database_sync_to_async
def get_participant(chat_id, profile_id):
    return ChatParticipant.objects.get(chat_id=chat_id, profile_id=profile_id)


@database_sync_to_async
def get_chat(chat_id, profile_id):
    other_profile_id = (
        ChatParticipant.objects.filter(chat_id=chat_id)
        .exclude(profile_id=profile_id)
        .values("profile_id")
    )

    other_user = (
        Profile.objects.filter(id=Subquery(other_profile_id))
        .annotate(
            full_name=Concat(F("user__first_name"), Value(" "), F("user__last_name"))
        )
        .values("full_name")
    )

    return (
        Chat.objects.filter(pk=chat_id, participants__profile=profile_id)
        .annotate(other_user=Subquery(other_user))
        .first()
    )


def serialize_chats(chats_qs, context):
    return SimpleChatSerializer(chats_qs, many=True, context=context).data


class ChatListConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close(code=4001)
            return

        await self.accept()

        self.profile = await get_profile(self.user)

        chats = await self.get_chat_list()
        serialized_chats = ChatListSerializer(
            chats, many=True, context={"self_profile": self.profile}
        ).data

        await self.send(
            text_data=json.dumps({"type": "chats_list", "chats": serialized_chats})
        )

    @database_sync_to_async
    def get_chat_list(self):
        participants_qs = ChatParticipant.objects.exclude(
            profile=self.profile
        ).select_related("profile", "profile__user")

        chats_qs = Chat.objects.filter(
            participants__profile=self.profile
        ).prefetch_related(
            Prefetch(
                "participants", queryset=participants_qs, to_attr="other_participants"
            )
        )
        return list(chats_qs)


class ChatDetailConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.user = self.scope["user"]
        self.profile = await get_profile(self.user)
        self.participant = await get_participant(self.chat_id, self.profile.id)

        # Reject unauthenticated users
        if not self.user.is_authenticated:
            await self.close(code=4001)
            return

        # ✅ Check if the chat exists and user is a participant
        chat = await get_chat(self.chat_id, self.profile.id)

        if not chat:
            # Close connection with a specific reason code (optional)
            await self.close(code=4004)  # Not Found / Unauthorized
            return

        # ✅ Safe to join group now
        self.user_group = f"chat_{self.chat_id}"
        await self.channel_layer.group_add(self.user_group, self.channel_name)
        await self.accept()

        # Send initial messages
        print(chat.other_user)
        serialized_messages = await self.get_chat_messages(self.chat_id)
        chat_serializer = await sync_to_async(ChatSerializer)(chat)

        await self.send(
            text_data=json.dumps(
                {
                    "type": "initial_messages",
                    "chat": chat_serializer.data,
                    "messages": serialized_messages,
                }
            )
        )

    async def disconnect(self, close_code):
        if hasattr(self, "user_group"):
            await self.channel_layer.group_discard(self.user_group, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        new_message = await database_sync_to_async(ChatMessage.objects.create)(
            content=message, sender=self.participant, chat_id=self.chat_id
        )
        full_message = await database_sync_to_async(
            lambda: ChatMessage.objects.select_related("sender__profile__user").get(
                pk=new_message.pk
            )
        )()
        serializer = await sync_to_async(ChatMessageSerializer)(full_message)
        serialized_message = serializer.data

        # Send message to room group
        await self.channel_layer.group_send(
            self.user_group, {"type": "chat.message", "message": serialized_message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(
            text_data=json.dumps({"type": "new_message", "message": message})
        )

    @database_sync_to_async
    def get_chat_messages(self, chat_id):
        messages = ChatMessage.objects.filter(chat_id=chat_id)
        return ChatMessageSerializer(messages, many=True).data
