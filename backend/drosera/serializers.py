from django.contrib.auth import get_user_model
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
    class Meta:
        model = Photo
        fields = ["url"]


class PostSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ["common_name"]


class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    subject_species = PostSpeciesSerializer()
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
            "tag_set",
            "subject_species",
            "photo_set",
            # "photoes",
        ]
        # TODO: Q: like_user_set을 가져오지 않고 like_user_set의 길이만 가져오려면?


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["author", "message"]