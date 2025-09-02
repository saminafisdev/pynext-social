from os import read
from rest_framework import serializers
from .models import Post, Profile, Like, Comment


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("id", "user", "bio")
        # read_only_fields = ("id",)


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ("id", "profile", "created_at")
        # read_only_fields = ("id", "created_at")


class CommentSerializer(serializers.ModelSerializer):
    author = ProfileSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "author", "content", "created_at", "updated_at")
        # read_only_fields = ("id", "created_at", "updated_at", "author")


class PostSerializer(serializers.ModelSerializer):
    author = ProfileSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "content",
            "likes_count",
            "comments_count",
            "created_at",
            "updated_at",
        )
        # read_only_fields = (
        #     "id",
        #     "created_at",
        #     "updated_at",
        #     "likes_count",
        #     "comments_count",
        #     "author",
        # )

    def create(self, validated_data):
        profile = self.context["request"].user.profile
        validated_data["author"] = profile
        return super().create(validated_data)
