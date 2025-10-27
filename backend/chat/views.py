from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import Value, F, Q
from django.db.models.functions import Concat
from django.http.request import HttpRequest
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import ChatSerializer
from social.serializers import ProfileSerializer

from .models import Chat, ChatMessage, ChatParticipant
from social.models import Profile


def search_chats(user, query):
    current_profile = user.profile

    return (
        Chat.objects.filter(participants__profile=current_profile)
        .filter(
            Q(participants__profile__user__first_name__icontains=query)
            | Q(participants__profile__user__last_name__icontains=query)
        )
        .annotate(
            other_user=Concat(
                F("participants__profile__user__first_name"),
                Value(" "),
                F("participants__profile__user__last_name"),
            )
        )
        .distinct()
    )


def search_unmessaged_profiles(user, query):
    current_profile = user.profile

    # All profiles user has already chatted with
    profile_chats = Chat.objects.filter(participants__profile=current_profile)
    chatted_profiles = Profile.objects.filter(chats__chat__in=profile_chats).distinct()

    # Build a combined full name annotation
    annotated_profiles = Profile.objects.annotate(
        full_name_concat=Concat(F("user__first_name"), Value(" "), F("user__last_name"))
    )

    # Find others whose concatenated name matches the query, excluding self + chatted profiles
    unmessaged_profiles = (
        annotated_profiles.filter(full_name_concat__icontains=query)
        .exclude(id__in=chatted_profiles.values_list("id", flat=True))
        .exclude(id=current_profile.id)
    )

    return unmessaged_profiles


def search_people_and_chats(user, query):
    chats = search_chats(user, query)
    unmessaged_profiles = search_unmessaged_profiles(user, query)
    return {"chats": chats, "suggested_profiles": unmessaged_profiles}


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_conversations(request):
    query = request.query_params.get("q", "").strip()
    if not query:
        return Response({"chats": [], "suggested_profiles": []})

    data = search_people_and_chats(request.user, query)

    # Serialize both parts
    chats_data = ChatSerializer(
        data["chats"], many=True, context={"request": request}
    ).data
    profiles_data = ProfileSerializer(data["suggested_profiles"], many=True).data

    return Response({"chats": chats_data, "suggested_profiles": profiles_data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request: HttpRequest):
    sender_profile = request.user.profile
    target_profile_id = request.data.get("profile_id")
    content = (request.data.get("content") or "").strip()

    if not content or target_profile_id is None:
        return Response(
            {"detail": "missing content or profile_id"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    target_profile = get_object_or_404(Profile, pk=target_profile_id)
    chat = (
        Chat.objects.filter(participants__profile=sender_profile)
        .filter(participants__profile=target_profile)
        .first()
    )

    if chat is None:
        chat = Chat.objects.create()
        ChatParticipant.objects.bulk_create(
            [
                ChatParticipant(chat=chat, profile=sender_profile),
                ChatParticipant(chat=chat, profile=target_profile),
            ]
        )

    # ensure we have the sender participant instance
    sender_participant = ChatParticipant.objects.get(chat=chat, profile=sender_profile)

    message = ChatMessage.objects.create(
        chat=chat, sender=sender_participant, content=content
    )

    # Channels integration
    channel_layer = get_channel_layer()

    # update chat list UI of all participants in this chat
    all_participants = ChatParticipant.objects.filter(chat=chat).select_related(
        "profile__user"
    )

    for participant in all_participants:
        user_group_name = f"chat_list_{participant.profile.user.id}"

        async_to_sync(channel_layer.group_send)(
            user_group_name, {"type": "chat.list.update", "chat_id": chat.id}
        )

    return Response(
        {"chat_id": chat.id, "message_id": message.id}, status=status.HTTP_201_CREATED
    )
