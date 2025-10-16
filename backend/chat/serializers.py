from rest_framework import serializers

from social.serializers import ProfileSerializer
from .models import Chat, ChatParticipant, ChatMessage


class ChatSerializer(serializers.ModelSerializer):
    other_user = serializers.ReadOnlyField()

    class Meta:
        model = Chat
        fields = ["id", "other_user"]


class ChatParticipantSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = ChatParticipant
        fields = ["id", "profile"]


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = ChatParticipantSerializer()

    class Meta:
        model = ChatMessage
        fields = ["id", "content", "sender", "chat"]


class SimpleChatSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ["id", "name", "image"]

    def get_name(self, obj):
        profile_id = self.context["profile_id"]
        return [
            p.profile.user.full_name
            for p in obj.participants.all()
            if p.profile.id != profile_id
        ][0]

    def get_image(self, obj):
        profile_id = self.context["profile_id"]
        return [
            p.profile.profile_picture.url
            for p in obj.participants.all()
            if p.profile.id != profile_id
        ][0]


class ChatListSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ["id", "other_user"]

    def get_other_user(self, chat):
        # `self.context` will have 'self_profile' to exclude the current user
        self_profile = self.context.get("self_profile")
        # chat.other_participants is already prefetched and excludes current user
        other_participant = (
            chat.other_participants[0] if chat.other_participants else None
        )
        if other_participant:
            return ProfileSerializer(other_participant.profile).data
        return None
