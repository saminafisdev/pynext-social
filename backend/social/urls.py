from django.urls import include, path
from rest_framework_nested import routers

from . import views

router = routers.SimpleRouter()
router.register(r"profiles", views.ProfileViewSet, basename="profile")
router.register(r"posts", views.PostViewSet, basename="post")
router.register(r"bookmarks", views.BookmarkViewSet, basename="bookmark")

posts_router = routers.NestedSimpleRouter(router, r"posts", lookup="post")
posts_router.register(r"comments", views.CommentViewSet, basename="comment")
posts_router.register(r"likes", views.PostLikeViewSet, basename="like")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(posts_router.urls)),
    path("search/", views.search, name="profile-search"),
]
