from django.core.management.base import BaseCommand, CommandError

from chat.models import Chat, ChatMessage, ChatParticipant
from chat.serializers import ChatMessageSerializer, ChatSerializer


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def handle(self, *args, **options):
        chat = Chat.objects.prefetch_related("participants").get(participants=1)
        messages = ChatMessage.objects.select_related("sender__profile__user").filter(
            chat=chat
        )
        print(ChatMessageSerializer(messages, many=True).data)
        # print(
        #     "serializer",
        #     ChatSerializer(chat, context={"profile_id": 1}).data,
        # )

        # self.stdout.write(self.style.SUCCESS('Successfully closed poll "%s"' % poll_id))
