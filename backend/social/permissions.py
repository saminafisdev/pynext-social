from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of a post to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to authenticated users,
        # so we'll allow GET, HEAD or OPTIONS requests if the user is authenticated.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the post.
        return obj.author.user == request.user


class IsPostLikeOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a post like to delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Write permissions are only allowed to the owner of the post like.
        return obj.profile.user == request.user
