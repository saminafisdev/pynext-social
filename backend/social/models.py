from django.db import models
from django.conf import settings
from django_resized import ResizedImageField
from cloudinary.models import CloudinaryField


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    profile_picture = ResizedImageField(
        size=[600, 600],
        quality=85,
        upload_to="profile_pics/",
        blank=True,
        null=True,
        default="profile_pics/default.jpg",
    )
    cover_photo = ResizedImageField(
        quality=85,
        upload_to="cover_photo/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.user.username


class Post(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    content = models.TextField(
        blank=True,
        null=True,
        help_text="The text content of the post.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    edited = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.pk:
            self.edited = True
        return super().save(*args, **kwargs)


class PostImage(models.Model):
    post = models.ForeignKey(
        Post, related_name="images", null=True, blank=True, on_delete=models.CASCADE
    )
    image = CloudinaryField("post_images")
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Image for Post ID {self.post.id}"


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PostLike(models.Model):
    post = models.ForeignKey(Post, related_name="likes", on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "profile")


class Bookmark(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    profile = models.ForeignKey(
        Profile, related_name="bookmarks", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "profile")
