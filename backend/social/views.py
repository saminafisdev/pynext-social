from django.db.models import Count, Exists, OuterRef
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from .permissions import IsAuthorOrReadOnly
from .models import Comment, PostLike, Post
from .serializers import CommentSerializer, LikeSerializer, PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]

    def get_queryset(self):
        qs = PostLike.objects.filter(
            post=OuterRef("pk"), profile=self.request.user.profile
        )
        return (
            Post.objects.annotate(
                likes_count=Count("likes"),
                comments_count=Count("comments"),
                has_liked=Exists(qs),
            )
            .select_related("author")
            .order_by("-created_at")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrReadOnly]

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

    def get_queryset(self):
        post_id = self.kwargs.get("post_pk")
        return PostLike.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs.get("post_pk")
        serializer.save(profile=self.request.user.profile, post_id=post_id)
