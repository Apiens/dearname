from django.urls import path
from . import views

urlpatterns = [
    path("api/posts/", views.PostListCreateView.as_view()),
    path("api/posts/<int:pk>/", views.PostRetrieveUpdateDestroyView.as_view()),
    path("api/posts/<int:post_id>/photos/", views.PhotoListCreateView.as_view()),
    path("api/posts/<int:post_id>/comments/", views.CommentListCreateView.as_view()),
    path("api/posts/<int:post_id>/like/", views.PostLikeCreateDestroyView.as_view()),
    path("api/comments/<int:pk>/", views.CommentDestroyAPIView.as_view()),
    path("api/predict/", views.PredictSpeciesAPIView.as_view()),
    path("api/bird_dict", views.BirdDictAPIView.as_view()), # for suggestion and search in create post.
    path("api/bird_dict2", views.BirdDict2APIView.as_view()), # for search in mycollection.
    path("api/mycollection", views.MyCollectionView.as_view()),
]
