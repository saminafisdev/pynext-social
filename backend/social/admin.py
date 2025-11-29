from django.contrib import admin
from .models import PostImage, Profile, Post, Comment, PostLike

admin.site.register(Profile)
admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(Comment)
admin.site.register(PostLike)
