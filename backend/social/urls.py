from django.urls import include, path
from rest_framework_nested import routers

from .views import CommentViewSet, PostLikeViewSet, PostViewSet

router = routers.SimpleRouter()
router.register(r"posts", PostViewSet)

posts_router = routers.NestedSimpleRouter(router, r"posts", lookup="post")
posts_router.register(r"comments", CommentViewSet, basename="comment")
posts_router.register(r"likes", PostLikeViewSet, basename="like")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(posts_router.urls)),
]
