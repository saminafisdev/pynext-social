from django.db import models

from social.models import Profile


class Chat(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)


class ChatParticipant(models.Model):
    chat = models.ForeignKey(
        Chat, related_name="participants", on_delete=models.CASCADE
    )
    profile = models.ForeignKey(Profile, related_name="chats", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.profile.user.username} in {self.chat}"

    class Meta:
        unique_together = ["chat", "profile"]


class ChatMessage(models.Model):
    content = models.TextField()
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(
        ChatParticipant,
        related_name="sent_messages",
        on_delete=models.SET_NULL,
        null=True,
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
