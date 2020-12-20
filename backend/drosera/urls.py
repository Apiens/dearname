from django.urls import path
from . import views

urlpatterns = [
    path("api/posts/", views.PostListCreateView.as_view()),
    path("api/posts/<int:pk>/", views.PostRetrieveUpdateDestroyView.as_view()),
    path("api/posts/<int:post_id>/photos", views.PhotoListCreateView.as_view()),
    path("api/posts/<int:post_id>/comments", views.CommentListCreateView.as_view()),
]
