from django.db.models.aggregates import Avg
from django.shortcuts import render
from django.db.models import Q, query, Count, F, Prefetch
from django.contrib.auth import get_user, get_user_model
from django.utils import timezone, timesince
from django.views.generic import View
from datetime import timedelta, datetime
from rest_framework import status
from rest_framework import pagination
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveDestroyAPIView,
    RetrieveUpdateDestroyAPIView,
    GenericAPIView,
    DestroyAPIView,
    get_object_or_404,
)
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin
from rest_framework.views import APIView
from .models import Post, Photo, Comment, Species
from .serializers import (
    CommentSerializer,
    PostSerializer,
    PhotoSerializer,
    PredictImageSerializer,
    SpeciesDictSerializer,
    MyCollectionSerializer,
    MyPostSerializer,
)
import json

# TODO: Make Async Prediction Server using FastAPI
# import tensorflow as tf
# import numpy as np
# from PIL import Image

# tf_model = tf.keras.models.load_model("v0.0.2_over100(327 species)_Oct.18.1107.h5")

# species_info = (
#     Species.objects.all()
# )  # load table on memory. # loading as a dict will be also effecient.
# species_info_dict = {
#     record.index: [
#         record.index,
#         record.genus + " " + record.specific_name,
#         record.common_name_KOR,
#         record.common_name,
#         record.id,
#     ]
#     for record in species_info
# }
# species_info_dict2 = {
#     record.id: [
#         record.index,
#         record.genus + " " + record.specific_name,
#         record.common_name_KOR,
#         record.common_name,
#         record.id,
#         record.wiki_thumbnail_url,
#     ]
#     for record in species_info
# }
# print(species_info_dict)


class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 18
    page_size_query_param = "page_size"
    max_page_size = 20


class MyPostPagination(pagination.PageNumberPagination):
    page_size = 18
    page_size_query_param = "page_size"
    max_page_size = 20


class MyPostListView(ListAPIView):
    queryset = (
        Post.objects.all()
        .select_related("subject_species")
        .prefetch_related("photo_set", "comment_set")
    )
    serializer_class = MyPostSerializer
    pagination_class = MyPostPagination

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(author=self.request.user)
        return qs


class PostListCreateView(ListCreateAPIView):
    # queryset은 한번 받으면 캐싱해서 쓰므로 all()로 받아와서 캐싱해놓는다.
    # N+1 문제를 해결하기 위해 related fields는 select_related, prefetch_related사용.

    # Q: Very Import Question for Optimization
    # like_user_set이나 comment_set의 경우 일부만 보여줘도 되는데 모두를 불러와 보여주게 된다.
    # 어떻게 줄일 수 있을까..? 불러오기부터 줄여올 수 있다면 더 좋고, 아니라면 보여주기라도 줄이는게 좋다.
    # 일단 여러가지로 찾아봐도 안나오거나 안된다. Prefetch로 limit 거는것도 안되고, 마땅한 subquery도 없는듯?
    queryset = Post.objects.all().select_related("author", "subject_species")

    # .filter() #subquery로 특정 post의 like_user_set을 일부만.

    serializer_class = PostSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # 캐싱된 .all() 에서 필터링하여 사용하기 위해 오버라이드.
        timesince = timezone.now() - timedelta(days=30)
        qs = super().get_queryset()

        # Uncomment after implement of authentication & authorization.
        qs = (
            qs.filter(
                # Q(author=self.request.user)|
                # Q(author__in=self.request.user.following_set.all())
                author__in=self.request.user.following_set.all()
            )
            .filter(created_at__gte=timesince)
            .prefetch_related("photo_set", "comment_set", "tag_set", "like_user_set")
            .prefetch_related(
                # prefetch can be regarded as a query "SELECT ... WHERE ... IN ..." which tags along previous queryset.
                # assigning "queryset" argument is like linking additional queries on it.
                # limiting(slicing) is not allowed(Q:why?). but additional filtering can be done.
                Prefetch(
                    # 포스팅에 좋아요를 누른 사람들 중 내가 팔로우 하는 사람들...
                    # is this right? => it seems it is working without any noticeable problem(like N+1)!
                    "like_user_set",
                    queryset=get_user_model().objects.all()
                    & self.request.user.following_set.all(),
                    to_attr="like_following_user_set",
                )
            )
        )
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
        ), "photo_metatada_set and photo_set have different length."
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
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # permission check. Q: Can this checked by rest_framework.permission? (by assigning permission class.)
        if self.request.user == instance.author:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)


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


# class PredictSpeciesAPIView(GenericAPIView):
#     serializer_class = PredictImageSerializer

#     def post(self, request, *args, **kwargs):
#         image_to_classify = request.data.get("file").file
#         image_to_classify_PIL = (
#             Image.open(image_to_classify).convert("RGB").resize((456, 456))
#         )
#         nd_array = np.expand_dims(np.array(image_to_classify_PIL) / 255.0, axis=0)
#         result = tf_model.predict(nd_array)
#         # result_index = result.argmax(axis=1)[0] + 1
#         # if (538 <= result_index <= 590) or result_index in [593, 594, 595]:
#         #     result_index = 600  # no-bird
#         # result_index = "AV_000" + f"{result_index:0>3}"
#         # print("result_index:", result_index)

#         result_top3 = (
#             np.argsort(result, axis=1)[0, ::-1][:3] + 1
#         )  # add 1 to each elements
#         print("result_top3: ", result_top3)
#         result_top3_index = [
#             "AV_000600"
#             if (538 <= result <= 590) or result in [593, 594, 595]
#             else "AV_000" + f"{result:0>3}"
#             for result in result_top3
#         ]
#         # result_top3_dict = [species_info_dict[i] for i in result_top3_index]

#         return Response(
#             data=result_top3_index,  # result_top3_dict,
#             # data = {
#             #     "common_name_KOR": species_instance.common_name_KOR,
#             #     "scientific_name": species_instance.genus + " " + species.specific_name,
#             # },
#             status=status.HTTP_202_ACCEPTED,
#         )


class BirdDictAPIView(GenericAPIView):
    # queryset = Species.objects.all().prefetch_related("like_user_set")
    # serializer_class = SpeciesDictSerializer  # doesn't matter because it isn't used

    def get(self, request):
        species_info = (
            Species.objects.all()
        )  # load table on memory. # loading as a dict will be also effecient.
        species_info_dict = {
            record.index: [
                record.index,
                record.genus + " " + record.specific_name,
                record.common_name_KOR,
                record.common_name,
                record.id,
            ]
            for record in species_info
        }
        return Response(data=species_info_dict, status=status.HTTP_200_OK)


class BirdDict2APIView(GenericAPIView):
    # queryset = Species.objects.all().prefetch_related("like_user_set")
    # serializer_class = SpeciesDictSerializer  # doesn't matter because it isn't used
    def get(self, request):
        species_info = Species.objects.all()  # load table on memory
        species_info_dict2 = {
            record.id: [
                record.index,
                record.genus + " " + record.specific_name,
                record.common_name_KOR,
                record.common_name,
                record.id,
                record.wiki_thumbnail_url,
            ]
            for record in species_info
        }
        return Response(data=species_info_dict2, status=status.HTTP_200_OK)


class MyCollectionView(ListAPIView):
    queryset = (
        Post.objects.all().select_related("author").prefetch_related("subject_species")
    )
    serializer_class = MyCollectionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = (
            self.queryset.filter(author=self.request.user)
            .values("subject_species")
            .annotate(species=F("subject_species"))
            .annotate(count=Count("subject_species"))
            # https://docs.djangoproject.com/en/3.1/topics/db/aggregation/
            # Interaction with default ordering or order_by()
            .order_by()
            .order_by("subject_species")
        )
        print(qs)
        return qs


# 유저가 만난 종.
# 자기가 쓴 글(userinstance.post_set)의 species(.values(species))를 나타내는 column을 만들고 거기서 species 별로 count
# model을 하나 만들고. UserCollection 만들고 레코드에 유저, 종, count적으면 되겠네.

# 유저가 구입한 물품의 횟수 구하는것과 유사..?
# User.