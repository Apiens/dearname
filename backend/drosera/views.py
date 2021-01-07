from django.shortcuts import render
from django.db.models import Q, query
from django.utils import timezone, timesince
from datetime import timedelta, datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    GenericAPIView,
    DestroyAPIView,
    get_object_or_404,
)
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin
from .models import Post, Photo, Comment, Species
from .serializers import CommentSerializer, PostSerializer, PhotoSerializer
import json

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
    queryset = (
        Post.objects.all()
        .select_related("author")
        .prefetch_related("tag_set", "like_user_set")
    )
    serializer_class = PostSerializer

    def get_queryset(self):
        # 캐싱된 .all() 에서 필터링하여 사용하기 위해 오버라이드.
        timesince = timezone.now() - timedelta(days=30)
        qs = super().get_queryset()

        # Uncomment after implement of authentication & authorization.
        qs = qs.filter(
            Q(author=self.request.user)
            | Q(author__in=self.request.user.following_set.all())
        )
        # self.request.user는 string이 아닌 UserInstance임(User.objects().get(username="asdf")
        # TODO: -> 이거 qs=qs.filter로 받아야 함.

        qs = qs.filter(created_at__gte=timesince)
        return qs

    def perform_create(self, serializer):
        # print("request.data: ", self.request.data)

        # creating a post instance
        author = self.request.user
        subject_species = Species.objects.get(
            pk=self.request.data["subject_species_pk"]  # TODO: use .get()
        )
        print(subject_species)
        post_instance = serializer.save(author=author, subject_species=subject_species)

        # creating photo instances

        # request.data is querydict(multi value dict).
        # data['photo_set'] will return only the last value.
        # data.getlist('photo_set') will return the list of values.
        # as serializer expects a dictionary as an element, put the file into the dictionary.

        photo_metadata_set = []
        for meta_JSON in self.request.data.getlist(
            "photo_metadata_set"
        ):  # list of JSON string.
            datetime_string_or_None = json.loads(meta_JSON).get("DateTimeOriginal")
            metadata = {}
            try:
                metadata["created_at"] = datetime.strptime(
                    datetime_string_or_None, "%Y:%m:%d %H:%M:%S"
                )
            except Exception as e:
                print(
                    "Exeption while parsing created_at from EXIF metadata. Error: ", e
                )
                metadata["created_at"] = datetime.now()
            photo_metadata_set.append(metadata)

        photo_set = self.request.data.getlist("photo_set")  # list of file instances

        assert len(photo_metadata_set) == len(
            photo_set
        ), "photo_metatada_set and photh_set have different length."
        photo_set_serializer = PhotoSerializer(
            data=[
                {
                    "url": photo,
                    "created_at": metadata["created_at"],
                }
                for photo, metadata in zip(photo_set, photo_metadata_set)
            ],
            many=True,
        )
        print("photo_set_serializer: ", photo_set_serializer)
        photo_set_serializer.is_valid(raise_exception=True)
        photo_set_serializer.save(
            attached_post=post_instance, author=author, subject_species=subject_species
        )


class PostRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer


class PostLikeCreateDestroyView(GenericAPIView):
    def post(self, request, *args, **kwargs):
        print("post() executed")
        post_instance = get_object_or_404(Post, pk=self.kwargs["post_id"])
        post_instance.like_user_set.add(self.request.user)
        return Response(status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        print("delete() executed")
        post_instance = get_object_or_404(Post, pk=self.kwargs["post_id"])
        post_instance.like_user_set.remove(self.request.user)
        return Response(status.HTTP_204_NO_CONTENT)


class PhotoListCreateView(ListCreateAPIView):
    queryset = Photo.objects.all()  # .filter(attached_post=Post.objects.first())

    serializer_class = PhotoSerializer

    # def get_queryset(self):
    #     post_obj = Post.objects.get(id=self.kwargs["post_id"])
    #     queryset = super().get_queryset().filter(attached_post=post_obj)
    #     print(queryset)
    #     return queryset

    def get_queryset(self):
        post_obj = Post.objects.get(id=self.kwargs["post_id"])
        qs = super().get_queryset().filter(attached_post=post_obj)

        # qs = super().get_queryset()
        # qs.filter(attached_post=post_obj)
        # 왜 이건 안됄까...?
        # 알았다
        # qs = super().get_queryset()
        # qs = qs.filter(attached_post=post_obj)
        # 이렇게 했어야 했다. (qs는 필터를 걸면 자기는 가만있고 새로운 qs를 리턴한다.)
        return qs


class CommentListCreateView(ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_obj = Post.objects.get(id=self.kwargs["post_id"])
        qs = super().get_queryset().filter(post=post_obj)[:3]
        return qs

    def perform_create(self, serializer):
        post = get_object_or_404(Post, pk=self.kwargs["post_id"])
        serializer.save(author=self.request.user, post=post)
        print("comment request.data: ", self.request.data)
        print("comment type(request.data): ", type(self.request.data))
        return super().perform_create(serializer)


class CommentDestroyAPIView(DestroyAPIView):
    queryset = Comment.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # permission check. Q: Can this checked by rest_framework.permission? (by assigning permission class.)
        if self.request.user == instance.author:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        # return Response(status=status.HTTP_204_NO_CONTENT)