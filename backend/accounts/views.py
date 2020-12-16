from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework.permissions import AllowAny
from .serializers import SignupSerializer
from .models import User
from rest_framework.generics import CreateAPIView


class SignupView(CreateAPIView):
    # model = get_user_model() # Q: 이거 왜 하지?
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]  # 별도 설정 안하면 default값으로 설정.
