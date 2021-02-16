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
        # Host주소가 avatar_url에 이미 포함된 경우.
        if re.match(r"^https?://", author.avatar_url):
            # same as
            # author.profile_img_url.startswith("http://") or
            # author.profile_img_url.startswith("https://")
            return author.avatar_url

        # avatar_url에 Host정보가 없는경우 -> request정보에서 가져옴.
        if "request" in self.context:
            # scheme = self.context["request"].scheme  # "http" or "https"
            # host = self.context["request"].get_host()
            # return scheme + "://" + host + author.avatar_url

            # 그러나 nginx에서 proxy_pass로 request를 전달하면서 host명을 django로 덮어씀;
            # 임시방편으로 EC2의 address를 그대로 사용
            return "http://d16c239m5uwjv8.cloudfront.net" + author.avatar_url

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


class MyPostSerializer(serializers.ModelSerializer):
    comment_count = serializers.SerializerMethodField("comment_count_field")
    like_user_count = serializers.SerializerMethodField("like_user_count_field")
    photo_set = PhotoSerializer(many=True)
    subject_species = PostSpeciesSerializer()

    def like_user_count_field(self, post):
        try:
            return post.like_user_set.count()
        except Exception as e:
            print("exeption while counting like_users: ", e)
            return 0

    def comment_count_field(sef, post):
        try:
            return post.comment_set.count()
        except Exception as e:
            print("exeption while counting comments: ", e)
            return 0

    class Meta:
        model = Post
        fields = [
            "id",
            "subject_species",
            "comment_count",
            "created_at",
            "photo_set",
            "like_user_count",
        ]


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
    comment_set = CommentSerializer(many=True, read_only=True)
    # like_user_set = AuthorSerializer(many=True, read_only=True)
    like_user_set = serializers.SerializerMethodField("like_user_set_field")
    like_following_user_set = AuthorSerializer(many=True, read_only=True)
    is_like = serializers.SerializerMethodField("is_like_field")
    like_user_count = serializers.SerializerMethodField("like_user_count_field")

    def like_user_set_field(self, post):
        """Return the users who like the post"""
        user = self.context["request"].user
        # print("12", post.like_following_user_set)
        return (
            {"username": i.username}
            for i in post.like_user_set.all()[:50]
            # for i in post.like_following_user_set[:50]
            # limiting to 50 people
            # Check if it is ordered in "last like first"
        )

    def is_like_field(self, post):
        if "request" in self.context:
            user = self.context["request"].user
            try:
                is_like = user.pk in set(
                    i.pk for i in post.like_user_set.all()
                )  # Less query(sql).
                # is_like = post.like_user_set.filter(pk=user.pk).exists() # additional filtering on prefetched query => More query

            except Exception as e:  # e.g. anonymous user or post without like_user_set.
                print(e)
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
            "updated_at",
            "subject_species",
            "comment_set",
            "photo_set",
            "is_like",
            "like_user_set",
            "like_user_count",
            "like_following_user_set",
        ]
        extra_kwargs = {
            # "subject_species_pk": {"write_only": True},
            "photo_set": {"read_only": True},
        }
        # TODO: Q: like_user_set을 가져오지 않고 like_user_set의 길이만 가져오려면?


class PredictImageSerializer(serializers.Serializer):

    pass


class SpeciesDictSerializer(serializers.ModelSerializer):
    # userHaveMet = serializers.SerializerMethodField("userHaveMetField")

    # def userHaveMetField(self, species):
    #     if "request" in self.context:
    #         user = self.context["request"].user
    #     if species in user.met_species_set:
    #        return True
    ## user의 post.subject_species를 count해서 따로 보관?? user-species간의 manytomany를 만들고

    class Meta:
        model = Species
        fields = [
            "id",
            "common_name",
            "common_name_KOR",
            "specific_name",
            "genus",
            "index",
        ]


class MyCollectionSerializer(serializers.Serializer):
    # subject_species = serializers.IntegerField()
    species = serializers.IntegerField()

    # species = serializers.SerializerMethodField("species_field")
    # def species_field(self, species):
    #     return SpeciesDictSerializer(
    #         Species.objects.get(pk=species["subject_species"])
    #     ).data

    # subject_species__count = serializers.IntegerField()
    count = serializers.IntegerField()