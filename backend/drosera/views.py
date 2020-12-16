from django.shortcuts import render
from django.db.models import Q
from django.utils import timezone, timesince
from datetime import timedelta
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from .models import Post
from .serializers import PostSerializer

# from rest_framework.viewsets import ModelViewSet

# Create your views here.

# Post ViewSet 요구사항
# (1): create시 author는 request.user가 되도록 해야함
#      -> perform_create 오버라이드
# (2): relatinal field가 있는 경우 eager loading해줘야 함
#      -> select_related, prefetch_related
# (3): 필터링: 본인 게시물, 팔로우유저 게시물, 7일 이내
#      -> get_queryset 오버라이드
# (4): serializer에서 유저가 like한 포스팅인지 확인해야 하므로 시리얼라이저에 request 정보 필요
#      ->serializer_context["request"]에 request정보 넣어주기
# --- 여기까지 강의에서 제공 ---
# (5): pagination -> paginator class 지정


# class PostViewSet(ModelViewSet):
#     pass


class PostListCreateView(ListCreateAPIView):
    # queryset은 한번 받으면 캐싱해서 쓰므로 all()로 받아와서 캐싱해놓는다.
    # N+1 문제를 해결하기 위해 related fields는 select_related, prefetch_related사용.
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        # 캐싱된 .all() 에서 필터링하여 사용하기 위해 오버라이드.
        timesince = timezone.now() - timedelta(days=3)
        qs = super().get_queryset()
        qs.filter(
            Q(author=self.request.user)
            | Q(author=self.request.user.following_set.all())
        )
        # self.request.user는 string이 아닌 UserInstance임(User.objects().get(username="asdf"))
        qs.filter(created_at__gte=timesince)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        # return super().perform_create(serializer) # Q: 강사님 이부분 왜 넣으신거지?


class PostRUDView(RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer

    # ListView와 마찬가지로 DetailView도 대상(나, 팔로우)것만 보여야 하므로
    def get_queryset(self):
        # 캐싱된 .all() 에서 필터링하여 사용하기 위해 오버라이드.
        timesince = timezone.now() - timedelta(days=3)
        qs = super().get_queryset()
        qs.filter(
            Q(author=self.request.user)
            | Q(author=self.request.user.following_set.all())
        )
        # self.request.user는 string이 아닌 UserInstance임(User.objects().get(username="asdf"))
        qs.filter(created_at__gte=timesince)
        return qs
