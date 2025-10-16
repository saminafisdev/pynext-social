from django.db.models import Count, Exists, OuterRef
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .filters import PostFilter

from .permissions import IsAuthorOrReadOnly, IsPostLikeOwner, IsProfileOwnerOrReadOnly
from .models import Comment, PostLike, Post, Profile
from .serializers import (
    CommentSerializer,
    LikeSerializer,
    PostSerializer,
    ProfileSerializer,
)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.select_related("user").all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated, IsProfileOwnerOrReadOnly]
    lookup_field = "username"
    lookup_url_kwarg = "username"
    lookup_value_regex = r"[\w.@+-]+"
    http_method_names = ["get", "put", "patch", "head", "options"]

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path="current",
    )
    def me(self, request, pk=None):
        profile = request.user.profile
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    def get_object(self):
        username = self.kwargs.get(self.lookup_url_kwarg or self.lookup_field)
        return self.queryset.get(user__username=username)


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def toggle_like(self, request, pk=None):
        post = self.get_object()
        profile = request.user.profile

        like, created = PostLike.objects.get_or_create(post=post, profile=profile)

        if not created:
            like.delete()
            return Response({"has_liked": False}, status=status.HTTP_200_OK)

        return Response({"has_liked": True}, status=status.HTTP_200_OK)

    def get_queryset(self):
        qs = PostLike.objects.filter(
            post=OuterRef("pk"), profile=self.request.user.profile
        )
        return (
            Post.objects.annotate(
                likes_count=Count("likes", distinct=True),
                comments_count=Count("comments", distinct=True),
                has_liked=Exists(qs),
            )
            .select_related("author__user")
            .order_by("-created_at")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs.get("post_pk")
        return (
            Comment.objects.select_related("author")
            .order_by("-created_at")
            .filter(post_id=post_id)
        )

    def perform_create(self, serializer):
        post_id = self.kwargs.get("post_pk")
        serializer.save(author=self.request.user.profile, post_id=post_id)


class PostLikeViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated, IsPostLikeOwner]

    def get_queryset(self):
        post_id = self.kwargs.get("post_pk")
        return PostLike.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs.get("post_pk")
        serializer.save(profile=self.request.user.profile, post_id=post_id)
