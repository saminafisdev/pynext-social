from django.db.models import Q, Value
from django.db.models.functions import Concat
import django_filters
from .models import Post, Profile
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


class ProfileFilter(django_filters.FilterSet):
    query = django_filters.CharFilter(
        method="filter_by_username_or_fullname", label="Search by Username or Fullname"
    )

    def filter_by_username_or_fullname(self, queryset, name, value):
        # Match on first name, last name, or concatenated full name
        qs = queryset.annotate(
            _full_name=Concat("user__first_name", Value(" "), "user__last_name")
        )
        return qs.filter(
            Q(user__username__icontains=value)
            | Q(user__first_name__icontains=value)
            | Q(user__last_name__icontains=value)
            | Q(_full_name__icontains=value)
        )

    class Meta:
        model = Profile
        fields = []  # No other default fields, just the `query` field
