from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from .serializers import SignupSerializer, SuggestionUserSerializer
from .models import User
from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView, ListAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework import status


class SignupView(CreateAPIView):
    # model = get_user_model() # Q: 이거 왜 하지?
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]  # 별도 설정 안하면 default값으로 설정.


class FollowSuggestionListAPIView(ListAPIView):
    # TODO: suggest follow based on friendlist of socialmedia (Oauth)
    # TODO: add search for follow.
    serializer_class = SuggestionUserSerializer
    queryset = get_user_model().objects.all()


@api_view(["POST"])
def user_follow(request):
    username = request.data["username"]
    user_to_follow = get_object_or_404(
        get_user_model(), username=username, is_active=True
    )
    request.user.following_set.add(user_to_follow)
    user_to_follow.follower_set.add(request.user)
    return Response(status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def user_unfollow(request):
    username = request.data["username"]
    user_to_unfollow = get_object_or_404(
        get_user_model(), username=username, is_active=True
    )
    request.user.following_set.remove(user_to_unfollow)
    user_to_unfollow.follower_set.remove(request.user)
    return Response(status.HTTP_204_NO_CONTENT)