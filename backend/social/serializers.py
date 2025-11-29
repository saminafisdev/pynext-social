from os import read
from attr import fields
import cloudinary
from rest_framework import serializers

from core.serializers import UserSerializer
from .models import Bookmark, Post, PostImage, Profile, PostLike, Comment


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ("id", "user", "bio", "is_owner", "profile_picture", "cover_photo")

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


class PostImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PostImage
        fields = ["id", "url", "width", "height"]

    def get_url(self, obj):
        return obj.image.url


class PostSerializer(serializers.ModelSerializer):
    author = ProfileSerializer(read_only=True)
    images = PostImageSerializer(many=True, required=False)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    has_liked = serializers.BooleanField(read_only=True)
    is_owner = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "content",
            "images",
            "has_liked",
            "likes_count",
            "is_owner",
            "is_bookmarked",
            "edited",
            "comments_count",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "author",
            "has_liked",
            "likes_count",
            "is_owner",
            "is_bookmarked",
            "edited",
            "comments_count",
            "created_at",
            "updated_at",
        )

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request.user.is_authenticated and obj.author.user == request.user

    def get_is_bookmarked(self, obj):
        if hasattr(obj, "is_bookmarked"):
            return obj.is_bookmarked
        return False

    def validate(self, data):
        """
        Check that a post contains either text content, an image, or both.
        """
        content = data.get("content")
        text_content = content.strip() if content else None

        images = self.context["request"].FILES.getlist("images")

        # Check if both are empty/null
        if not text_content and len(images) == 0:
            raise serializers.ValidationError(
                "A post must contain either text content, an image, or both."
            )

        return data

    def create(self, validated_data):
        profile = self.context["request"].user.profile
        validated_data["author"] = profile
        uploaded_images = self.context["request"].FILES.getlist("images")
        post = super().create(validated_data)
        for image_data in uploaded_images:
            print(image_data)
            # Upload manually to Cloudinary to get metadata
            upload = cloudinary.uploader.upload(image_data, folder="post_images")

            PostImage.objects.create(
                post=post,
                image=upload["public_id"],
                width=upload["width"],
                height=upload["height"],
            )

        return post


class BookmarkSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    post_id = serializers.PrimaryKeyRelatedField(
        queryset=Post.objects.all(),  # Ensures the ID refers to a real Post
        source="post",  # Tells DRF to save this value to the 'post' model field
        write_only=True,  # Ensures this field is ONLY used for input
    )

    class Meta:
        model = Bookmark
        fields = ("id", "post", "post_id", "created_at")
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["profile"] = user.profile
        return super().create(validated_data)
