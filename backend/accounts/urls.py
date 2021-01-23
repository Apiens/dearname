from django.urls import path, include
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from . import views

urlpatterns = [
    path("signup/", views.SignupView.as_view(), name="signup"),
    path("token/", obtain_jwt_token),
    path(
        "suggestions",
        views.FollowSuggestionListAPIView.as_view(),
        name="suggestion_user_list",
    ),
    path("follow/", views.user_follow),
    path("unfollow/", views.user_unfollow),
]