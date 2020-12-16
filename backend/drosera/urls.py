from django.urls import path
from . import views

urlpatterns = [
    path("api/post/", views.PostListCreateView.as_view()),
    path("api/post/<int:pk>/", views.PostRUDView.as_view()),
]
