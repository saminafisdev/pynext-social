from os import read
from rest_framework import serializers

from core.serializers import UserSerializer
from .models import Post, Profile, PostLike, Comment


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ("id", "user", "bio", "is_owner")

    def get_is_owner(self, obj):
        request = self.context.get("request", None)
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and obj.user == user)


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = ("id", "profile", "created_at")
        read_only_fields = ("id", "profile", "created_at")


class CommentSerializer(serializers.ModelSerializer):
    author = ProfileSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "author", "content", "created_at", "updated_at")


class PostSerializer(serializers.ModelSerializer):
    author = ProfileSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    has_liked = serializers.BooleanField(read_only=True)
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "content",
            "has_liked",
            "likes_count",
            "is_owner",
            "edited",
            "comments_count",
            "created_at",
            "updated_at",
        )

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request.user.is_authenticated and obj.author.user == request.user

    def create(self, validated_data):
        profile = self.context["request"].user.profile
        validated_data["author"] = profile
        return super().create(validated_data)
