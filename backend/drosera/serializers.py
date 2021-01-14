from django.contrib.auth import get_user_model
from django.http import request
from rest_framework import serializers
from rest_framework.utils import serializer_helpers
from .models import Post, Comment, Photo, Species
import re

# Post Serializer 요구사항
# (1): 작성되어야할 필드 | 불러와야할 필드 명시
# (2): related_field에서 pk가 아닌 필요한 값으로 가져오도록 nested serializer구성
# (3): author는 request에서 자동작성-> read_only=True


class AuthorSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField("get_avatar_url")

    def get_avatar_url(self, author):
        # Host주소를 아는 경우
        if re.match(r"^https?://", author.avatar_url):
            # same as
            # author.profile_img_url.startswith("http://") or
            # author.profile_img_url.startswith("https://")
            return author.avatar_url

        # Host주소를 모르는 경우 -> request정보가 필요
        if "request" in self.context:
            scheme = self.context["request"].scheme  # "http" or "https"
            host = self.context["request"].get_host()
            return scheme + "://" + host + author.avatar_url

    class Meta:
        model = get_user_model()
        fields = ["username", "avatar_url"]


class PhotoSerializer(serializers.ModelSerializer):
    # url = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = ["url", "created_at"]


class PostSpeciesSerializer(serializers.ModelSerializer):
    scientific_name = serializers.SerializerMethodField("scientific_name_field")

    def scientific_name_field(self, species):
        return species.genus + " " + species.specific_name

    class Meta:
        model = Species
        fields = ["index", "scientific_name", "common_name", "common_name_KOR"]


class PostSerializer(serializers.ModelSerializer):
    # fileList -> elements in this list has to be either Image or Video. WriteONLY. How...?
    author = AuthorSerializer(read_only=True)
    subject_species = PostSpeciesSerializer(read_only=True)
    # subject_species_pk = serializers.IntegerField(write_only=True)

    ##TEST: when read -> use PhotoSerializer. when write -> just pass the data in raw.  does it work?
    # RESULT: it doesn't' work. raise attribute error. by relatedmanager.
    # error message: 'RelatedManager' object has no attribute 'url'.
    # => I found why I faild. i didn't add 'many=True'
    # works after adding many=True.
    photo_set = PhotoSerializer(many=True, read_only=True)

    is_like = serializers.SerializerMethodField("is_like_field")
    like_user_count = serializers.SerializerMethodField("like_user_count_field")

    def is_like_field(self, post):
        if "request" in self.context:
            user = self.context["request"].user
            try:
                is_like = post.like_user_set.filter(pk=user.pk).exists()
                # Q: Is this filtered by Hash?(O(1)) or Linear search?(O(n))
                # Maybe this can be counted in user's aspect. e.g. this_post in user.like_post_set
            except:  # e.g. anonymous user or post without like_user_set.
                is_like = False
            return is_like
        return False

    def like_user_count_field(self, post):
        try:
            return post.like_user_set.count()
        except Exception as e:
            print("exeption while counting like_users: ", e)
            return 0

    # photoes = PhotoSerializer()
    # 글자 입력이 아닌. 기존 Species중에서 선택하게 하고싶은데..
    # 아니면 글자 입력시 자동추천...
    # TODO: post_create에서 제대로 구현하기.

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "caption",
            "location",
            "created_at",
            "subject_species",
            # "subject_species_pk",
            "photo_set",
            "is_like",
            "like_user_count"
            # "photoes",
        ]
        extra_kwargs = {
            # "subject_species_pk": {"write_only": True},
            "photo_set": {"read_only": True},
        }
        # TODO: Q: like_user_set을 가져오지 않고 like_user_set의 길이만 가져오려면?


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    is_author = serializers.SerializerMethodField("is_author_field")

    def is_author_field(self, comment):
        if "request" in self.context:
            user = self.context["request"].user
            return comment.author.pk == user.pk
        return False

    class Meta:
        model = Comment
        fields = ["id", "author", "message", "is_author"]


class PredictImageSerializer(serializers.Serializer):

    pass


class SpeceisDictSerializer(serializers.ModelSerializer):
    # userHaveMet = serializers.SerializerMethodField("userHaveMetField")

    # def userHaveMetField(self, species):
    #     if "request" in self.context:
    #         user = self.context["request"].user
    #     if species in user.met_species_set:
    #        return True
    ## user의 post.subject_species를 count해서 따로 보관?? user-species간의 manytomany를 만들고

    class Meta:
        model = Species
        fields = "__all__"