import django_filters
from .models import Post
from django.contrib.auth import get_user_model

User = get_user_model()


class PostFilter(django_filters.FilterSet):
    # filter by Profile PK
    author = django_filters.NumberFilter(field_name="author__pk", lookup_expr="exact")

    # filter by Profile id list: ?author__in=1,2,3
    author__in = django_filters.BaseInFilter(field_name="author__pk", lookup_expr="in")

    # filter by related User.username: ?author_username=john
    author_username = django_filters.CharFilter(
        field_name="author__user__username", lookup_expr="iexact"
    )

    # filter by partial username match: ?author_username__icontains=john
    author_username__icontains = django_filters.CharFilter(
        field_name="author__user__username", lookup_expr="icontains"
    )

    class Meta:
        model = Post
        fields = [
            "author",  # exact profile id
            "author__in",  # list of profile ids
            "author_username",  # exact username (case-insensitive)
            "author_username__icontains",
        ]
