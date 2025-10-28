from django.urls import include, path
from rest_framework_nested import routers

from .views import (
    BookmarkViewSet,
    CommentViewSet,
    PostLikeViewSet,
    PostViewSet,
    ProfileViewSet,
)

router = routers.SimpleRouter()
router.register(r"profiles", ProfileViewSet, basename="profile")
router.register(r"posts", PostViewSet, basename="post")
router.register(r"bookmarks", BookmarkViewSet, basename="bookmark")

posts_router = routers.NestedSimpleRouter(router, r"posts", lookup="post")
posts_router.register(r"comments", CommentViewSet, basename="comment")
posts_router.register(r"likes", PostLikeViewSet, basename="like")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(posts_router.urls)),
]
