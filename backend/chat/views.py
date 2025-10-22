from django.db.models import Value, F, Q
from django.db.models.functions import Concat

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import ChatSerializer
from social.serializers import ProfileSerializer

from .models import Chat
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
